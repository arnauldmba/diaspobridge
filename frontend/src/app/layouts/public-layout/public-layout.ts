import { Component } from '@angular/core';
import { NavbarDesk } from "../../core/components/navbar-desk/navbar-desk";
import { Navbar } from "../../core/components/navbar/navbar";
import { RouterModule, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [NavbarDesk, Navbar, RouterOutlet, RouterModule],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {

}
