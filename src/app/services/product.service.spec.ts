import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpStatusCode, provideHttpClient, withInterceptors } from '@angular/common/http';
import { CreateProductDTO, Product } from '../models/products.model';
import { environment } from '../environments/environment';
import { generateManyProducts, generateOneProduct } from '../models/product.mock';
import { TokenService } from './token.service';
import { tokenInterceptor } from '../interceptors/token.interceptor';

describe('ProductService', () => {
  let productService: ProductService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(withInterceptors([tokenInterceptor])), // Registro del interceptor funcional
        provideHttpClientTesting(), // Configuración de pruebas
        TokenService,
      ],
    });
  
    productService = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });
  

  afterEach(() => {
    httpController.verify()
  })

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  describe('tests for getAllSimple', () => {
    it('should retun a product list', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3)
      //act
      productService.getAllSimple().subscribe( (data) => {
        //assert
        expect(data.length).toEqual(mockData.length)
        doneFn()
      })

      //http config (cuando detecte que se hace una peticion a esa url reemplaza la info y no hace una petición real)
      const url = `${environment.API_URL}/api/v1/products`
      const req = httpController.expectOne(url)
      req.flush(mockData)
      
    })
  })

  describe('tests for getAll', () => {
    it('should retun a product list', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3)
      spyOn(tokenService, 'getToken').and.returnValue('123') // espiar solo getToken y hacer el mocking de datos
      //act
      productService.getAll().subscribe( (data) => {
        //assert
        expect(data.length).toEqual(mockData.length)
        doneFn()
      })

      //http config (cuando detecte que se hace una peticion a esa url reemplaza la info y no hace una petición real)
      const url = `${environment.API_URL}/api/v1/products`
      const req = httpController.expectOne(url)
      const headers = req.request.headers
      expect(headers.get('Authorization')).toEqual('Bearer 123')
      expect(req.request.headers.get('Authorization')).toBe('Bearer 123');
      req.flush(mockData)
      
    })

    it('should return product list with taxes', (doneFn) => {
      // arrange
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100 // 100 * .19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200 // 200 * .19 = 38
        },
        {
          ...generateOneProduct(),
          price: 0 // 0 * .19 = 0
        },
        {
          ...generateOneProduct(),
          price: -100 // = 0
        },
      ]

      //act
      productService.getAll().subscribe( (data) => {
        //assert
        expect(data[0].taxes).toEqual(19)
        expect(data[1].taxes).toEqual(38)
        expect(data[2].taxes).toEqual(0)
        expect(data[3].taxes).toEqual(0)


        doneFn()
      })

      //http config (cuando detecte que se hace una peticion a esa url reemplaza la info y no hace una petición real)
      const url = `${environment.API_URL}/api/v1/products`
      const req = httpController.expectOne(url)
      req.flush(mockData)

    })


    it('should send query params with limit 10 and offset 3', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3)
      const limit = 10;
      const offset = 3;
      //act
      productService.getAll(limit, offset).subscribe( (data) => {
        //assert
        expect(data.length).toEqual(mockData.length)
        doneFn()
      })

      //http config (cuando detecte que se hace una peticion a esa url reemplaza la info y no hace una petición real)
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`
      const req = httpController.expectOne(url)
      req.flush(mockData)
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`)
      expect(params.get('offset')).toEqual(`${offset}`)
      
    })

    it('should send query params with limit 10 and offset 0', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3)
      const limit = 10;
      const offset = 0;
      //act
      productService.getAll(limit, offset).subscribe( (data) => {
        //assert
        expect(data.length).toEqual(mockData.length)
        doneFn()
      })

      //http config (cuando detecte que se hace una peticion a esa url reemplaza la info y no hace una petición real)
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`
      const req = httpController.expectOne(url)
      req.flush(mockData)
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`)
      expect(params.get('offset')).toEqual(`${offset}`)

      httpController.verify()
      
    })

    it('shouldn´t send query params with limit 10 and offset null', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3)
      const limit = 10;
      const offset = null;
      //act
      productService.getAll(limit).subscribe( (data) => {
        //assert
        expect(data.length).toEqual(mockData.length)
        doneFn()
      })

      //http config (cuando detecte que se hace una peticion a esa url reemplaza la info y no hace una petición real)
      const url = `${environment.API_URL}/api/v1/products`
      const req = httpController.expectOne(url)
      req.flush(mockData)
      const params = req.request.params;
      expect(params.get('limit')).toBeNull()
      expect(params.get('offset')).toBeNull()
      
    })
  })


  describe('test for create', () => {

    it('should return a new product', (doneFn) => {
      // Arrange
      const mockData: Product = generateOneProduct()
      const dto : CreateProductDTO = { 
        title: 'new',
        price: 100,
        images: ['img'],
        description: 'bla bla bla',
        categoryId: 12
      }
      // Act
      productService.create({...dto}).subscribe( data => {
        // Assert
        expect(data).toEqual(mockData) // aqui verificamos la respuesta
        doneFn();
      })
  
      const url = `${environment.API_URL}/api/v1/products`
      const req = httpController.expectOne(url)
      req.flush(mockData)
      expect(req.request.body).toEqual(dto) // comprobar que la data que le envias es igual a lo que tu enviaste (aqui verificamos lo que le enviamos)
      expect(req.request.method).toEqual('POST')
    })

  })

  describe('test for update', () => {

    it('should update a product', (doneFn) => {
      // ARRANGE
      const mockData: Product = generateOneProduct()
      const dto : CreateProductDTO = { 
        title: 'update',
        price: 100,
        images: ['img'],
        description: 'bla bla bla',
        categoryId: 12
      }
      // ACT
      productService.update(`${mockData.id}`, {...dto}).subscribe( data => {
        // ASSERT
        expect(data).toEqual(mockData)
        doneFn();
      })
      const url = `${environment.API_URL}/api/v1/products/${mockData.id}`
      const req = httpController.expectOne(url)
      req.flush(mockData)
      expect(req.request.body).toEqual(dto) // comprobar que la data que le envias es igual a lo que tu enviaste (aqui verificamos lo que le enviamos)
      expect(req.request.method).toEqual('PUT')
    })

  })

  describe('test for delete', () => {

    it('should DELETE a product', (doneFn) => {
      // ARRANGE
      const mockData = true // lo que va a devolver
      const productId = '1' 
      // ACT
      productService.delete(productId).subscribe( data => {
        // ASSERT
        expect(data).toEqual(mockData)
        doneFn();
      })
      const url = `${environment.API_URL}/api/v1/products/${productId}`
      const req = httpController.expectOne(url)
      req.flush(mockData)
      expect(req.request.url.endsWith(`${productId}`)).toBeTrue(); // comprobar que la data que le envias es igual a lo que tu enviaste (aqui verificamos lo que le enviamos)
      expect(req.request.method).toEqual('DELETE')
    })

  })


  describe('test for getOne', () => {

    it('should return a product', (doneFn) => {
      // ARRANGE
      const mockData: Product = generateOneProduct()
      const productId = '1'
      // ACT
      productService.getOne(productId).subscribe( data => {
        // ASSERT
        expect(data).toEqual(mockData)
        doneFn();
      })
      const url = `${environment.API_URL}/api/v1/products/${productId}`
      const req = httpController.expectOne(url)
      req.flush(mockData)
      expect(req.request.method).toEqual('GET')
    })

    it('should return a 404 ERROR', (doneFn) => {
      // ARRANGE
      const productId = '1'
      const msgError = '404 message'
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError
        
      }
      // ACT
      productService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('El producto no existe')
          doneFn();
        }
      })
      const url = `${environment.API_URL}/api/v1/products/${productId}`
      const req = httpController.expectOne(url)
      expect(req.request.method).toEqual('GET')
      req.flush(msgError, mockError)
    })

    it('should return a 409 ERROR', (doneFn) => {
      // ARRANGE
      const productId = '1'
      const msgError = '409 message'
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError
        
      }
      // ACT
      productService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('Algo esta fallando en el server')
          doneFn();
        }
      })
      const url = `${environment.API_URL}/api/v1/products/${productId}`
      const req = httpController.expectOne(url)
      expect(req.request.method).toEqual('GET')
      req.flush(msgError, mockError)
    })

    it('should return a 401 ERROR', (doneFn) => {
      // ARRANGE
      const productId = '1'
      const msgError = '401 message'
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError
        
      }
      // ACT
      productService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('No estas permitido')
          doneFn();
        }
      })
      const url = `${environment.API_URL}/api/v1/products/${productId}`
      const req = httpController.expectOne(url)
      expect(req.request.method).toEqual('GET')
      req.flush(msgError, mockError)
    })

    it('should return a Unkown Error', (doneFn) => {
      // ARRANGE
      const productId = '1'
      const msgError = '403 message'
      const mockError = {
        status: HttpStatusCode.Forbidden,
        statusText: msgError
        
      }
      // ACT
      productService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('Ups algo salio mal')
          doneFn();
        }
      })
      const url = `${environment.API_URL}/api/v1/products/${productId}`
      const req = httpController.expectOne(url)
      expect(req.request.method).toEqual('GET')
      req.flush(msgError, mockError)
    })


    
  })



});
