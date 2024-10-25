import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  username: string | null = null;
  email: string | null = null;
  photoUrl: string | null = null;
  profileError: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef // Tambahkan ChangeDetectorRef di constructor
  ) {}

  ngOnInit(): void {
    // Ambil data pengguna dari localStorage
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.username = localStorage.getItem('currentUsername');
    this.email = localStorage.getItem('currentEmail');
    this.photoUrl =
      localStorage.getItem('currentPhotoUrl') ||
      'assets/img/default-profile.png';

    // Jika data pengguna tidak ditemukan
    if (!this.username || !this.email) {
      this.profileError = 'Failed to load profile. Please log in again.';
      console.error(this.profileError);
      this.router.navigate(['/login']);
    }

    // Setelah data dimuat, trigger perubahan tampilan
    this.cdr.detectChanges();
  }

  openSettings() {
    this.router.navigate(['/settings']);
  }

  logout() {
    // Logout dan hapus token
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
