import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, NO_ERRORS_SCHEMA } from '@angular/core';

import { SeachBarComputer } from './seach-bar-computer';
import { CityDataService } from '../../../../shared/services/city-data.services';
import { TranslatePipe } from '@ngx-translate/core';

@Pipe({
  name: 'translate',
  standalone: true
})
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('SeachBarComputer', () => {
  let component: SeachBarComputer;
  let fixture: ComponentFixture<SeachBarComputer>;

  const cityDataServiceMock = {
    getAllCities: jasmine.createSpy('getAllCities').and.returnValue([
      { name: 'Douala', country: 'Cameroun' },
      { name: 'Yaoundé', country: 'Cameroun' }
    ])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeachBarComputer],
      providers: [
        {
          provide: CityDataService,
          useValue: cityDataServiceMock
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(SeachBarComputer, {
        remove: {
          imports: [TranslatePipe]
        },
        add: {
          imports: [MockTranslatePipe]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(SeachBarComputer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    cityDataServiceMock.getAllCities.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cities on init', () => {
    expect(cityDataServiceMock.getAllCities).toHaveBeenCalled();
    expect(component.cities.length).toBe(2);
  });

  it('should return false when no city and no dates are provided', () => {
    component.destCity = null;
    component.fromDate = null;
    component.toDate = null;

    expect(component.canSearch).toBeFalse();
  });

  it('should return true when destination city is provided', () => {
    component.destCity = 'Douala';

    expect(component.canSearch).toBeTrue();
  });

  it('should return true when both dates are provided', () => {
    component.fromDate = new Date('2026-06-10');
    component.toDate = new Date('2026-06-20');

    expect(component.canSearch).toBeTrue();
  });

  it('should return false when only fromDate is provided', () => {
    component.fromDate = new Date('2026-06-10');
    component.toDate = null;

    expect(component.canSearch).toBeFalse();
  });

  it('should return false when only toDate is provided', () => {
    component.fromDate = null;
    component.toDate = new Date('2026-06-20');

    expect(component.canSearch).toBeFalse();
  });

  it('should emit search event when canSearch is true', () => {
    spyOn(component.search, 'emit');

    component.destCity = ' Douala ';
    component.fromDate = null;
    component.toDate = null;

    component.onSearch();

    expect(component.search.emit).toHaveBeenCalledWith({
      destCity: 'Douala',
      fromDate: null,
      toDate: null
    });
  });

  it('should not emit search event when canSearch is false', () => {
    spyOn(component.search, 'emit');

    component.destCity = null;
    component.fromDate = new Date('2026-06-10');
    component.toDate = null;

    component.onSearch();

    expect(component.search.emit).not.toHaveBeenCalled();
  });
});