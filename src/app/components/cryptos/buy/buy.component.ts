import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { Crypto, UserCryptos } from 'src/app/models/cryptos.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-buy',
    templateUrl: './buy.component.html',
    styleUrls: ['./buy.component.css'],
})
export class BuyComponent implements OnInit {
    buyForm: FormGroup;
    isLogged = this.authService.isLogged();

    userCryptos: UserCryptos[] = [];
    cryptos: Crypto[] = [];
    uc: UserCryptos[] = [];

    userWallet: UserCryptos | undefined;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private authService: AuthService,
        private dataService: DataService,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.buyForm = new FormGroup({
            amount: new FormControl('', [Validators.required]),
        });

        this.dataService.getCryptos().subscribe((data: Crypto[]) => {
            this.cryptos = data;
            this.dataService
                .getUserCryptos()
                .subscribe((data: UserCryptos[]) => {
                    this.userCryptos = data;
                    console.log(this.userCryptos);
                    this.userCryptos.forEach(
                        (uc) =>
                            (uc.crypto = this.cryptos.find(
                                (c) => c.cryptoId === uc.cryptoId
                            ))
                    );
                    this.uc = this.userCryptos.filter(
                        (uc) =>
                            uc.userId === this.authService.decodeToken().userId
                    );
                    console.log(this.uc);

                    this.userWallet = this.uc.find(
                        (uc) => uc.cryptoId === this.data.cryptoId
                    );
                    console.log(this.userWallet);
                });
        });
    }

    buy() {
        const userId = this.authService.decodeToken().userId;
        const cryptoId = this.data.cryptoId;
        const amount = this.buyForm.value.amount;
        const wallet = this.userWallet;
        console.log(wallet);
        console.log(amount);
        
        if (wallet) {
            const crypto = wallet.crypto;
            console.log(crypto);
            
            if (crypto && Number(crypto.stock) >= amount) {
                console.log(crypto.stock);
                const newAmount = Number(wallet.amount) + Number(amount);
                console.log(newAmount);
                const newStock = Number(crypto.stock) - Number(amount);
                this.dataService
                    .updateUserCrypto(userId, cryptoId, newAmount)
                    .subscribe((data: UserCryptos) => {
                        console.log(data);
                        this.dataService
                            .updateCrypto(
                                crypto.cryptoId,
                                crypto.name,
                                crypto.value,
                                crypto.icon,
                                crypto.asset,
                                newStock
                            )
                            .subscribe((data: Crypto) => {
                                console.log(data);
                            });
                    });
            } else {
                this._snackBar.open(
                    'There is not enough stock to complete the transaction',
                    'Close',
                    {
                        duration: 2000,
                    }
                );
            }
        } else {
            const crypto = this.cryptos.find(
                (c) => c.cryptoId === this.data.cryptoId
            );
            console.log(crypto?.stock);
            
            if (crypto && Number(crypto.stock) >= amount) {
                const newStock = Number(crypto.stock) - Number(amount);
                console.log(amount);
                this.dataService
                    .updateUserCrypto(userId, cryptoId, amount)
                    .subscribe((data: UserCryptos) => {
                        console.log(data);
                        this.dataService
                            .updateCrypto(
                                crypto.cryptoId,
                                crypto.name,
                                crypto.value,
                                crypto.icon,
                                crypto.asset,
                                newStock
                            )
                            .subscribe((data: Crypto) => {
                                console.log(data);
                            });
                    });
            } else {
                this._snackBar.open(
                    'There is not enough stock to complete the transaction',
                    'Close',
                    {
                        duration: 2000,
                    }
                );
            }
        }
        /* window.location.reload(); */
    }
}
