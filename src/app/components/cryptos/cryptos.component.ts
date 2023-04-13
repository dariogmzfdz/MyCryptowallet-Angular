import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Crypto } from 'src/app/models/cryptos.model';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { BuyComponent } from './buy/buy.component';
import { SellComponent } from './sell/sell.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector: 'app-cryptos',
    templateUrl: './cryptos.component.html',
    styleUrls: ['./cryptos.component.css'],
})
export class CryptosComponent implements OnInit {
    cryptos: Crypto[] = [];

    displayedColumns: string[] = ['icon', 'asset', 'name', 'value', 'stock', 'actions'];
    dataSource = new MatTableDataSource()
    
    constructor(private dataService: DataService, private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog) {}
    
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    @Input() data: any;
    
    ngOnInit(): void {
        this.dataService.getCryptos().subscribe((data: Crypto[]) => {
            this.cryptos = data;
            this.dataSource.data = this.cryptos;
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    openBuyDialog(e: any) {
        this.dialog.open(BuyComponent, {data: e});
        console.log(e);
    }

    openSellDialog(e: any) {
        this.dialog.open(SellComponent, {data: e});
    }
}