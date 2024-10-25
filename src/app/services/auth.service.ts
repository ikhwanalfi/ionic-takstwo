import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Fungsi untuk menyimpan token setelah login berhasil
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Fungsi untuk login
  login(username: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.http.post(`${this.baseUrl}/api/login`, formData).pipe(
      tap((response: any) => {
        if (response && response.data && response.data.token) {
          this.saveToken(response.data.token); // Simpan token setelah login
        }
      })
    );
  }

  //Fungsi buat register
  register(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/register`, formData);
  }

  // Fungsi untuk menyimpan data pengguna
  saveUserData(user: any): void {
    const { username, email, photo_url } = user;
    localStorage.setItem('currentUsername', username);
    localStorage.setItem('currentEmail', email);
    localStorage.setItem('currentPhotoUrl', photo_url);
  }

  // Fungsi untuk mendapatkan token yang disimpan
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Fungsi untuk mengambil profil pengguna dari API
  getUserProfile(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found, user not authenticated');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/api/profile`, { headers });
  }

  // Fungsi untuk logout (menghapus token dan data pengguna)
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUsername');
    localStorage.removeItem('currentEmail');
    localStorage.removeItem('currentPhotoUrl');
  }
}
