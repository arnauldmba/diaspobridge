import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';

import { Login } from './login';
import { AuthService } from '../../../../core/services/auth.service';

@Pipe({
  name: 'translate',
  standalone: true
})

class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  const authServiceMock = {
    login: jasmine.createSpy('login'),
    saveToken: jasmine.createSpy('saveToken'),
    loadCurrentUser: jasmine.createSpy('loadCurrentUser')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [Login],
        providers: [
            provideRouter([]),
            {
            provide: AuthService,
            useValue: authServiceMock
            }
        ]
    })
    .overrideComponent(Login, {
        remove: {
            imports: [TranslatePipe]
        },
        add: {
            imports: [MockTranslatePipe]
        }
        })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    authServiceMock.login.calls.reset();
    authServiceMock.saveToken.calls.reset();
    authServiceMock.loadCurrentUser.calls.reset();
    sessionStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update email and password inputs', async () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const emailInput = compiled.querySelector('input[name="email"]') as HTMLInputElement;
    const passwordInput = compiled.querySelector('input[name="passwordHash"]') as HTMLInputElement;

    emailInput.value = 'john.doe@example.com';
    emailInput.dispatchEvent(new Event('input'));

    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.requestUser.email).toBe('john.doe@example.com');
    expect(component.requestUser.password).toBe('password123');
  });

  it('should call AuthService.login when button is clicked', () => {
    const response = new HttpResponse({
      body: {},
      headers: new HttpHeaders({
        Authorization: 'Bearer fake-token'
      }),
      status: 200
    });

    authServiceMock.login.and.returnValue(of(response));
    authServiceMock.loadCurrentUser.and.returnValue(of({ role: 'USER' }));

    component.requestUser = {
      email: 'john.doe@example.com',
      password: 'password123'
    };

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'john.doe@example.com',
      password: 'password123'
    });

    expect(authServiceMock.saveToken).toHaveBeenCalledWith('Bearer fake-token');
  });

  it('should show error message when login fails', () => {
    authServiceMock.login.and.returnValue(
      throwError(() => ({
        error: {
          errorCause: 'invalid'
        }
      }))
    );

    component.onLoggdin();

    fixture.detectChanges();

    expect(component.errorLogin).toBe(1);
    expect(component.message).toBe('Login ou mot de passe incorrect');

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Login ou mot de passe incorrect');
  });
});