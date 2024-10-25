import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ToastController } from '@ionic/angular';
import { RefresherCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  products: any[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.fetchProducts();
  }

  ionViewWillEnter() {
    this.fetchProducts();
  }

  handleRefresh(event: RefresherCustomEvent) {
    this.fetchProducts();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async fetchProducts() {
    this.apiService.getProducts().subscribe(
      async (response: any) => {
        console.log('Data produk:', response.data);
        if (
          response?.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          // Urutkan berdasarkan 'created_at'
          this.products = response.data.sort((a: any, b: any) => {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          });
        } else {
          console.log('Tidak ada produk yang ditemukan');
          this.products = [];
        }
      },
      async (error) => {
        console.error('Kesalahan saat mengambil produk:', error);
        await this.presentToast(
          'Gagal memuat produk. Silakan coba lagi nanti.',
          'danger'
        );
      }
    );
  }

  // Fungsi untuk menampilkan toast sukses atau error
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    await toast.present();
  }

  // Fungsi untuk menangani penghapusan produk dan menampilkan toast sukses
  async onProductDeleted() {
    this.fetchProducts(); // Ambil kembali produk setelah dihapus
    await this.presentToast('Produk berhasil dihapus!', 'success');
  }

  // Fungsi untuk menampilkan toast saat upload sukses
  async onProductUploaded() {
    this.fetchProducts(); // Muat ulang produk setelah upload
    await this.presentToast('Produk berhasil diunggah!', 'success');
  }

  // Fungsi untuk menampilkan toast saat edit sukses
  async onProductEdited() {
    this.fetchProducts(); // Muat ulang produk setelah edit
    await this.presentToast('Produk berhasil diedit!', 'success');
  }
}
