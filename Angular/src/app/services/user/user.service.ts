import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserDto, UserPostModel } from '../../models/User';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from '../../Global';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${BASE_URL}/User`;
  public user: BehaviorSubject<User> = new BehaviorSubject<User>(
    new User(0, '', '', '', '', [], [], [])
  );

  constructor(private http: HttpClient) {}

  // ------------------- GET ----------------------

  // Admin only
  getAll(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.baseUrl);
  }

  // Admin only
  getFull(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/full`);
  }

  // רגיל לפי ID - מחזיר DTO
  getById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.baseUrl}/${id}`);
  }

  // מלא לפי ID - מחזיר Entity מלא (דורש שהמשתמש יהיה זהה ל־ID בטוקן)
  getFullById(id: number): void {
    this.http.get<User>(`${this.baseUrl}/full/${id}`).subscribe(
      data => {
        this.user.next(data);
      },
      err => {
        console.error('שגיאה בקבלת משתמש מלא:', err);
      }
    );
  }

  // ------------------- POST (Admin only) ----------------------

  addUser(user: UserPostModel): Observable<UserDto> {
    return this.http.post<UserDto>(this.baseUrl, user);
  }

  // ------------------- PUT ----------------------

  updateUser(id: number, user: UserPostModel): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.baseUrl}/${id}`, user);
  }

  // ------------------- DELETE (Admin only) ----------------------
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  // ------------------- AUTH HELPERS ----------------------

  clearUser() {
    this.user = new BehaviorSubject<User>(
      new User(0, '', '', '', '', [], [], [])
    );
  }

  getUserFromToken() {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const id = decodedToken.id;
        this.getFullById(id);
      } catch (error) {
        console.error('שגיאה בפענוח ה-Token:', error);
      }
    }
  }

  ngOnInit() {
    this.getUserFromToken();
  }
}
