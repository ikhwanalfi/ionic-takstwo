import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductUploadPage } from './product-upload.page';

describe('ProductUploadPage', () => {
  let component: ProductUploadPage;
  let fixture: ComponentFixture<ProductUploadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
