import { Component } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-privacy-policy',
  imports: [TranslatePipe],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.css',
})
export class PrivacyPolicy {

  appName = environment.appName;
  
    constructor(private router: Router){}
  
    backToListing() {
      this.router.navigate(['/listings']);
    }
}
