import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastController } from '@ionic/angular'; // Impor ToastController

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  detail: any;
  productDeleted = new EventEmitter<void>();

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    public router: Router,
    private toastController: ToastController // Inject ToastController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchProductDetail(id);
    }
  }

  // Fungsi untuk mengambil detail produk
  fetchProductDetail(id: string) {
    this.apiService.getProductById(id).subscribe(
      (response: any) => {
        this.detail = response.data;
        console.log('Product detail:', this.detail);
      },
      (error: any) => {
        console.error('Error fetching product detail:', error);
        this.presentToast(
          'Gagal memuat detail produk. Silakan coba lagi.',
          'danger'
        );
      }
    );
  }

  // Fungsi untuk menghapus produk
  deleteProduct() {
    if (this.detail && this.detail.id) {
      this.apiService.deleteProduct(this.detail.id).subscribe(
        async () => {
          await this.presentToast('Produk berhasil dihapus!', 'success'); // Tampilkan toast saat berhasil
          this.productDeleted.emit();
          this.router.navigate(['/product-list']);
        },
        async (error) => {
          console.error('Error deleting product:', error);
          await this.presentToast(
            'Gagal menghapus produk. Silakan coba lagi.',
            'danger'
          ); // Tampilkan toast saat gagal
        }
      );
    }
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

  // Fungsi untuk mengedit produk
  editProduct() {
    this.router.navigate(['/product-edit', this.detail.id]);
  }
}
