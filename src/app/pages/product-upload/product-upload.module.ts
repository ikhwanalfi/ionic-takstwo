import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProductUploadPageRoutingModule } from './product-upload-routing.module';

import { ProductUploadPage } from './product-upload.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ProductUploadPageRoutingModule,
  ],
  declarations: [ProductUploadPage],
})
export class ProductUploadPageModule {}
