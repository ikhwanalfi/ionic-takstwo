import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  NavController,
  LoadingController,
  ToastController,
} from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  username: string = '';
  email: string = '';
  password: string = '';
  photoFile: File | null = null;
  termsAccepted: boolean = false;
  registerError: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Fungsi untuk menangani file input
  onFileChange(event: any) {
    const file = event.target.files[0];
    this.photoFile = file;
    console.log('Selected file:', this.photoFile);
  }

  // Fungsi untuk menampilkan loading
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 5000,
    });
    await loading.present();
    return loading;
  }

  // Fungsi untuk menampilkan toast
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    await toast.present();
  }

  // Fungsi registrasi
  async register() {
    if (!this.termsAccepted) {
      alert('Please accept the terms and conditions.');
      return;
    }

    if (!this.photoFile) {
      alert('Please upload a photo.');
      return;
    }

    // Buat objek FormData untuk mengirimkan data registrasi
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('photo_url', this.photoFile!);

    const loading = await this.presentLoading();

    this.authService.register(formData).subscribe(
      async (response: any) => {
        console.log('Registration successful:', response);

        // Mengambil data yang dikembalikan dari API (pastikan struktur API benar)
        const userData = {
          username: response.data.username,
          email: response.data.email,
          photo_url: response.data.photo_url, // Ambil dari API respons
        };

        // Simpan data pengguna di localStorage
        localStorage.setItem(
          `user_${this.username}_data`,
          JSON.stringify(userData)
        );

        // Simpan token otentikasi jika diberikan oleh API
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token); // Simpan token
        }

        // Simpan username yang sedang login
        localStorage.setItem('currentUsername', this.username);

        await loading.dismiss();

        // Tampilkan toast registrasi sukses
        await this.presentToast(
          'Registration successful! Please login.',
          'success'
        );

        // Redirect ke halaman login
        this.navCtrl.navigateRoot('/login');
      },
      async (error) => {
        console.error('Registration failed:', error);
        this.registerError =
          error.error?.message || 'Registration failed. Please try again.';
        await loading.dismiss();
        await this.presentToast(this.registerError, 'danger');
      }
    );
  }
}
