import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { UserService } from "../../services/user/user.service"
import { SongService } from "../../services/song/song.service"
import { RequestService } from "../../services/request/request.service"
import { User } from "../../models/User"
import { Song } from "../../models/Song"
import { UploadRequest } from "../../models/Request"
import { PlayerComponent } from "../player/player.component"
import { window } from "rxjs"
import { Router } from '@angular/router';

interface RecentActivity {
  id: string
  type: "user_joined" | "song_uploaded" | "request_submitted" | "request_approved" | "request_rejected"
  title: string
  description: string
  timestamp: string
  user?: string
  icon: string
}

interface QuickStat {
  label: string
  value: number
  change: number
  icon: string
  color: string
}

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, FormsModule, PlayerComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit {
  isLoading = false
  currentUser: User | null = null
  popularSongs: Song[] = []
  recentActivities: RecentActivity[] = []
  quickStats: QuickStat[] = []
  featuredPlaylists: any[] = []

  // Player related properties
  currentlyPlaying: Song | null = null
  showMusicPlayer = false

  // Quick actions
  quickActions = [
    {
      title: "Upload Song",
      description: "Add a new song to the platform.",
      icon: "upload",
      color: "gradient-red",
      action: () => this.router.navigate(['/upload']),
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts.",
      icon: "users",
      color: "gradient-teal",
      action: () => this.router.navigate(['/users']),
    },
    {
      title: "View Requests",
      description: "Review pending song requests.",
      icon: "requests",
      color: "gradient-blue",
      action: () => this.router.navigate(['/upload-requests']),
    },
    {
      title: "Manage Public Songs",
      description: "Organize songs in the public library.",
      icon: "songs",
      color: "gradient-teal",
      action: () => this.router.navigate(['/songs']),
    },
    {
      title: "Usage Dashboard",
      description: "Track user and song activity across the platform.",
      icon: "dashboard",
      color: "gradient-blue",
      action: () => this.router.navigate(['/home']),
    },
    {
      title: "Analytics",
      description: "View platform analytics.",
      icon: "analytics",
      color: "gradient-red",
      action: () => this.router.navigate(['/analytics']),
    },
  ]

  constructor(
    private userService: UserService,
    private songService: SongService,
    private requestService: RequestService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadHomeData()
  }

  loadHomeData() {
    this.isLoading = true

    Promise.all([
      this.userService.getFull().toPromise(),
      this.songService.getAllSongs().toPromise(),
      this.requestService.getFullRequests().toPromise(),
    ])
      .then(([users, songs, requests]) => {
        this.processHomeData(users || [], songs || [], requests || [])
        this.isLoading = false
      })
      .catch((error) => {
        console.error("Error loading home data:", error)
        this.isLoading = false
      })
  }

  private processHomeData(users: User[], songs: Song[], requests: UploadRequest[]) {
    // Get popular songs (top 6 by play count)
    this.popularSongs = songs.sort((a, b) => b.countOfPlays - a.countOfPlays).slice(0, 6)

    // Generate recent activities
    this.recentActivities = this.generateRecentActivities(users, songs, requests)

    // Calculate quick stats
    this.quickStats = [
      {
        label: "Total Users",
        value: users.length,
        change: 12.5,
        icon: "users",
        color: "teal",
      },
      {
        label: "Total Songs",
        value: songs.length,
        change: 24.8,
        icon: "music",
        color: "teal",
      },
      {
        label: "Active Users",
        value: users.filter((u) => u.ownedPlaylists.length > 0 || u.sharedPlaylists.length > 0).length,
        change: 8.3,
        icon: "activity",
        color: "teal",
      },
      {
        label: "Pending Requests",
        value: requests.filter((r) => !r.isAnswered).length,
        change: -5.2,
        icon: "clock",
        color: "teal",
      },
    ]

    // Generate featured playlists (mock data based on users)
    this.featuredPlaylists = users
      .filter((u) => u.ownedPlaylists.length > 0)
      .slice(0, 4)
      .map((user) => ({
        id: user.id,
        name: user.ownedPlaylists[0]?.name || "My Playlist",
        owner: user.userName,
        songCount: user.ownedPlaylists[0]?.songs?.length || 0,
        image: "/placeholder.svg?height=120&width=120",
      }))
  }

  private generateRecentActivities(users: User[], songs: Song[], requests: UploadRequest[]): RecentActivity[] {
    const activities: RecentActivity[] = []

    // Add recent users (last 5)
    users
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .forEach((user) => {
        activities.push({
          id: `user-${user.id}`,
          type: "user_joined",
          title: "New User Joined",
          description: `${user.userName} joined the platform`,
          timestamp: user.createdAt,
          user: user.userName,
          icon: "user-plus",
        })
      })

    // Add recent songs (last 5)
    songs
      .sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime())
      .slice(0, 3)
      .forEach((song) => {
        activities.push({
          id: `song-${song.id}`,
          type: "song_uploaded",
          title: "New Song Uploaded",
          description: `"${song.name}" by ${song.artist}`,
          timestamp: song.create_at,
          icon: "music",
        })
      })

    // Add recent requests (last 4)
    requests.slice(0, 2).forEach((request) => {
      if (request.isAnswered) {
        activities.push({
          id: `request-${request.id}`,
          type: request.isApproved ? "request_approved" : "request_rejected",
          title: request.isApproved ? "Request Approved" : "Request Rejected",
          description: `"${request.song.name}" by ${request.user.userName}`,
          timestamp: request.requestedAt.toString(),
          user: request.user.userName,
          icon: request.isApproved ? "check-circle" : "x-circle",
        })
      } else {
        activities.push({
          id: `request-${request.id}`,
          type: "request_submitted",
          title: "New Request Submitted",
          description: `"${request.song.name}" by ${request.user.userName}`,
          timestamp: request.requestedAt.toString(),
          user: request.user.userName,
          icon: "file-text",
        })
      }
    })

    // Sort by timestamp and return top 8
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8)
  }

  playSong(song: Song) {
    this.currentlyPlaying = song
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
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  getActivityIcon(type: string): string {
    const icons = {
      user_joined: "user-plus",
      song_uploaded: "music",
      request_submitted: "file-text",
      request_approved: "check-circle",
      request_rejected: "x-circle",
    }
    return icons[type as keyof typeof icons] || "activity"
  }

  getActivityColor(type: string): string {
    const colors = {
      user_joined: "teal",
      song_uploaded: "red",
      request_submitted: "blue",
      request_approved: "green",
      request_rejected: "orange",
    }
    return colors[type as keyof typeof colors] || "gray"
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}
