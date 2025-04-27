import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { RsvpAllComponent } from '../rsvp-all/rsvp-all.component';
import { Subscription } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-navbar-new',
  standalone: true, // Add this for standalone components
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
    MatSidenavModule,
    MatMenuModule
  ],
  templateUrl: './navbar-new.component.html',
  styleUrls: ['./navbar-new.component.css'], // Changed from styleUrl to styleUrls
  changeDetection: ChangeDetectionStrategy.OnPush // Optional but recommended
})
export class NavbarNewComponent implements OnInit, OnDestroy {
    userProfilex: any;
    loggedin: boolean = false;
    mobileMenuOpen: boolean = false;
    isMobile: boolean = false;
    isAdmin: boolean = false;

    private subscriptions = new Subscription();

    constructor(
      private authService: AuthService,
      private breakpointObserver: BreakpointObserver,
      public _matDialog: MatDialog,
      private cdr: ChangeDetectorRef // Added ChangeDetectorRef
    ) {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
        this.isMobile = result.matches;
        this.cdr.markForCheck(); // Notify change detection
      });
    }

    ngOnInit(): void {
      const profileSubscription = this.authService.userProfile$.subscribe({
        next: (profile) => {
          if (profile && Object.keys(profile).length > 0) {
            console.log('User Logged In:', profile);
            this.userProfilex = profile;
            this.loggedin = true;

            const userEmail = this.authService.getUserEmail();
            if (userEmail) { // Added null check
              this.checkAdminStatus(userEmail);
            }
          } else {
            console.log('No user logged in');
            this.clearUserData();
          }
        },
        error: (err) => {
          console.error('Error in profile subscription:', err);
          this.clearUserData();
        }
      });

      this.subscriptions.add(profileSubscription);
    }

    private clearUserData(): void {
      this.userProfilex = null;
      this.loggedin = false;
      this.isAdmin = false;
      this.cdr.markForCheck();
    }

// Add this to track loading state
    isAdminCheckComplete = false;

    private checkAdminStatus(userEmail: string): void {
      this.isAdminCheckComplete = false;
      const adminSubscription = this.authService.isAdmin(userEmail).subscribe({
        next: (isAdmin) => {
          this.isAdmin = isAdmin;
          this.isAdminCheckComplete = true;
          this.cdr.detectChanges(); // Force immediate update
          console.log('Admin status updated:', isAdmin);
        },
        error: () => {
          this.isAdmin = false;
          this.isAdminCheckComplete = true;
          this.cdr.detectChanges();
        }
      });
      this.subscriptions.add(adminSubscription);
    }

    ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
    }

    handleSignOut() {
      this.authService.logout();
      this.clearUserData();
    }

    openRsvpAllDialog() {
      const dialogRef = this._matDialog.open(RsvpAllComponent, {
        width: '80%', // Added width
        maxWidth: '800px', // Added maxWidth
        data: { }  // Fixed data passing
      });

      const dialogSub = dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog result:', result);
      });

      this.subscriptions.add(dialogSub);
    }
}
