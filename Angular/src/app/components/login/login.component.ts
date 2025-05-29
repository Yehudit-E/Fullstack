import { Component } from "@angular/core"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatSelectModule } from "@angular/material/select"
import { MatInputModule } from "@angular/material/input"
import { Router } from "@angular/router"
import { MatStepperModule } from "@angular/material/stepper"
import { AuthService } from "../../services/auth/auth.service"
import { UserLogin } from "../../models/User"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatStepperModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  loginSuccess: string | null = null
  userForm: FormGroup
  hide = true
  isLoading = false
  loginError: string | null = null
  isLogin = true // For future toggle functionality

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.userForm = this.fb.group({
      email: ["", [Validators.required, Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      password: ["", [Validators.required]],
    })
  }

  togglePasswordVisibility() {
    this.hide = !this.hide
  }

  toggleAuthMode() {
    this.isLogin = !this.isLogin
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched()
      return
    }

    this.isLoading = true
    this.loginError = null

    const u = new UserLogin(this.userForm.get("email")?.value, this.userForm.get("password")?.value)

    // Call the auth service
    this.authService.signIn(u, (success, message) => {
      this.isLoading = false
      if (success) {
        this.router.navigate(["/home"])
      } else {
        this.loginError = message
      }
    })
  }

  getEmailErrorMessage() {
    const emailControl = this.userForm.get("email")
    if (emailControl?.hasError("required")) {
      return "Email is required"
    }
    if (emailControl?.hasError("pattern")) {
      return "Please enter a valid email address"
    }
    return ""
  }

  getPasswordErrorMessage() {
    const passwordControl = this.userForm.get("password")
    if (passwordControl?.hasError("required")) {
      return "Password is required"
    }
    if (passwordControl?.hasError("pattern")) {
      return "Password must be at least 6 characters with at least one letter and one number"
    }
    return ""
  }
}
