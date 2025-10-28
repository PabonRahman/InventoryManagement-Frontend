import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  accessToken: string;
  tokenType: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions).pipe(
      map((response: any) => {
        console.log('🔐 Login response:', response);
        
        const user: User = {
          id: response.id,
          username: response.username,
          email: response.email,
          roles: response.roles,
          accessToken: response.accessToken, // ✅ This is the JWT token
          tokenType: response.tokenType
        };
        
        if (user && user.accessToken) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          console.log('✅ User logged in and token stored in currentUser');
        }
        return user;
      }),
      catchError(this.handleError)
    );
  }

  register(username: string, email: string, password: string, roles: string[] = []): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password,
      roles
    }, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else if (error.status === 401) {
        errorMessage = 'Invalid username or password.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied.';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    return throwError(errorMessage);
  }

  logout(): void {
    console.log('🔐 Logging out user');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    const currentUser = this.currentUserValue;
    return currentUser?.accessToken || null;
  }

  hasRole(role: string): boolean {
    const currentUser = this.currentUserValue;
    if (!currentUser || !currentUser.roles) return false;
    return currentUser.roles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const currentUser = this.currentUserValue;
    if (!currentUser || !currentUser.roles) return false;
    return roles.some(role => currentUser.roles.includes(role));
  }

  isLoggedIn(): boolean {
    const currentUser = this.currentUserValue;
    return !!currentUser && !!currentUser.accessToken;
  }

  getUserRoles(): string[] {
    const currentUser = this.currentUserValue;
    return currentUser?.roles || [];
  }

  getUsername(): string | null {
    const currentUser = this.currentUserValue;
    return currentUser?.username || null;
  }

  getUserId(): number | null {
    const currentUser = this.currentUserValue;
    return currentUser?.id || null;
  }

  refreshUserData(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    } catch (e) {
      return true;
    }
  }
}