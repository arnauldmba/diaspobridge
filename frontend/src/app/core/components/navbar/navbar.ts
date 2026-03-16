import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { MatIcon, MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkWithHref, RouterLinkActive, MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

}
