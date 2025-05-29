import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from '../../Global';
import { UploadRequest } from '../../models/Request';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseUrl = `${BASE_URL}/request`;

  // BehaviorSubject לאחסון רשימת הבקשות שנמשכות מהשרת (במיוחד למנהלים)
  public requests = new BehaviorSubject<UploadRequest[]>([]);

  constructor(private http: HttpClient) {}

  // GET api/request - רק למנהלים
  // getAllRequests(): Observable<RequestDto[]> {
  //   return this.http.get<RequestDto[]>(this.baseUrl);
  // }

  // GET api/request/full - רק למנהלים, מחזיר אובייקטים מלאים של בקשות
  getFullRequests(): Observable<UploadRequest[]> {
    return this.http.get<UploadRequest[]>(`${this.baseUrl}/full`);
  }

  // GET api/request/not-answered - רק למנהלים, בקשות שלא טופלו עדיין
  getNotAnsweredRequests(): Observable<any[]> {
    return this.http.get<UploadRequest[]>(`${this.baseUrl}/not-answered`);
  }

  // PUT api/request/{id} - עדכון סטטוס אישור (רק מנהלים)
  updateRequestStatus(id: number, isApproved: boolean): Observable<UploadRequest> {
    console.log(`Updating request with ID: ${id}, isApproved: ${isApproved}`);
    
    return this.http.put<UploadRequest>(`${this.baseUrl}/${id}`, { isApproved });
  }

  // מטודה לסנכרון רשימת הבקשות עם ה־BehaviorSubject
  reloadRequests() {
    this.getFullRequests().subscribe({
      next: requests => this.requests.next(requests),
      error: err => alert('טעינת הבקשות נכשלה')
    });
  }
}
