import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { User } from '../../../model/users.model';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../../../model/LoginRequest';
import { environment } from '../../../../environments/environment';
import { Role } from '../../../model/role.models';

const mockUser: User = {
  id: 1,
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  role: Role.TRANSPORTER,
  isActive: true,
  isBlocked: false,
  emailVerified: true,
  createdAt: '2026-01-01T10:00:00Z',
  updatedAt: '2026-01-01T10:00:00Z',
  deletedAt: ''
};

const mockLoginRequest: LoginRequest = {
  email: 'john.doe@example.com',
  password: 'password123'
};

const mockVerifyUser: User = {
  id: 2,
  email: 'jane.smith@example.com',
  firstName: 'Jane',
  lastName: 'Smith',
  phone: '+9876543210',
  role: Role.TRANSPORTER,
  isActive: true,
  isBlocked: false,
  emailVerified: true,
  createdAt: '2026-01-02T10:00:00Z',
  updatedAt: '2026-01-02T10:00:00Z',
  deletedAt: ''
};

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should login user', () => {
    const loginRequest: LoginRequest = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test'
    } as User;

    service.login(loginRequest).subscribe((response) => {
      expect(response.body).toEqual(mockUser);
      expect(response.status).toBe(200);
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/login`);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginRequest);

    req.flush(mockUser, {
      status: 200,
      statusText: 'OK'
    });
  });


});