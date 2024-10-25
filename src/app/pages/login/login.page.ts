import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';
  loginError: string = '';
  termsAccepted: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  // Tambahkan metode togglePassword
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Fungsi untuk login
  async loginUser() {
    if (!this.username || !this.password) {
      this.loginError = 'Please enter your username and password.';
      return;
    }

    const loading = await this.presentLoading(); // Tampilkan loading saat login dimulai

    this.authService.login(this.username, this.password).subscribe(
      async (response: any) => {
        console.log('Login successful:', response);

        if (response && response.data?.token) {
          this.authService.saveToken(response.data.token);

          // Simpan data pengguna di localStorage (username, email, photo_url)
          if (response.data.user) {
            this.authService.saveUserData(response.data.user);
          }

          await loading.dismiss();
          this.router.navigate(['/product-list']);
        } else {
          this.loginError = 'Login failed. Invalid credentials.';
          await loading.dismiss();
        }
      },
      async (error) => {
        console.error('Login error:', error);
        this.loginError =
          'An error occurred during login. Please try again later.';
        await loading.dismiss();
      }
    );
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Logging in...',
      duration: 5000,
    });
    await loading.present();
    return loading;
  }
}
