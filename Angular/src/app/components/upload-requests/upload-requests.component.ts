import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { RequestService } from "../../services/request/request.service"
import  { UploadRequest } from "../../models/Request"
import { PlayerComponent } from "../player/player.component"

@Component({
  selector: "app-upload-requests",
  standalone: true,
  imports: [CommonModule, FormsModule, PlayerComponent],
  templateUrl: "./upload-requests.component.html",
  styleUrl: "./upload-requests.component.css",
})
export class UploadRequestsComponent implements OnInit {
  requests: UploadRequest[] = []
  filteredRequests: UploadRequest[] = []
  activeTab: "pending" | "answered" = "pending"
  statusFilter: "all" | "approved" | "rejected" = "all"
  searchTerm = ""
  isLoading = false

  // Player related properties
  currentlyPlaying: UploadRequest | null = null
  showMusicPlayer = false
  processingRequests = new Set<number>()

  constructor(private requestService: RequestService) {}

  ngOnInit() {
    this.loadRequests()
  }

  loadRequests() {
    this.isLoading = true
    this.requestService.getFullRequests().subscribe({
      next: (requests: any[]) => {
        this.requests = requests
        this.applyFilters()
        this.isLoading = false
        console.log("Requests loaded:", this.requests)
      },
      error: (error) => {
        console.error("Error loading requests:", error)
        this.isLoading = false
      },
    })
  }

  setActiveTab(tab: "pending" | "answered") {
    this.activeTab = tab
    this.statusFilter = "all"
    this.applyFilters()
  }

  setStatusFilter(filter: "all" | "approved" | "rejected") {
    this.statusFilter = filter
    this.applyFilters()
  }

  onSearch() {
    this.applyFilters()
  }

  applyFilters() {
    let filtered = [...this.requests]

    // Filter by tab (answered/pending)
    if (this.activeTab === "pending") {
      filtered = filtered.filter((request) => !request.isAnswered)
    } else {
      filtered = filtered.filter((request) => request.isAnswered)

      // Apply status filter only for answered requests
      if (this.statusFilter === "approved") {
        filtered = filtered.filter((request) => request.isApproved)
      } else if (this.statusFilter === "rejected") {
        filtered = filtered.filter((request) => !request.isApproved)
      }
    }

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.song.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          request.song.artist.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          request.user.userName.toLowerCase().includes(this.searchTerm.toLowerCase()),
      )
    }

    this.filteredRequests = filtered
  }

  approveRequest(request: UploadRequest) {
    if (this.processingRequests.has(request.id)) return

    this.processingRequests.add(request.id)
    this.requestService.updateRequestStatus(request.id, true).subscribe({
      next: () => {
        request.isAnswered = true
        request.isApproved = true
        this.processingRequests.delete(request.id)
        this.applyFilters()
      },
      error: (error) => {
        console.error("Error approving request:", error)
        this.processingRequests.delete(request.id)
      },
    })
  }

  rejectRequest(request: UploadRequest) {
    if (this.processingRequests.has(request.id)) return

    this.processingRequests.add(request.id)
    this.requestService.updateRequestStatus(request.id, false).subscribe({
      next: () => {
        request.isAnswered = true
        request.isApproved = false
        this.processingRequests.delete(request.id)
        this.applyFilters()
      },
      error: (error) => {
        console.error("Error rejecting request:", error)
        this.processingRequests.delete(request.id)
      },
    })
  }

  playSong(request: UploadRequest) {
    this.currentlyPlaying = request
    this.showMusicPlayer = true
  }

  onPlayerClose() {
    this.showMusicPlayer = false
    this.currentlyPlaying = null
  }

  onSongEnd() {
    this.showMusicPlayer = false
    this.currentlyPlaying = null
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  getPendingCount(): number {
    console.log("Calculating pending count from requests:", this.requests);
    let res = this.requests.filter((r) => !r.isAnswered);
    console.log("Pending requests:", res);
    return res.length
  }

  getAnsweredCount(): number {
    return this.requests.filter((r) => r.isAnswered).length
  }

  getApprovedCount(): number {
    return this.requests.filter((r) => r.isAnswered && r.isApproved).length
  }

  getRejectedCount(): number {
    return this.requests.filter((r) => r.isAnswered && !r.isApproved).length
  }

  isProcessing(requestId: number): boolean {
    return this.processingRequests.has(requestId)
  }
}
