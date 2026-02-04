import {Component} from '@angular/core';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatToolbarModule, MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-burger',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './menu-burger.html',
  styleUrl: './menu-burger.css',
})
export class MenuBurger {

  constructor(public router: Router){}

  openAnnonce(){
    this.router.navigate(['/listings']);
  }

}
