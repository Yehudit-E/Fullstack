import { Component,  OnInit, HostListener } from "@angular/core"
import {  Router, RouterLink, RouterOutlet, RouterLinkActive } from "@angular/router"
import  { UserService } from "../../services/user/user.service"
import { CommonModule } from "@angular/common"
import  { AuthService } from "../../services/auth/auth.service"

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent implements OnInit {
  userMenuOpen = false
  activeRoute = ""

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userService.getUserFromToken()

    // עקוב אחרי שינויים בנתיב הנוכחי
    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url
      console.log("Current route:", this.activeRoute)
    })
  }

  user$ = this.userService.user

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen
    console.log("User menu toggled:", this.userMenuOpen)
  }

  // סגירת התפריט בלחיצה מחוץ לאזור
  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    const userContainer = document.querySelector(".user-container")
    if (userContainer && !userContainer.contains(event.target as Node) && this.userMenuOpen) {
      this.userMenuOpen = false
    }
  }

  logout() {
    console.log("Logging out...")
    this.authService.logout()
  }

  // בדוק אם הנתיב הנוכחי פעיל
  isActive(route: string): boolean {
    return this.activeRoute.startsWith(route)
  }
}