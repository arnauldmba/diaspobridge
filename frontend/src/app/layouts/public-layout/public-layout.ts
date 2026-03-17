import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { NavbarDesk } from "../../core/components/navbar-desk/navbar-desk";
import { Navbar } from "../../core/components/navbar/navbar";

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [NavbarDesk, Navbar, RouterOutlet, RouterOutlet],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {

}
