import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Pastikan ini diimpor
import { RouterModule } from '@angular/router';

import { EditProductPage } from './product-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Diperlukan untuk formGroup
    IonicModule, // Pastikan IonicModule ditambahkan
    RouterModule.forChild([{ path: '', component: EditProductPage }]),
  ],
  declarations: [EditProductPage],
})
export class EditProductPageModule {}
