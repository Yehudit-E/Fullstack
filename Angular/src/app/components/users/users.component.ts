import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { UserService } from "../../services/user/user.service"
import {  User, UserPostModel } from "../../models/User"

@Component({
  selector: "app-users",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.css",
})
export class UsersComponent implements OnInit {
  users: User[] = []
  filteredUsers: User[] = []
  searchTerm = ""
  sortBy: "name" | "date" = "name"
  sortDirection: "asc" | "desc" = "asc"
  isLoading = false
  showAddUserModal = false
  showDeleteModal = false
  userToDelete: User | null = null
  addUserForm: FormGroup
  isAddingUser = false
  addUserError: string | null = null

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.addUserForm = this.fb.group({
      userName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  ngOnInit() {
    this.loadUsers()
  }

  loadUsers() {
    this.isLoading = true
    this.userService.getFull().subscribe({
      next: (users) => {
        this.users = users
        this.filteredUsers = [...users]
        this.applyFiltersAndSort()
        this.isLoading = false
            console.log("Users loaded:", this.users);  

      },
      error: (error) => {
        console.error("Error loading users:", error)
        this.isLoading = false
      },
    })
  }

  onSearch() {
    this.applyFiltersAndSort()
  }

  onSort(field: "name" | "date") {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc"
    } else {
      this.sortBy = field
      this.sortDirection = "asc"
    }
    this.applyFiltersAndSort()
  }

  applyFiltersAndSort() {
    // Filter by search term
    this.filteredUsers = this.users.filter(
      (user) =>
        user.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()),
    )

    // Sort
    this.filteredUsers.sort((a, b) => {
      let comparison = 0

      if (this.sortBy === "name") {
        comparison = a.userName.localeCompare(b.userName)
      } else if (this.sortBy === "date") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }

      return this.sortDirection === "asc" ? comparison : -comparison
    })
  }

  openAddUserModal() {
    this.showAddUserModal = true
    this.addUserForm.reset()
    this.addUserError = null
  }

  closeAddUserModal() {
    this.showAddUserModal = false
    this.addUserForm.reset()
    this.addUserError = null
  }

  onAddUser() {
    if (this.addUserForm.invalid) {
      this.addUserForm.markAllAsTouched()
      return
    }

    this.isAddingUser = true
    this.addUserError = null

    const newUser = new UserPostModel(
      this.addUserForm.get("userName")?.value,
      this.addUserForm.get("email")?.value,
      this.addUserForm.get("password")?.value,
    )

    this.userService.addUser(newUser).subscribe({
      next: () => {
        this.isAddingUser = false
        this.closeAddUserModal()
        this.loadUsers() // Reload users list
      },
      error: (error) => {
        this.isAddingUser = false
        this.addUserError = error.error?.message || "Failed to add user"
      },
    })
  }

  openDeleteModal(user: User) {
    this.userToDelete = user
    this.showDeleteModal = true
  }

  closeDeleteModal() {
    this.showDeleteModal = false
    this.userToDelete = null
  }

  confirmDelete() {
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete.id).subscribe({
        next: () => {
          this.loadUsers()
          this.closeDeleteModal()
        },
        error: (error) => {
          console.error("Error deleting user:", error)
        }
      })

      this.users = this.users.filter((u) => u.id !== this.userToDelete!.id)
      this.applyFiltersAndSort()
      this.closeDeleteModal()
    }
  }

  getTotalSongs(user: User): number {
    return user.ownedPlaylists.reduce((total, playlist) => total + (playlist.songs?.length || 0), 0)
  }
log=(user:any):void=>{
  console.log(user.createAt)
}
  formatDate(dateString: string): string {
    console.log("Formatting date:", dateString);
    
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  getFormErrorMessage(fieldName: string): string {
    const field = this.addUserForm.get(fieldName)
    if (field?.hasError("required")) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
    }
    if (field?.hasError("email")) {
      return "Please enter a valid email address"
    }
    if (field?.hasError("minlength")) {
      const minLength = field.errors?.["minlength"]?.requiredLength
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${minLength} characters`
    }
    return ""
  }
}
