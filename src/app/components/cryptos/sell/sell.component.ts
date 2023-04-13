import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Crypto } from 'src/app/models/cryptos.model';
import { UserCryptos } from 'src/app/models/cryptos.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-sell',
    templateUrl: './sell.component.html',
    styleUrls: ['./sell.component.css'],
})
export class SellComponent implements OnInit {
    sellForm: FormGroup;
    isLogged = this.authService.isLogged();

    userCryptos: UserCryptos[] = [];
    cryptos: Crypto[] = [];
    uc: UserCryptos[] = [];
    
    user= this.authService.decodeToken();
    
    userWallet: UserCryptos | undefined;
    
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private authService: AuthService,
        private dataService: DataService,
        private _snackBar: MatSnackBar
        ) {}
        
    ngOnInit(): void {
        this.sellForm = new FormGroup({
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

    sell() {
        if (this.sellForm.valid) {
            const userId = this.authService.decodeToken().userId;
            const cryptoId = this.data.cryptoId;
            const amount: number = this.sellForm.value.amount;
            const wallet = this.userWallet;
            if (wallet === undefined) {
                return;
            }
            const newAmount = Number(wallet.amount) - Number(amount);
            const crypto = this.cryptos.find(
                (c) => c.cryptoId === this.data.cryptoId
                );
                if (crypto && newAmount >= 0) {
                    const newStock = Number(crypto.stock) + Number(amount);
                    const newDeposit = newAmount * crypto.value - this.user.deposit;
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
                        this.dataService
                            .updateUser(
                                this.user.userId,
                                this.user.username,
                                this.user.email,
                                this.user.password,
                                newDeposit
                            )
                            .subscribe((data: UserCryptos) => {
                                console.log(data);
                            });
                    });
            } else {
                this._snackBar.open(
                    'You do not have enough crypto to sell',
                    'Close',
                    {
                        duration: 2000,
                    }
                );
            }
        }
    }
}
