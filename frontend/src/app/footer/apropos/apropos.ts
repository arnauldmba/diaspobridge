import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apropos',
  imports: [],
  templateUrl: './apropos.html',
  styleUrl: './apropos.css',
})
export class Apropos {
  appName = environment.appName;

  constructor(private router: Router){}

  backToListing() {
    this.router.navigate(['/listings']);
  }
}
