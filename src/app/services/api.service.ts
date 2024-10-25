import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Authorization token is missing!');
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  addProduct(productData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .post(`${this.baseUrl}/api/product`, productData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Add product failed', error);
          return throwError(error);
        })
      );
  }

  getProducts(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/api/product`, { headers }).pipe(
      catchError((error) => {
        console.error('Get products failed', error);
        return throwError(error);
      })
    );
  }

  getProductById(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/api/product/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error(`Get product ${id} failed`, error);
        return throwError(error);
      })
    );
  }

  updateProduct(id: string, productData: any): Observable<any> {
    const headers = this.getAuthHeaders(); // Pastikan header sudah benar
    return this.http
      .patch(`${this.baseUrl}/api/product/${id}`, productData, { headers })

      .pipe(
        catchError((error) => {
          console.error(`Update product ${id} failed`, error);
          return throwError(error);
        })
      );
  }

  deleteProduct(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .delete(`${this.baseUrl}/api/product/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error(`Delete product ${id} failed`, error);
          return throwError(error);
        })
      );
  }
}
