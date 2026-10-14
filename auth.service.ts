import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs'; // Added BehaviorSubject
import { tap } from 'rxjs/operators';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7121/api/Authentication';
  isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Only check localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn.next(!!localStorage.getItem('token'));
    }
  }

// auth.service.ts
login(email: string, password: string): Observable<{ token: string }> {
  return this.http.post<{ token: string }>(
    `${this.apiUrl}/login`,
    {
      emailaddress: email,
      password: password
    }
  ).pipe(
    tap(res => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', res.token);
      }
      this.isLoggedIn.next(true);
    })
  );
}

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.isLoggedIn.next(false);
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      emailaddress: email,
      password: password
    });
  }
}
