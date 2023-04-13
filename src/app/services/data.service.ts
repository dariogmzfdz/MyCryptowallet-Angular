import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCryptos } from '../models/cryptos.model'

@Injectable({
    providedIn: 'root',
})
export class DataService {
    userCryptos: UserCryptos[] = [];

    userCryptosId: any;

    constructor(private http: HttpClient) {}

    getCryptos(): Observable<any> {
        return this.http.get('http://localhost:5000/api/cryptos/');
    }

    getUserCryptos(): Observable<any> {
        return this.http.get('http://localhost:5000/api/cryptos/userCryptos/');
    }

    updateCrypto(
        cryptoId: string,
        name: string,
        value: number,
        icon: string,
        asset: string,
        stock: number
    ): Observable<any> {
        return this.http.put('http://localhost:5000/api/cryptos/update/', {
            cryptoId,
            name,
            value,
            icon,
            asset,
            stock,
        });
    }

    updateUserCrypto(
        userId: string,
        cryptoId: string,
        amount: number
    ): Observable<any> {
        return this.http.put(
            'http://localhost:5000/api/cryptos/updateUC/',
            {
                userId,
                cryptoId,
                amount
            }
        );
    }

    updateUser(userId: string, username: string, email: string, password: string, deposit: number): Observable<any> {
        return this.http.put('http://localhost:5000/api/users/update/',
        {
            userId,
            username,
            email,
            password,
            deposit
        });
    }

    public isAdded(cryptoId: string, userId: string): boolean {
        let isAdded = false;
        console.log(this.userCryptos);
        
        this.userCryptos.forEach((crypto) => {
            if (crypto.cryptoId === cryptoId && crypto.userId === userId) {
                isAdded = true;
            }
        });
        return isAdded;
    }
}
