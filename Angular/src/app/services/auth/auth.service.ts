import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { UserLogin } from '../../models/User';
import { UserService } from '../user/user.service';
import { Router } from "@angular/router"
import { BASE_URL } from '../../Global';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = BASE_URL+ "/Auth"; 
  constructor(private http: HttpClient,private userService:UserService,private router: Router) { }

  logout(): void {  
    sessionStorage.removeItem("authToken")
    this.userService.clearUser()
    this.router.navigate(["/"])
  }

  signIn(user: UserLogin, callback: (success: boolean, message: string) => void) {
    console.log("Signing in user:", user);
    this.http.post<any>(this.baseUrl + "/login", user).subscribe(
      (response) => {
        console.log(response)
        if (response && response.user.roles.length > 0) {
          const hasAdminRole = response.user.roles.some((role: { name: string }) => {
            console.log(role)
            return role.name.toLowerCase() === "admin"
          })

          if (hasAdminRole) {
            sessionStorage.setItem("authToken", response.token)
            this.userService.user.next(response.user)
            callback(true, "Login successful! Redirecting to dashboard...")
          } else {
            callback(false, "Access denied: You do not have administrator privileges.")
          }
        } else {
          callback(false, "Access denied: No roles assigned to this user.")
        }
      },
      (error) => {
        console.error("Login failed", error)
        if (error.status === 404) {
          callback(false, "user does not exist")
        } else {
          callback(false, "Login failed. Please try again later.")
        }
      },
    )
  }
}
