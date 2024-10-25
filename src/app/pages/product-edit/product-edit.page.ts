import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.page.html',
  styleUrls: ['./product-edit.page.scss'],
})
export class EditProductPage implements OnInit {
  detail: any;
  editForm: FormGroup;
  productId: string | null = null;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  @Output() productUpdate = new EventEmitter<void>(); // Emit event on update

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    public router: Router,
    private toastController: ToastController
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      price: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{1,2})?$')],
      ],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProductDetails(this.productId);
    } else {
      alert('Invalid product ID');
      this.router.navigate(['/product-list']);
    }
  }

  loadProductDetails(productId: string) {
    this.apiService.getProductById(productId).subscribe(
      (response: any) => {
        if (response && response.data) {
          const product = response.data;
          this.editForm.patchValue({
            name: product.name,
            price: product.price,
            description: product.description,
          });

          if (product.photo_urls && product.photo_urls.length > 0) {
            this.imagePreview = product.photo_urls[0].startsWith('http')
              ? product.photo_urls[0]
              : `http://93.127.199.17:8080/${product.photo_urls[0]}`;
          } else {
            this.imagePreview = 'assets/placeholder.png';
          }
        } else {
          alert('Product not found');
          this.router.navigate(['/product-list']);
        }
      },
      (error) => {
        alert('Failed to load product details');
        this.router.navigate(['/product-list']);
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const allowedTypes = ['image/png', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please upload a PNG or JPG image.');
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });

    const response = await fetch(image.webPath!);
    const blob = await response.blob();
    this.selectedFile = new File([blob], 'photo.jpg', { type: blob.type });

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  async saveProduct() {
    if (this.editForm.valid && this.productId) {
      const formData = new FormData();
      formData.append('name', this.editForm.get('name')?.value);
      formData.append('price', this.editForm.get('price')?.value.toString());
      formData.append('description', this.editForm.get('description')?.value);

      if (this.selectedFile) {
        formData.append('photo_urls', this.selectedFile); // Add the file to FormData
      }

      this.apiService.updateProduct(this.productId, formData).subscribe(
        async () => {
          await this.presentToast('Produk berhasil diperbarui!', 'success');
          this.productUpdate.emit(); // Emit update event
          this.router.navigate(['/product-list']);
        },
        async (error) => {
          console.error('Error updating product:', error);
          await this.presentToast(
            'Gagal memperbarui produk. Silakan coba lagi.',
            'danger'
          );
        }
      );
    } else {
      this.displayValidationErrors();
    }
  }

  displayValidationErrors() {
    const controls = this.editForm.controls;

    if (controls['name'].hasError('required')) {
      alert('Product name is required.');
    }
    if (controls['price'].hasError('required')) {
      alert('Product price is required.');
    }
    if (controls['price'].hasError('pattern')) {
      alert('Please enter a valid price.');
    }
    if (controls['description'].hasError('required')) {
      alert('Product description is required.');
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }
}
