import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { NavbarDesk } from "../navbar-desk/navbar-desk";
import { Navbar } from "../navbar/navbar";
import { InstallBanner } from "../../shared/components/install-banner/install-banner";

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [NavbarDesk, Navbar, RouterOutlet, RouterOutlet, InstallBanner],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {

}
