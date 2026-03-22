import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private authUrl: string = `${environment.apiUrl}/v1/auth`;

  private http = inject(HttpClient);
  private jwtHelper = inject(JwtHelperService);

  private jwtPayload: any;
  public authChanged$ = new BehaviorSubject<any>(null);

  constructor() {
    this.loadToken();
    this.authChanged$.next(this.jwtPayload);
  }

  public get jwtPayloadPublic() {
    return this.jwtPayload;
  }

  private loadToken() {
    const token = this.getToken();
    if (token) {
      this.jwtPayload = this.jwtHelper.decodeToken(token);
      this.authChanged$.next(this.jwtPayload);
    } else {
      this.jwtPayload = null;
      this.authChanged$.next(null);
    }
  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  hasRole(role: string): boolean {
    return this.jwtPayload?.permissions?.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  hasPermission(permission: string): boolean {
    if (!this.jwtPayload || !this.jwtPayload.permissions) return false;
    return this.jwtPayload.permissions.includes(permission);
  }

  login(email: string, senha: string): Observable<any> {
    return this.http.post<any>(this.authUrl + '/login', { email, senha }).pipe(
      tap(response => {
        if (response.token) {
          sessionStorage.setItem('jwt_token', response.token);
          this.loadToken(); 
        }
      })
    );
  }

  logout() {
    sessionStorage.removeItem('jwt_token');
    this.jwtPayload = null;
    this.authChanged$.next(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem('jwt_token');
  }

  get isAuthenticated(): boolean {
    return !!this.jwtPayload;
  }
  
}