import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { MatToolbar } from '@angular/material/toolbar';
import { NavbarNewComponent } from "./navbar-new/navbar-new.component";


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, MatToolbar, NavbarNewComponent]
})
export class AppComponent {
  title = 'kalyanam';
}
