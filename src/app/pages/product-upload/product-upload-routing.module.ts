import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductUploadPage } from './product-upload.page';

const routes: Routes = [
  {
    path: '',
    component: ProductUploadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductUploadPageRoutingModule {}
