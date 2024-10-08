import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatGridListModule, CommonModule, NgFor, MatIcon],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.css'
})
export class AboutMeComponent {

  certifications = [
    {
      name: 'AWS Certified Solutions Architect Associate',
      icon: '/assets/certifications/aws-certified-architect-associate.png',
    },
    {
      name: 'AWS Certified Developer Associate',
      icon: '/assets/certifications/aws-certified-developer-associate.png',
    },
    {
      name: 'Kubernetes Certified Application Developer ',
      icon: '/assets/certifications/kubernetes-certified-applciation-developer.png',
    },
    {
      name: 'Kubernetes Certified Administrator',
      icon: '/assets/certifications/kubernetes-certified-administrator.png',
    },
    {
      name: 'Terraform Certified Associate',
      icon: '/assets/certifications/terraform-certified-associate.png',
    }
  ];
}
