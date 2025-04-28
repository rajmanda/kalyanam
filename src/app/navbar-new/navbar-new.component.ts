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

@Component({
  selector: 'app-navbar-new',
  standalone: true,
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
  styleUrls: ['./navbar-new.component.css']
})
export class NavbarNewComponent implements OnInit, OnDestroy {
    userProfilex: any;
    loggedin: boolean = false;
    mobileMenuOpen: boolean = false;
    isMobile: boolean = false;
    isAdmin: boolean = false;
    isAdminCheckComplete = false;

    private subscriptions = new Subscription();

    constructor(
      private authService: AuthService,
      private breakpointObserver: BreakpointObserver,
      private matDialog: MatDialog, // Renamed for consistency
      private cdr: ChangeDetectorRef
    ) {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
        this.isMobile = result.matches;
        this.cdr.markForCheck();
      });
    }

    ngOnInit(): void {
      const profileSubscription = this.authService.userProfile$.subscribe({
        next: (profile) => {
          if (profile && Object.keys(profile).length > 0) {
            this.userProfilex = profile;
            this.loggedin = true;

            const userEmail = this.authService.getUserEmail();
            if (userEmail) {
              this.checkAdminStatus(userEmail);
            }
          } else {
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

    private checkAdminStatus(userEmail: string): void {
      this.isAdminCheckComplete = false;
      const adminSubscription = this.authService.isAdmin(userEmail).subscribe({
        next: (isAdmin) => {
          this.isAdmin = isAdmin;
          this.isAdminCheckComplete = true;
          this.cdr.detectChanges();
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

    openRsvpModal(): void {
      const dialogRef = this.matDialog.open(RsvpAllComponent, {
        width: '900px',
        maxWidth: '98vw',
        disableClose: false // Prevents closing by clicking outside
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('RSVP was submitted successfully');
          // Add any post-submission logic here
        }
      });
    }
}
