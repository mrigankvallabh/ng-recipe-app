import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
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
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  constructor(private http: HttpClient) { }

  signup(email: string, password: string): Observable<AuthServiceResponse> {
    return this.http.post<AuthServiceResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAsyPRw_JoFvqqpDw3rfob82BWY5BkZZ90',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleErrors),
      tap(responseData => {
        this.handleAuthentication(responseData.email, responseData.idToken, responseData.localId, +responseData.expiresIn);
      })
    );
  }

  login(email: string, password: string): Observable<AuthServiceResponse> {
    return this.http
      .post<AuthServiceResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAsyPRw_JoFvqqpDw3rfob82BWY5BkZZ90',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      ).pipe(
        catchError(this.handleErrors),
        tap(responseData => {
          this.handleAuthentication(responseData.email, responseData.idToken, responseData.localId, +responseData.expiresIn);
        })
      );
  }

  private handleAuthentication(email: string, idToken: string, localId: string, expiresIn: number): void {
    // expirationDateTime current Date + expiresIn in milliseconds since Epoch
    const expirationDateTime: Date = new Date((new Date().getTime()) + expiresIn * 1000);
    const user: User = new User(email, idToken, localId, expirationDateTime);
    this.user.next(user);
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
