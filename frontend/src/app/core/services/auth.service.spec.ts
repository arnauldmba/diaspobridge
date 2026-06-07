import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';

import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { User } from '../../model/users.model';
import { LoginRequest } from '../../model/LoginRequest';
import { Role } from '../../model/role.models';
import { provideRouter } from '@angular/router';

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
  });

  /** Test cases for login() method */
  describe('login()', () => {

    it('should send login request with correct credentials', () => {
      service.login(mockLoginRequest).subscribe((response) => {
        expect(response.body).toEqual(mockUser);
        expect(response.status).toBe(200);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoginRequest);

      req.flush(mockUser, {
        status: 200,
        statusText: 'OK'
      });
    });

    it('should handle invalid credentials error', () => {
      service.login(mockLoginRequest).subscribe({
        next: () => fail('Expected an authentication error'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);

      req.flush(
        { message: 'Invalid credentials' },
        { status: 401, statusText: 'Unauthorized' }
      );
    });
  });

  /** Test cases for registerUser() method */
  describe('registerUser()', () => {

    it('should send register request with user data', () => {
      const newUser: User = {
        id: 0,
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        phone: '+1111111111',
        role: Role.TRANSPORTER,
        isActive: true,
        isBlocked: false,
        emailVerified: false,
        password: 'securePassword123',
        createdAt: '',
        updatedAt: '',
        deletedAt: ''
      };

      service.registerUser(newUser).subscribe((response) => {
        expect(response.body).toEqual(newUser);
        expect(response.status).toBe(201);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/register`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      expect(req.request.body.email).toBe('newuser@example.com');

      req.flush(newUser, { status: 201, statusText: 'Created' });
    });

    it('should handle duplicate email error', () => {
      service.registerUser(mockUser).subscribe({
        next: () => fail('Expected a duplicate email error'),
        error: (error) => {
          expect(error.status).toBe(409);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/register`);

      req.flush(
        { message: 'Email already exists' },
        { status: 409, statusText: 'Conflict' }
      );
    });
  });

  /** Test cases for validateEmail() method */
  describe('validateEmail()', () => {
    
    it('should verify email with verification code', () => {
      const verificationCode = 'verify123abc';

      service.validateEmail(verificationCode).subscribe((user) => {
        expect(user).toEqual(mockVerifyUser);
        expect(user.emailVerified).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/verifyEmail/${verificationCode}`);

      expect(req.request.method).toBe('GET');

      req.flush(mockVerifyUser);
    });
  });

  /** Test cases for resendVerification() method */
  describe('resendVerification()', () => {
    it('should resend verification email to specified address', () => {
      const email = 'user@example.com';

      service.resendVerification(email).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/verifyEmail/resend`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });

      req.flush({ message: 'Verification email sent' });
    });
  });

  /** Test cases for resetPassword() method */
  describe('resetPassword()', () => {

    it('should send reset password request with token and new password', () => {
      const resetToken = 'reset-token-123abc';
      const newPassword = 'newSecurePassword123!';

      service.resetPassword(resetToken, newPassword).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/reset-password`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token: resetToken, newPassword });
      req.flush(null);
    });
  });

  /** Test cases for getCurrentUser2() method */
  describe('getCurrentUser2()', () => {
    it('should fetch user data by user ID', () => {
      const userId = 1;

      service.getCurrentUser2(userId).subscribe((user) => {
        expect(user).toEqual(mockUser);
        expect(user.id).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/users/${userId}`);

      expect(req.request.method).toBe('GET');

      req.flush(mockUser);
    });
  });
});
