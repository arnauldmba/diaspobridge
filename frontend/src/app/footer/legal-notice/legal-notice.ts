import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legal-notice',
  imports: [],
  templateUrl: './legal-notice.html',
  styleUrl: './legal-notice.css',
})
export class LegalNotice {
  appName = environment.appName;

  constructor(private router: Router){}

  backToListing() {
    this.router.navigate(['/listings']);
  }
}
