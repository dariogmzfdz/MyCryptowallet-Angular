import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserCryptos, Crypto } from 'src/app/models/cryptos.model';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements AfterViewInit {
    displayedColumns: string[] = ['position', 'name', 'status', 'platform'];
    dataSource = new MatTableDataSource();

    userCryptos: UserCryptos[] = [];
    cryptos: Crypto[] = [];
    uc: any;

    search: String = '';
    isSearching: boolean = false;

    isLogged = this.authService.isLogged();

    constructor(
        private dataService: DataService,
        private authService: AuthService
    ) {}

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngOnInit(): void {
        let userId = ''
        if (this.isLogged) {
            userId = this.authService.decodeToken().userId;
        }
        this.dataService.getCryptos().subscribe((data: Crypto[]) => {
            this.cryptos = data;
            console.log(this.cryptos);

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
                    this.dataSource.data = this.userCryptos.filter(
                        (uc) => uc.userId === userId
                    );
                    console.log(this.dataSource.data.length);
                });
        });
        console.log(userId);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    onSearchKeyUp(search: { value: any }) {
        this.dataSource.data = this.userCryptos.filter(
            (uc) =>
                uc.crypto?.name
                    .toLowerCase()
                    .includes(search.value.toLowerCase()) 
        );

        if (search.value !== '') {
            this.isSearching = true;
        } else {
            this.isSearching = false;
        }

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    onClearClicked(search: { value: string }) {
        this.dataSource.filter = '';
        search.value = '';

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    hideContent() {
        if (this.dataSource.data.length === 0) {
            return true;
        } else {
            return false;
        }
    }
}
