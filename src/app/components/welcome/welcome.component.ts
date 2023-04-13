import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  currentEndpoint = window.location.href.slice(window.location.href.lastIndexOf('/') + 1);

  constructor() { }

  ngOnInit(): void {
  }

  routerLink() {

    if (this.currentEndpoint === '') {
      return ['/wallet'];
    } else if (this.currentEndpoint === 'wallet') {
      return ['/'];
    } else {
      return ['/'];
    }
  }
}
