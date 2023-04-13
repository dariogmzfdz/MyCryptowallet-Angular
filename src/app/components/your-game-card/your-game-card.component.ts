import { DataService } from 'src/app/services/data.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-your-game-card',
  templateUrl: './your-game-card.component.html',
  styleUrls: ['./your-game-card.component.css']
})
export class YourGameCardComponent implements OnInit {

  @Input() userCrypto: any;

  constructor(private http: HttpClient, private authService: AuthService, private dataService: DataService) { }

  userId = this.authService.decodeToken().userId;

  ngOnInit(): void {
    console.log(this.userCrypto);
  }

}
