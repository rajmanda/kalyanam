import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

declare const google: any;  // Needed for Google authentication methods

@Component({
  selector: 'app-glogin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './glogin.component.html',
  styleUrl: './glogin.component.css'
})
export class GloginComponent {

  public username: string = "";
  public password: string = "";

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    console.log(`Username: ${this.username}, Password: ${this.password}`);
  }
}
