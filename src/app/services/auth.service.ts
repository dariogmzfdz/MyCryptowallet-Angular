import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

const TOKEN_KEY = 'accessToken';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) {}

    signOut(): void {
        window.sessionStorage.clear();
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post('http://localhost:5000/api/users/login/', {
            email,
            password,
        });
    }

    register(
        username: string,
        password: string,
        email: string,
        fullname: string,
        birthdate: string,
        deposit: number
    ): Observable<any> {
        return this.http.post('http://localhost:5000/api/users/signup/', {
            username,
            password,
            email,
            fullname,
            birthdate,
            deposit,
        });
    }

    public decodeToken(): any {
        const token = this.getToken();
        if (token) {
            return jwt_decode(token);
        } else {
            return null;
        }
    }

    public saveToken(token: string): void {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.setItem(TOKEN_KEY, token);
    }

    public getToken(): string | null {
        return window.sessionStorage.getItem(TOKEN_KEY);
    }

    public isLogged(): boolean {
        const token = this.getToken();
        if (token) {
            return true;
        } else {
            return false;
        }
    }
}