import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService) { }

  user = this.authService.decodeToken();

  isLogged = this.authService.isLogged();

  currentEndpoint = window.location.href.slice(window.location.href.lastIndexOf('/') + 1);

  isInLogin = this.currentEndpoint === 'login' ? true : false;
  
  ngOnInit(): void {
    console.log(this.user);
    
  }

  LogOut() {
    this.authService.signOut();
    window.location.reload();
  }

}
