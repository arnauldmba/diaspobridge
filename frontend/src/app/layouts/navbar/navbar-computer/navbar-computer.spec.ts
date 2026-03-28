import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComputer } from './navbar-computer';

describe('NavbarComputer', () => {
  let component: NavbarComputer;
  let fixture: ComponentFixture<NavbarComputer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComputer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComputer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
