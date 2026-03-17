import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarDesk } from "./core/components/navbar-desk/navbar-desk";
import { Navbar } from "./core/components/navbar/navbar";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, NavbarDesk, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  
  protected readonly title = signal('diasporabridge');
}
