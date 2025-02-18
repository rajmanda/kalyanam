import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

declare const google: any;  // Needed for Google authentication methods

@Component({
  selector: 'app-glogin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './glogin.component.html',
  styleUrl: './glogin.component.css'
})
export class GloginComponent {

  public username: string = "";
  public password: string = "";
  loginMessage: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the message from query parameters
    this.route.queryParams.subscribe(params => {
      this.loginMessage = params['message'] || null;
      console.log('Login message:', this.loginMessage); // Debug: Check if the message is set
    });
  }


}
