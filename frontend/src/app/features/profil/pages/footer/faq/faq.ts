import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-faq',
  imports: [TranslatePipe],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {

  appName = environment.appName;

  constructor(private router: Router){}

  backToListing() {
    this.router.navigate(['/listings']);
  }

}
