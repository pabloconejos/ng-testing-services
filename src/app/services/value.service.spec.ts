import { ValueService } from './value.service';
import { TestBed } from '@angular/core/testing'

describe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ValueService ]
    })
    service = TestBed.inject(ValueService)
  })

  it('should be create', () => {
    expect(service).toBeTruthy();
  });

  describe('Test for getValue', () => {
    it('should return "my value"', () => {
      expect(service.getValue()).toEqual('my value')
    })
  });

  describe('Test for setValue', () => {
    it('should change value', () => {
      expect(service.getValue()).toBe('my value')
      service.setValue('change')
      expect(service.getValue()).toBe('change')
    })
  });

  describe('Test for getPromise', () => {
    it('should return "primise value" from promise with then', (doneFn) => {
      service.getPromiseValue()
      .then((value) => {
        // assert
        expect(value).toBe('promise value')
        doneFn(); // se le indica que acaba aqui
      })
    })

    it('should return "primise value" from promise using async', async () => {
      const rta = await service.getPromiseValue()
      expect(rta).toBe('promise value')
    })
    
  });


  describe('Test for getObservable', () => {
    it('should return "observable value" from an observable', (doneFn) => {
      service.getObservableValue().subscribe( value => {
        expect(value).toBe('observable value')
        doneFn();
      })
    })
  })


  
});
