import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular'; // Impor ToastController

@Component({
  selector: 'app-product-upload',
  templateUrl: './product-upload.page.html',
  styleUrls: ['./product-upload.page.scss'],
})
export class ProductUploadPage implements OnInit {
  productForm: FormGroup; // Form untuk produk
  selectedFile: File | null = null; // File gambar produk
  imagePreview: string | ArrayBuffer | null = null; // URL untuk pratinjau gambar

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastController: ToastController // Inject ToastController
  ) {
    // Form group untuk menangani input produk
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    console.log('Product Upload Page initialized');
  }

  // Fungsi untuk mengambil gambar dari kamera
  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });

    const response = await fetch(image.webPath!);
    const blob = await response.blob();
    this.selectedFile = new File([blob], 'photo.jpg', { type: blob.type });

    // Buat pratinjau gambar
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result; // Set URL pratinjau
    };
    reader.readAsDataURL(this.selectedFile);

    console.log('Image selected:', this.selectedFile);
  }

  // Fungsi untuk menangani pemilihan file dari input
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Buat pratinjau gambar menggunakan FileReader
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Set URL pratinjau
      };
      reader.readAsDataURL(file);
    }
  }

  // Fungsi untuk submit produk
  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('price', this.productForm.get('price')?.value.toString());
      formData.append(
        'description',
        this.productForm.get('description')?.value
      );

      if (this.selectedFile) {
        formData.append('photo_urls', this.selectedFile); // Tambahkan gambar ke formData
      } else {
        this.presentToast('Please upload a product image.', 'warning');
        return;
      }

      // Panggil API untuk menambahkan produk
      this.apiService.addProduct(formData).subscribe(
        async (response) => {
          console.log('API response:', response);
          await this.presentToast('Product added successfully!', 'success'); // Tampilkan toast jika berhasil
          this.router.navigate(['/product-list']); // Kembali ke halaman utama
        },
        async (error) => {
          console.error('Error occurred:', error);
          await this.presentToast(
            'An error occurred: ' + error.message,
            'danger'
          ); // Tampilkan toast jika gagal
        }
      );
    } else {
      this.presentToast('Please fill in all required fields.', 'warning'); // Tampilkan toast jika validasi gagal
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
}
