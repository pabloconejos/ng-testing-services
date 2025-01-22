import { MasterService } from './master.service';
import { FakeValueService } from './value-fake.service';
import { ValueService } from './value.service';
import { TestBed } from '@angular/core/testing'

describe('MasterService', () => {

  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>
  // Cuando pruebas dependencias desde un servicio no importa no lo que devuelva (esas pruebas estaran en su archivo correspondiente) importa que se ejecute

  beforeEach( () => {
    const spy = jasmine.createSpyObj('ValueService', ['getValue'])
    TestBed.configureTestingModule({
      providers: [ 
        MasterService,
        { provide: ValueService, useValue: spy }
       ]
    })
    masterService = TestBed.inject(MasterService)
    valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>
  })

  it('should be create', () => {
    expect(masterService).toBeTruthy()
  })

  // it('should return "my value" from the real service', () => {
  //   let valueService: ValueService = new ValueService()
  //   let masterService: MasterService = new MasterService(valueService)
  //   expect(masterService.getValue()).toBe('my value');
  // });

  // it('should return "other value" from the fake service', () => {
  //   let fakeValueService = new FakeValueService()
  //   let masterService: MasterService = new MasterService(fakeValueService as unknown as ValueService)
  //   expect(masterService.getValue()).toBe('fake value');
  // });

  // it('should return "other value" from the fake object', () => {
  //   let fake = { getValue: () => 'fake from obj'};
  //   let masterService = new MasterService(fake as ValueService)
  //   expect(masterService.getValue()).toBe('fake from obj');
  // });

  it('should call to getValue from ValueService', () => {
    valueServiceSpy.getValue.and.returnValue('fake value');
    expect(masterService.getValue()).toBe('fake value');
    expect(valueServiceSpy.getValue).toHaveBeenCalled()
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1)
  });
});
