import { TestBed } from '@angular/core/testing';

import { MapsService } from './maps.service';

fdescribe('MapsService', () => {
  let mapService: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapsService]
    });
    mapService = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(mapService).toBeTruthy();
  });

  describe('test for getCurrentPosition', () => {

    it('should save the center', () => {
      // Arrange
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((successFn) => {
        const mockGeolocation = {
          coords: {
            accuracy: 5,
            altitude: 100,
            altitudeAccuracy: 10,
            heading: 90,
            latitude: 1000,
            longitude: 1000,
            speed: 3.6,
            toJSON: function () {
              return {
                accuracy: this.accuracy,
                altitude: this.altitude,
                altitudeAccuracy: this.altitudeAccuracy,
                heading: this.heading,
                latitude: this.latitude,
                longitude: this.longitude,
                speed: this.speed,
              };
            },
          },
          timestamp: Date.now(),
          toJSON: function () {
            return {
              coords: this.coords,
              timestamp: this.timestamp,
            };
          },
        };
    
        successFn(mockGeolocation);
      });

      // ACT
      mapService.getCurrentPosition()
      // Assert
      expect(mapService.center.lat).toEqual(1000)
      expect(mapService.center.lng).toEqual(1000)

    })
  })
});
