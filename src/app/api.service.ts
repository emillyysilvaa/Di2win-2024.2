import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://backend-embarque.vercel.app/ReportByTags'
  constructor(private http: HttpClient) {}

  getDados(body: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, body)
  }

  private apiUrlExport = 'https://backend-embarque.vercel.app/export'
  exportaDados(): Observable<any> {
    return this.http.get(this.apiUrlExport, {
      responseType: 'blob'
    })
  }
}
