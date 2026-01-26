import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest, RegisterRequest, ResendCodeRequest, VerifyEmailRequest } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  template: `
    <div class="auth-container">
      <app-notification></app-notification>
      
      <!-- Centered Auth Forms -->
      <div class="auth-forms-section-centered">
        <div class="auth-forms-container">
          <div class="auth-card">
            <!-- Logo -->
            <div class="auth-logo">
              <div class="auth-brand-icon">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h1 class="auth-brand-title">Task Manager</h1>
            </div>

            <!-- Tab Navigation -->
            <div class="auth-tab-navigation">
              <button 
                class="auth-tab-button"
                [class.active]="currentMode === 'login'"
                (click)="setMode('login')">
                Sign In
              </button>
              <button 
                class="auth-tab-button"
                [class.active]="currentMode === 'register'"
                (click)="setMode('register')">
                Sign Up
              </button>
              <button 
                class="auth-tab-button"
                [class.active]="currentMode === 'verify'"
                (click)="setMode('verify')"
                *ngIf="showVerifyTab">
                Verify
              </button>
            </div>

            <!-- Login Form -->
            <div *ngIf="currentMode === 'login'">
              <div class="auth-form-header">
                <h2 class="auth-form-title">Welcome back</h2>
                <p class="auth-form-subtitle">Sign in to your account</p>
              </div>
              
              <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="auth-form">
                <div class="auth-form-group">
                  <label for="loginEmail" class="auth-form-label">Email Address</label>
                  <div class="auth-input-container">
                    <div class="auth-input-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="loginEmail"
                      class="auth-form-input"
                      [class.error]="hasFieldError('email')"
                      [(ngModel)]="loginData.email"
                      name="email"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  <div *ngIf="hasFieldError('email')" class="auth-field-errors">
                    <div *ngFor="let error of getFieldErrors('email')" class="auth-error-text">
                      {{ error }}
                    </div>
                  </div>
                </div>

                <div class="auth-form-group">
                  <label for="loginPassword" class="auth-form-label">Password</label>
                  <div class="auth-input-container">
                    <div class="auth-input-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <input
                      [type]="showLoginPassword ? 'text' : 'password'"
                      id="loginPassword"
                      class="auth-form-input"
                      [class.error]="hasFieldError('password')"
                      [(ngModel)]="loginData.password"
                      name="password"
                      required
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      class="auth-password-toggle"
                      (click)="toggleLoginPasswordVisibility()"
                    >
                      <svg *ngIf="!showLoginPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      <svg *ngIf="showLoginPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                      </svg>
                    </button>
                  </div>
                  <div *ngIf="hasFieldError('password')" class="auth-field-errors">
                    <div *ngFor="let error of getFieldErrors('password')" class="auth-error-text">
                      {{ error }}
                    </div>
                  </div>
                </div>

                <div *ngIf="errorMessage" class="auth-error-message">
                  <div class="auth-error-icon">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span class="auth-error-text">{{ errorMessage }}</span>
                </div>

                <button
                  type="submit"
                  class="auth-submit-button"
                  [disabled]="isLoading"
                >
                  <span *ngIf="isLoading" class="auth-loading-spinner">
                    <div class="auth-spinner"></div>
                    Signing in...
                  </span>
                  <span *ngIf="!isLoading">Sign In</span>
                </button>
              </form>
            </div>

            <!-- Register Form -->
            <div *ngIf="currentMode === 'register'">
              <div class="auth-form-header">
                <h2 class="auth-form-title">Create your account</h2>
                <p class="auth-form-subtitle">Start managing your tasks</p>
              </div>
              
              <form (ngSubmit)="onRegister()" #registerForm="ngForm" class="auth-form">
                <div class="auth-form-group">
                  <label for="registerUsername" class="auth-form-label">Username</label>
                  <div class="auth-input-container">
                    <div class="auth-input-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="registerUsername"
                      class="auth-form-input"
                      [class.error]="hasFieldError('username')"
                      [(ngModel)]="registerData.username"
                      name="username"
                      required
                      placeholder="Choose a username"
                    />
                  </div>
                  <div *ngIf="hasFieldError('username')" class="auth-field-errors">
                    <div *ngFor="let error of getFieldErrors('username')" class="auth-error-text">
                      {{ error }}
                    </div>
                  </div>
                </div>

                <div class="auth-form-group">
                  <label for="registerEmail" class="auth-form-label">Email Address</label>
                  <div class="auth-input-container">
                    <div class="auth-input-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="registerEmail"
                      class="auth-form-input"
                      [class.error]="hasFieldError('email')"
                      [(ngModel)]="registerData.email"
                      name="email"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  <div *ngIf="hasFieldError('email')" class="auth-field-errors">
                    <div *ngFor="let error of getFieldErrors('email')" class="auth-error-text">
                      {{ error }}
                    </div>
                  </div>
                </div>

                <div class="auth-form-group">
                  <label for="registerPassword" class="auth-form-label">Password</label>
                  <div class="auth-input-container">
                    <div class="auth-input-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <input
                      [type]="showRegisterPassword ? 'text' : 'password'"
                      id="registerPassword"
                      class="auth-form-input"
                      [class.error]="hasFieldError('password')"
                      [(ngModel)]="registerData.password"
                      name="password"
                      required
                      placeholder="Create a password"
                      (input)="validatePassword()"
                    />
                    <button
                      type="button"
                      class="auth-password-toggle"
                      (click)="toggleRegisterPasswordVisibility()"
                    >
                      <svg *ngIf="!showRegisterPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      <svg *ngIf="showRegisterPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                      </svg>
                    </button>
                  </div>
                  <div *ngIf="hasFieldError('password')" class="auth-field-errors">
                    <div *ngFor="let error of getFieldErrors('password')" class="auth-error-text">
                      {{ error }}
                    </div>
                  </div>
                  
                  <!-- Password Requirements -->
                  <div class="auth-password-requirements" *ngIf="!isPasswordValid && registerData.password">
                    <div class="auth-requirements-container">
                      <div class="auth-requirements-header">
                        <div class="auth-requirements-icon">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div class="auth-requirements-content">
                          <p class="auth-requirements-title">Password requirements:</p>
                          <ul class="auth-requirements-list">
                            <li class="auth-requirement-item">
                              <span class="auth-requirement-status" [class.valid]="registerData.password.length >= 8" [class.invalid]="registerData.password.length < 8">
                                {{ registerData.password.length >= 8 ? '✓' : '✗' }}
                              </span>
                              <span>At least 8 characters</span>
                            </li>
                            <li class="auth-requirement-item">
                              <span class="auth-requirement-status" [class.valid]="hasUpperCase(registerData.password)" [class.invalid]="!hasUpperCase(registerData.password)">
                                {{ hasUpperCase(registerData.password) ? '✓' : '✗' }}
                              </span>
                              <span>One uppercase letter</span>
                            </li>
                            <li class="auth-requirement-item">
                              <span class="auth-requirement-status" [class.valid]="hasSpecialCharacter(registerData.password)" [class.invalid]="!hasSpecialCharacter(registerData.password)">
                                {{ hasSpecialCharacter(registerData.password) ? '✓' : '✗' }}
                              </span>
                              <span>One special character</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="auth-form-group">
                  <label for="confirmPassword" class="auth-form-label">Confirm Password</label>
                  <div class="auth-input-container">
                    <div class="auth-input-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <input
                      [type]="showConfirmPassword ? 'text' : 'password'"
                      id="confirmPassword"
                      class="auth-form-input"
                      [class.error]="hasFieldError('confirmPassword')"
                      [(ngModel)]="confirmPassword"
                      name="confirmPassword"
                      required
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      class="auth-password-toggle"
                      (click)="toggleConfirmPasswordVisibility()"
                    >
                      <svg *ngIf="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      <svg *ngIf="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                      </svg>
                    </button>
                  </div>
                  <div *ngIf="hasFieldError('confirmPassword')" class="auth-field-errors">
                    <div *ngFor="let error of getFieldErrors('confirmPassword')" class="auth-error-text">
                      {{ error }}
                    </div>
                  </div>
                </div>

                <div *ngIf="errorMessage" class="auth-error-message">
                  <div class="auth-error-icon">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span class="auth-error-text">{{ errorMessage }}</span>
                </div>

                <button
                  type="submit"
                  class="auth-submit-button"
                  [disabled]="isLoading"
                >
                  <span *ngIf="isLoading" class="auth-loading-spinner">
                    <div class="auth-spinner"></div>
                    Creating account...
                  </span>
                  <span *ngIf="!isLoading">Create Account</span>
                </button>
              </form>
            </div>

            <!-- Email Verification Form -->
            <div *ngIf="currentMode === 'verify'">
              <div class="auth-verification-container">
                <div class="auth-verification-icon-container">
                  <div class="auth-verification-icon-wrapper">
                    <svg class="auth-verification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                
                <div class="auth-verification-content">
                  <h3 class="auth-verification-title">Verify Your Email Address</h3>
                  <p class="auth-verification-subtitle">We've sent a 4-digit verification code to:</p>
                  <div class="auth-verification-email-container">
                    <p class="auth-verification-email">{{ pendingEmail }}</p>
                  </div>
                  <p class="auth-verification-note">Please check your inbox and enter the verification code below to complete your registration.</p>
                  
                  <div class="auth-verification-steps">
                    <div class="auth-step">
                      <div class="auth-step-number">1</div>
                      <div class="auth-step-text">Check your email inbox</div>
                    </div>
                    <div class="auth-step">
                      <div class="auth-step-number">2</div>
                      <div class="auth-step-text">Find the 4-digit code</div>
                    </div>
                    <div class="auth-step">
                      <div class="auth-step-number">3</div>
                      <div class="auth-step-text">Enter code below</div>
                    </div>
                  </div>
                </div>
                
                <!-- Timer Display -->
                <div class="auth-verification-timer">
                  <div class="timer-container" [class]="getTimerColor()">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="timer-text">{{ getFormattedTime() }}</span>
                  </div>
                  <p class="timer-label" *ngIf="!isTimerExpired">Code expires in</p>
                  <p class="timer-label text-error-500" *ngIf="isTimerExpired">⚠️ Code expired</p>
                </div>
              </div>

              <form (ngSubmit)="onVerifyEmail()" #verifyForm="ngForm" class="auth-form">
                <div class="auth-form-group">
                  <label for="verificationCode" class="auth-form-label">Verification Code</label>
                  <div class="auth-verification-input-container">
                    <input
                      type="text"
                      id="verificationCode"
                      class="auth-verification-input"
                      [(ngModel)]="verifyData.verificationCode"
                      name="verificationCode"
                      required
                      placeholder="Enter 4-digit code"
                      maxlength="4"
                      pattern="[0-9]{4}"
                      [disabled]="isTimerExpired"
                      (input)="formatVerificationCode($event)"
                    />
                    <div class="auth-verification-input-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div *ngIf="errorMessage" class="auth-error-message">
                  <div class="auth-error-icon">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span class="auth-error-text">{{ errorMessage }}</span>
                </div>

                <button
                  type="submit"
                  class="auth-submit-button"
                  [disabled]="!verifyForm.valid || isLoading || isTimerExpired"
                >
                  <span *ngIf="isLoading" class="auth-loading-spinner">
                    <div class="auth-spinner"></div>
                    Verifying...
                  </span>
                  <span *ngIf="!isLoading">Verify Email</span>
                </button>

                <div class="auth-resend-section">
                  <p class="auth-resend-text">Didn't receive the code?</p>
                  <div class="auth-resend-actions">
                    <button
                      type="button"
                      class="auth-resend-button"
                      (click)="resendCode()" 
                      [disabled]="isResending || (resendCooldown > 0 && !isTimerExpired)"
                    >
                      <svg *ngIf="!isResending" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      <span *ngIf="isResending" class="auth-loading-spinner">
                        <div class="auth-spinner"></div>
                        Sending...
                      </span>
                      <span *ngIf="!isResending">
                        {{ (resendCooldown > 0 && !isTimerExpired) ? 'Resend in ' + resendCooldown + 's' : 'Resend Code' }}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AuthComponent {
  currentMode: 'login' | 'register' | 'verify' = 'login';
  showVerifyTab = false;
  pendingEmail = '';
  isLoading = false;
  isResending = false;
  resendCooldown = 0;
  errorMessage = '';
  isPasswordValid = true;
  showLoginPassword = false;
  showRegisterPassword = false;
  
  // Timer properties for verification code
  verificationTimer = 600; // 10 minutes in seconds
  verificationTimerInterval: any;
  isTimerExpired = false;

  loginData: LoginRequest = {
    email: '',
    password: ''
  };

  registerData: RegisterRequest = {
    username: '',
    email: '',
    password: ''
  };

  confirmPassword = '';
  showConfirmPassword = false;
  
  // Validation state
  validationErrors: { [key: string]: string[] } = {};
  isFormValid = false;

  verifyData: VerifyEmailRequest = {
    email: '',
    verificationCode: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  hasSpecialCharacter(password: string): boolean {
    return /[!@#$%^&*(),.?\":{}|<>]/.test(password);
  }

  hasUpperCase(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  setMode(mode: 'login' | 'register' | 'verify') {
    this.currentMode = mode;
    this.errorMessage = '';
    this.validationErrors = {};
    this.clearForm();
    
    // Start timer when switching to verify mode
    if (mode === 'verify') {
      this.startVerificationTimer();
    } else {
      this.stopVerificationTimer();
    }
  }

  clearForm() {
    if (this.currentMode === 'login') {
      this.loginData = { email: '', password: '' };
    } else if (this.currentMode === 'register') {
      this.registerData = { username: '', email: '', password: '' };
      this.confirmPassword = '';
    }
    this.validationErrors = {};
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
  }

  validateLoginForm(): boolean {
    this.validationErrors = {};
    
    if (!this.loginData.email.trim()) {
      this.validationErrors['email'] = ['Email is required'];
    } else if (!this.validateEmail(this.loginData.email)) {
      this.validationErrors['email'] = ['Please enter a valid email address'];
    }

    if (!this.loginData.password.trim()) {
      this.validationErrors['password'] = ['Password is required'];
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  validateRegisterForm(): boolean {
    this.validationErrors = {};
    
    if (!this.registerData.username.trim()) {
      this.validationErrors['username'] = ['Username is required'];
    } else if (!this.validateUsername(this.registerData.username)) {
      this.validationErrors['username'] = ['Username must be 3-20 characters and contain only letters, numbers, and underscores'];
    }

    if (!this.registerData.email.trim()) {
      this.validationErrors['email'] = ['Email is required'];
    } else if (!this.validateEmail(this.registerData.email)) {
      this.validationErrors['email'] = ['Please enter a valid email address'];
    }

    if (!this.registerData.password.trim()) {
      this.validationErrors['password'] = ['Password is required'];
    } else if (!this.isPasswordValid) {
      this.validationErrors['password'] = ['Password must meet all requirements'];
    }

    if (!this.confirmPassword.trim()) {
      this.validationErrors['confirmPassword'] = ['Please confirm your password'];
    } else if (this.registerData.password && this.confirmPassword && this.registerData.password !== this.confirmPassword) {
      this.validationErrors['confirmPassword'] = ['Passwords do not match'];
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  hasFieldError(fieldName: string): boolean {
    return this.validationErrors[fieldName] && this.validationErrors[fieldName].length > 0;
  }

  getFieldErrors(fieldName: string): string[] {
    return this.validationErrors[fieldName] || [];
  }

  toggleLoginPasswordVisibility() {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleRegisterPasswordVisibility() {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validatePassword() {
    this.isPasswordValid = this.authService.validatePassword(this.registerData.password);
  }

  onLogin() {
    if (!this.validateLoginForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notificationService.addNotification({
          title: 'Success',
          message: 'Login successful! Welcome back.',
          type: 'success'
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        this.notificationService.addNotification({
          title: 'Login Failed',
          message: this.errorMessage,
          type: 'error'
        });
      }
    });
  }

  onRegister() {
    if (!this.validateRegisterForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notificationService.addNotification({
          title: 'Success',
          message: 'Registration successful! Please check your email for verification.',
          type: 'success'
        });
        
        this.pendingEmail = this.registerData.email;
        this.verifyData.email = this.registerData.email;
        this.showVerifyTab = true;
        this.setMode('verify');
        this.startVerificationTimer();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.notificationService.addNotification({
          title: 'Registration Failed',
          message: this.errorMessage,
          type: 'error'
        });
      }
    });
  }

  onVerifyEmail() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.verifyEmail(this.verifyData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notificationService.addNotification({
          title: 'Email Verified',
          message: 'Your email has been verified successfully!',
          type: 'success'
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMsg = error.error?.message || 'Verification failed. Please try again.';
        this.errorMessage = errorMsg;
        
        // If verification expired, redirect back to register
        if (errorMsg.includes('expired')) {
          this.notificationService.addNotification({
            title: 'Verification Expired',
            message: 'Your verification code has expired. Please register again.',
            type: 'warning'
          });
          setTimeout(() => {
            this.goBackToRegister();
          }, 2000);
        } else {
          this.notificationService.addNotification({
            title: 'Verification Failed',
            message: errorMsg,
            type: 'error'
          });
        }
      }
    });
  }

  startVerificationTimer() {
    this.verificationTimer = 600; // Reset to 10 minutes
    this.isTimerExpired = false;
    
    // Clear any existing timer
    if (this.verificationTimerInterval) {
      clearInterval(this.verificationTimerInterval);
    }
    
    this.verificationTimerInterval = setInterval(() => {
      this.verificationTimer--;
      
      if (this.verificationTimer <= 0) {
        this.isTimerExpired = true;
        this.stopVerificationTimer();
        this.errorMessage = 'Verification code has expired. Please request a new code.';
      }
    }, 1000);
  }

  stopVerificationTimer() {
    if (this.verificationTimerInterval) {
      clearInterval(this.verificationTimerInterval);
      this.verificationTimerInterval = null;
    }
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.verificationTimer / 60);
    const seconds = this.verificationTimer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getTimerColor(): string {
    if (this.verificationTimer <= 60) return 'text-error-500'; // Red for last minute
    if (this.verificationTimer <= 180) return 'text-warning-500'; // Orange for last 3 minutes
    return 'text-success-500'; // Green for normal time
  }

  resendCode() {
    // Reset timer when resending code
    this.startVerificationTimer();
    this.isTimerExpired = false;
    this.errorMessage = '';
    
    this.isResending = true;
    
    const resendData: ResendCodeRequest = {
      email: this.pendingEmail
    };

    this.authService.resendVerificationCode(resendData).subscribe({
      next: () => {
        this.isResending = false;
        this.notificationService.addNotification({
          title: 'Code Sent',
          message: 'A new verification code has been sent to your email.',
          type: 'success'
        });
        
        // Start cooldown
        this.resendCooldown = 60;
        const countdown = setInterval(() => {
          this.resendCooldown--;
          if (this.resendCooldown <= 0) {
            clearInterval(countdown);
          }
        }, 1000);
      },
      error: (error) => {
        this.isResending = false;
        // If user not found, redirect back to register
        if (error.error?.message?.includes('User not found')) {
          this.notificationService.addNotification({
            title: 'Registration Expired',
            message: 'Your registration has expired. Please register again.',
            type: 'warning'
          });
          this.goBackToRegister();
        } else {
          this.notificationService.addNotification({
            title: 'Resend Failed',
            message: error.error?.message || 'Failed to resend verification code.',
            type: 'error'
          });
        }
      }
    });
  }

  ngOnDestroy() {
    // Clean up timer when component is destroyed
    this.stopVerificationTimer();
  }

  formatVerificationCode(event: any) {
    // Only allow numbers
    const value = event.target.value.replace(/[^0-9]/g, '');
    this.verifyData.verificationCode = value;
  }

  goBackToRegister() {
    this.showVerifyTab = false;
    this.setMode('register');
    this.pendingEmail = '';
    this.verifyData = { email: '', verificationCode: '' };
    this.stopVerificationTimer();
  }
}