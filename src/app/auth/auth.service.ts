import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { environment } from '../../environments/environment';
export interface AuthServiceResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private expirationTokenTimer: number;
  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string): Observable<AuthServiceResponse> {
    return this.http.post<AuthServiceResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleErrors),
      tap(responseData => {
        this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
      })
    );
  }

  login(email: string, password: string): Observable<AuthServiceResponse> {
    return this.http
      .post<AuthServiceResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      ).pipe(
        catchError(this.handleErrors),
        tap(responseData => {
          this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['auth']);
    localStorage.removeItem('userData');
    // clear automatic logout timer
    if (this.expirationTokenTimer) {
      clearTimeout(this.expirationTokenTimer);
    }
    this.expirationTokenTimer = null;
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDateTime: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    const loadedUser: User = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDateTime));

      if(loadedUser.token) {
        this.user.next(loadedUser);
        const expiresIn: number = (loadedUser.tokenExpirationDateTime.getTime() - new Date().getTime());
        this.autoLogout(expiresIn);
      }
  }

  autoLogout(expirationDurationMs: number) {
    console.log('Will expire in ' + expirationDurationMs/1000 + ' seconds');
    this.expirationTokenTimer = setTimeout(() => {
      this.logout();
    }, expirationDurationMs);
  }

  private handleAuthentication(email: string, localId: string, idToken: string, expiresIn: number): void {
    // expirationDateTime current Date + expiresIn in milliseconds since Epoch
    const expirationDateTime: Date = new Date((new Date().getTime()) + expiresIn * 1000);
    const user: User = new User(email, localId, idToken, expirationDateTime);
    // const user: User = new User(email, idToken, localId, expirationDateTime);
    this.autoLogout(expiresIn * 1000);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleErrors(errorResponse: HttpErrorResponse) {
    console.log(errorResponse);
    let errorMessage = 'An unknown Error occurred! (Check your connection or url!)'
    if (!(errorResponse.error && errorResponse.error.error)) return throwError(errorMessage);
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email address is already in use by another account.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid or the user does not have a password.';
        break;
      case 'USER_DISABLED':
        errorMessage = 'The user account has been disabled by an administrator.';
        break;
      default:
        errorMessage = 'An unknown Error occurred! May be the site is down.'
    }
    return throwError(errorMessage);
  }
}
