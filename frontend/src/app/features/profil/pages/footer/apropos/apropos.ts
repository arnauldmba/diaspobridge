import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-apropos',
  imports: [TranslatePipe],
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
