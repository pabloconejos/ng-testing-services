import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from '../interceptors/token.interceptor';
import { Auth } from '../models/auth.model';
import { environment } from '../environments/environment';

describe('AuthService', () => {
  let authService: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;  
  
  beforeEach(() => {
    TestBed.configureTestingModule({
          providers: [
            provideHttpClient(withInterceptors([tokenInterceptor])), // Registro del interceptor funcional
            provideHttpClientTesting(), // Configuración de pruebas
            TokenService,
            AuthService
          ],
        });
    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    httpController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpController.verify()
  })

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });


  describe('Test for login', () => {
    it('should return a token', (doneFn) => {
      // ARRANGE
      const mockData: Auth = {
        access_token: '1232121'
      }
      const email = 'pablo@pablo.com'
      const password = '1234'
      // ACT
      authService.login(email, password).subscribe( data => {
        expect(data).toEqual(mockData)
        doneFn();
      })

      const url = `${environment.API_URL}/api/v1/auth/login`
      const req = httpController.expectOne(url)
      req.flush(mockData)
    })


    it('should call saveToken', (doneFn) => {
      // ARRANGE
      const mockData: Auth = {
        access_token: '1232121'
      }
      const email = 'pablo@pablo.com'
      const password = '1234'
      spyOn(tokenService, 'saveToken').and.callThrough() // no llama a la funcion real pero puedo espiarla
      // ACT
      authService.login(email, password).subscribe( data => {
        expect(data).toEqual(mockData)
        expect(tokenService.saveToken).toHaveBeenCalledTimes(1)
        expect(tokenService.saveToken).toHaveBeenCalledWith('1232121') // le decimos si el parametro ha sido ese
        doneFn();
      })

      const url = `${environment.API_URL}/api/v1/auth/login`
      const req = httpController.expectOne(url)
      req.flush(mockData)
    })
  })
});
