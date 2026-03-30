import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarDesk } from "./layouts/navbar-desk/navbar-desk";
import { Navbar } from "./layouts/navbar/navbar";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  
  protected readonly title = signal('diasporabridge');
}
