// import { Component, type OnInit, ViewChild, type ElementRef, type AfterViewInit } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { Chart, registerables } from "chart.js"
// import  { UserService } from "../../services/user/user.service"
// import  { SongService } from "../../services/song/song.service"
// import  { RequestService } from "../../services/request/request.service"
// import  { User } from "../../models/User"
// import  { Song } from "../../models/Song"
// import  { UploadRequest } from "../../models/Request"

// // Register Chart.js components
// Chart.register(...registerables)

// interface AnalyticsData {
//   totalUsers: number
//   totalSongs: number
//   activeUsers: number
//   totalRequests: number
//   userGrowthData: number[]
//   songUploadData: number[]
//   genreData: { [key: string]: number }
//   topSongs: Array<{
//     name: string
//     artist: string
//     plays: number
//     rating: number
//     imageFilePath: string
//   }>
//   activeUsersList: Array<{
//     name: string
//     email: string
//     songsCount: number
//     playlistsCount: number
//     lastActive: string
//     activity: number
//   }>
// }

// @Component({
//   selector: "app-analytics",
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: "./analytics.component.html",
//   styleUrl: "./analytics.component.css",
// })
// export class AnalyticsComponent implements OnInit, AfterViewInit {
//   @ViewChild("userGrowthChart", { static: false }) userGrowthChart!: ElementRef<HTMLCanvasElement>
//   @ViewChild("songUploadsChart", { static: false }) songUploadsChart!: ElementRef<HTMLCanvasElement>
//   @ViewChild("userEngagementChart", { static: false }) userEngagementChart!: ElementRef<HTMLCanvasElement>
//   @ViewChild("genresChart", { static: false }) genresChart!: ElementRef<HTMLCanvasElement>

//   isLoading = false
//   analytics: AnalyticsData = {
//     totalUsers: 0,
//     totalSongs: 0,
//     activeUsers: 0,
//     totalRequests: 0,
//     userGrowthData: [],
//     songUploadData: [],
//     genreData: {},
//     topSongs: [],
//     activeUsersList: [],
//   }

//   private charts: { [key: string]: Chart } = {}

//   constructor(
//     private userService: UserService,
//     private songService: SongService,
//     private requestService: RequestService,
//   ) {}

//   ngOnInit() {
//     this.loadAnalyticsData()
//   }

//   ngAfterViewInit() {
//     // Charts will be initialized after data is loaded
//   }

//   loadAnalyticsData() {
//     this.isLoading = true

//     // Load all data concurrently
//     Promise.all([
//       this.userService.getFull().toPromise(),
//       this.songService.getPublicSongs().toPromise(),
//       this.requestService.getFullRequests().toPromise(),
//     ])
//       .then(([users, songs, requests]) => {
//         this.processAnalyticsData(users || [], songs || [],[])
//         this.isLoading = false

//         // Initialize charts after data is processed
//         setTimeout(() => {
//           this.initializeCharts()
//         }, 100)
//       })
//       .catch((error) => {
//         console.error("Error loading analytics data:", error)
//         this.isLoading = false
//       })
//   }

//   private processAnalyticsData(users: User[], songs: Song[], requests: UploadRequest[]) {
//     // Basic stats
//     this.analytics.totalUsers = users.length
//     this.analytics.totalSongs = songs.length
//     this.analytics.totalRequests = requests.length

//     // Calculate active users (users with playlists or songs)
//     this.analytics.activeUsers = users.filter(
//       (user) => user.ownedPlaylists.length > 0 || user.sharedPlaylists.length > 0,
//     ).length

//     // Generate user growth data (last 12 months)
//     this.analytics.userGrowthData = this.generateUserGrowthData(users)

//     // Generate song upload data (last 12 months)
//     this.analytics.songUploadData = this.generateSongUploadData(songs)

//     // Process genre data
//     this.analytics.genreData = this.processGenreData(songs)

//     // Get top songs by play count
//     this.analytics.topSongs = songs
//       .sort((a, b) => b.countOfPlays - a.countOfPlays)
//       .slice(0, 10)
//       .map((song) => ({
//         name: song.name,
//         artist: song.artist,
//         plays: song.countOfPlays,
//         rating: Math.random() * 2 + 3, // Mock rating since not in model
//         imageFilePath: song.imageFilePath,
//       }))

//     // Get most active users
//     this.analytics.activeUsersList = users
//       .map((user) => ({
//         name: user.userName,
//         email: user.email,
//         songsCount: this.getTotalSongs(user),
//         playlistsCount: user.ownedPlaylists.length + user.sharedPlaylists.length,
//         lastActive: this.formatDate(user.createdAt),
//         activity: Math.min(100, (this.getTotalSongs(user) + user.ownedPlaylists.length) * 10),
//       }))
//       .sort((a, b) => b.activity - a.activity)
//       .slice(0, 10)
//   }

//   private generateUserGrowthData(users: User[]): number[] {
//     const monthlyData = new Array(12).fill(0)
//     const now = new Date()

//     users.forEach((user) => {
//       const userDate = new Date(user.createdAt)
//       const monthDiff = (now.getFullYear() - userDate.getFullYear()) * 12 + (now.getMonth() - userDate.getMonth())

//       if (monthDiff >= 0 && monthDiff < 12) {
//         monthlyData[11 - monthDiff]++
//       }
//     })

//     // Convert to cumulative data
//     for (let i = 1; i < monthlyData.length; i++) {
//       monthlyData[i] += monthlyData[i - 1]
//     }

//     return monthlyData
//   }

//   private generateSongUploadData(songs: Song[]): number[] {
//     const monthlyData = new Array(12).fill(0)
//     const now = new Date()

//     songs.forEach((song) => {
//       const songDate = new Date(song.create_at)
//       const monthDiff = (now.getFullYear() - songDate.getFullYear()) * 12 + (now.getMonth() - songDate.getMonth())

//       if (monthDiff >= 0 && monthDiff < 12) {
//         monthlyData[11 - monthDiff]++
//       }
//     })

//     return monthlyData
//   }

//   private processGenreData(songs: Song[]): { [key: string]: number } {
//     const genreCount: { [key: string]: number } = {}

//     songs.forEach((song) => {
//       const genre = song.genre || "Unknown"
//       genreCount[genre] = (genreCount[genre] || 0) + 1
//     })

//     return genreCount
//   }

//   private getTotalSongs(user: User): number {
//     return user.ownedPlaylists.reduce((total, playlist) => total + (playlist.songs?.length || 0), 0)
//   }

//   private formatDate(dateString: string): string {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     })
//   }

//   private initializeCharts() {
//     this.createUserGrowthChart()
//     this.createSongUploadsChart()
//     this.createUserEngagementChart()
//     this.createGenresChart()
//   }

//   private createUserGrowthChart() {
//     if (this.charts["userGrowth"]) {
//       this.charts["userGrowth"].destroy()
//     }

//     const ctx = this.userGrowthChart.nativeElement.getContext("2d")
//     if (!ctx) return

//     const months = this.getLastTwelveMonths()

//     this.charts["userGrowth"] = new Chart(ctx, {
//       type: "line",
//       data: {
//         labels: months,
//         datasets: [
//           {
//             label: "Total Users",
//             data: this.analytics.userGrowthData,
//             borderColor: "#4ecdc4",
//             backgroundColor: "rgba(78, 205, 196, 0.1)",
//             borderWidth: 3,
//             fill: true,
//             tension: 0.4,
//             pointBackgroundColor: "#4ecdc4",
//             pointBorderColor: "#ffffff",
//             pointBorderWidth: 2,
//             pointRadius: 5,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             display: false,
//           },
//         },
//         scales: {
//           x: {
//             grid: {
//               color: "rgba(255, 255, 255, 0.1)",
//             },
//             ticks: {
//               color: "#a0a0a0",
//             },
//           },
//           y: {
//             grid: {
//               color: "rgba(255, 255, 255, 0.1)",
//             },
//             ticks: {
//               color: "#a0a0a0",
//             },
//           },
//         },
//       },
//     })
//   }

//   private createSongUploadsChart() {
//     if (this.charts["songUploads"]) {
//       this.charts["songUploads"].destroy()
//     }

//     const ctx = this.songUploadsChart.nativeElement.getContext("2d")
//     if (!ctx) return

//     const months = this.getLastTwelveMonths()

//     this.charts["songUploads"] = new Chart(ctx, {
//       type: "bar",
//       data: {
//         labels: months,
//         datasets: [
//           {
//             label: "Songs Uploaded",
//             data: this.analytics.songUploadData,
//             backgroundColor: "rgba(255, 107, 107, 0.8)",
//             borderColor: "#ff6b6b",
//             borderWidth: 1,
//             borderRadius: 6,
//             borderSkipped: false,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             display: false,
//           },
//         },
//         scales: {
//           x: {
//             grid: {
//               color: "rgba(255, 255, 255, 0.1)",
//             },
//             ticks: {
//               color: "#a0a0a0",
//             },
//           },
//           y: {
//             grid: {
//               color: "rgba(255, 255, 255, 0.1)",
//             },
//             ticks: {
//               color: "#a0a0a0",
//             },
//           },
//         },
//       },
//     })
//   }

//   private createUserEngagementChart() {
//     if (this.charts["userEngagement"]) {
//       this.charts["userEngagement"].destroy()
//     }

//     const ctx = this.userEngagementChart.nativeElement.getContext("2d")
//     if (!ctx) return

//     // Mock engagement data by day of week
//     const engagementData = [65, 78, 82, 88, 92, 85, 70]
//     const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

//     this.charts["userEngagement"] = new Chart(ctx, {
//       type: "radar",
//       data: {
//         labels: daysOfWeek,
//         datasets: [
//           {
//             label: "User Engagement",
//             data: engagementData,
//             borderColor: "#45b7d1",
//             backgroundColor: "rgba(69, 183, 209, 0.2)",
//             borderWidth: 2,
//             pointBackgroundColor: "#45b7d1",
//             pointBorderColor: "#ffffff",
//             pointBorderWidth: 2,
//             pointRadius: 4,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             display: false,
//           },
//         },
//         scales: {
//           r: {
//             grid: {
//               color: "rgba(255, 255, 255, 0.1)",
//             },
//             angleLines: {
//               color: "rgba(255, 255, 255, 0.1)",
//             },
//             ticks: {
//               color: "#a0a0a0",
//               backdropColor: "transparent",
//             },
//             pointLabels: {
//               color: "#a0a0a0",
//             },
//           },
//         },
//       },
//     })
//   }

//   private createGenresChart() {
//     if (this.charts["genres"]) {
//       this.charts["genres"].destroy()
//     }

//     const ctx = this.genresChart.nativeElement.getContext("2d")
//     if (!ctx) return

//     const genres = Object.keys(this.analytics.genreData)
//     const counts = Object.values(this.analytics.genreData)

//     const colors = [
//       "#ff6b6b",
//       "#4ecdc4",
//       "#45b7d1",
//       "#96ceb4",
//       "#feca57",
//       "#ff9ff3",
//       "#54a0ff",
//       "#5f27cd",
//       "#00d2d3",
//       "#ff9f43",
//     ]

//     this.charts["genres"] = new Chart(ctx, {
//       type: "doughnut",
//       data: {
//         labels: genres,
//         datasets: [
//           {
//             data: counts,
//             backgroundColor: colors.slice(0, genres.length),
//             borderColor: "#000000",
//             borderWidth: 2,
//             hoverBorderWidth: 3,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             position: "bottom",
//             labels: {
//               color: "#a0a0a0",
//               padding: 20,
//               usePointStyle: true,
//               pointStyle: "circle",
//             },
//           },
//         },
//       },
//     })
//   }

//   private getLastTwelveMonths(): string[] {
//     const months = []
//     const now = new Date()

//     for (let i = 11; i >= 0; i--) {
//       const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
//       months.push(date.toLocaleDateString("en-US", { month: "short" }))
//     }

//     return months
//   }

//   exportData() {
//     const data = {
//       timestamp: new Date().toISOString(),
//       analytics: this.analytics,
//     }

//     const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
//     const url = window.URL.createObjectURL(blob)
//     const link = document.createElement("a")
//     link.href = url
//     link.download = `analytics-${new Date().toISOString().split("T")[0]}.json`
//     link.click()
//     window.URL.revokeObjectURL(url)
//   }

//   getUserGrowthPercentage(): string {
//     const data = this.analytics.userGrowthData
//     if (data.length < 2) return "0"

//     const current = data[data.length - 1]
//     const previous = data[data.length - 2]

//     if (previous === 0) return "100"

//     const percentage = ((current - previous) / previous) * 100
//     return percentage.toFixed(1)
//   }

//   getSongGrowthPercentage(): string {
//     const data = this.analytics.songUploadData
//     if (data.length < 2) return "0"

//     const current = data[data.length - 1]
//     const previous = data[data.length - 2]

//     if (previous === 0) return "100"

//     const percentage = ((current - previous) / previous) * 100
//     return percentage.toFixed(1)
//   }

//   getActiveUserPercentage(): string {
//     if (this.analytics.totalUsers === 0) return "0"
//     return ((this.analytics.activeUsers / this.analytics.totalUsers) * 100).toFixed(1)
//   }
// }


import { Component,  OnInit,  OnDestroy,  AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { UserService } from "../../services/user/user.service"
import  { SongService } from "../../services/song/song.service"
import  { RequestService } from "../../services/request/request.service"
import  { PlaylistService } from "../../services/playlist/playlist.service"
import  { User } from "../../models/User"
import  { Song } from "../../models/Song"
import  { UploadRequest } from "../../models/Request"
import  { Playlist } from "../../models/Playlist"

interface ChartData {
  labels: string[]
  datasets: any[]
}

interface AnalyticsStats {
  totalUsers: number
  totalSongs: number
  totalPlaylists: number
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
  averageSongsPerPlaylist: number
  mostActiveUser: string
  mostPopularGenre: string
  totalPlays: number
}

interface MonthlyData {
  month: string
  users: number
  songs: number
  playlists: number
}

@Component({
  selector: "app-analytics",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./analytics.component.html",
  styleUrl: "./analytics.component.css",
})
export class AnalyticsComponent implements OnInit, OnDestroy, AfterViewInit {
  // Data
  users: User[] = []
  songs: Song[] = []
  requests: UploadRequest[] = []
  playlists: Playlist[] = []

  // Analytics
  stats: AnalyticsStats = {
    totalUsers: 0,
    totalSongs: 0,
    totalPlaylists: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    averageSongsPerPlaylist: 0,
    mostActiveUser: "",
    mostPopularGenre: "",
    totalPlays: 0,
  }

  monthlyData: MonthlyData[] = []
  genreData: ChartData = { labels: [], datasets: [] }
  userGrowthData: ChartData = { labels: [], datasets: [] }
  popularSongsData: ChartData = { labels: [], datasets: [] }
  requestStatusData: ChartData = { labels: [], datasets: [] }
  playlistSizeData: ChartData = { labels: [], datasets: [] }

  // UI State
  isLoading = false
  selectedTimeRange = "6months"
  selectedChart = "overview"

  // Chart instances
  private charts: { [key: string]: any } = {}

  constructor(
    private userService: UserService,
    private songService: SongService,
    private requestService: RequestService,
    private playlistService: PlaylistService,
  ) {}

  ngOnInit() {
    this.loadAllData()
  }

  ngAfterViewInit() {
    // Charts will be initialized after data is loaded
  }

  ngOnDestroy() {
    // Cleanup charts
    Object.values(this.charts).forEach((chart) => {
      if (chart && chart.destroy) {
        chart.destroy()
      }
    })
  }

  async loadAllData() {
    this.isLoading = true

    try {
      // Load all data in parallel
      const [users, songs, requests, playlists] = await Promise.all([
        this.userService.getFull().toPromise(),
        this.songService.getPublicSongs().toPromise(),
        this.requestService.getFullRequests().toPromise(),
        this.playlistService.getAllPlaylistsFull().toPromise(),
      ])

      this.users = users || []
      this.songs = songs || []
      this.requests = requests || []
      this.playlists = playlists || []

      this.calculateStats()
      this.processChartData()
      this.initializeCharts()
    } catch (error) {
      console.error("Error loading analytics data:", error)
    } finally {
      this.isLoading = false
    }
  }

  calculateStats() {
    // Basic counts
    this.stats.totalUsers = this.users.length
    this.stats.totalSongs = this.songs.length
    this.stats.totalPlaylists = this.playlists.length
    this.stats.totalRequests = this.requests.length

    // Request statistics
    this.stats.pendingRequests = this.requests.filter((r) => !r.isAnswered).length
    this.stats.approvedRequests = this.requests.filter((r) => r.isAnswered && r.isApproved).length
    this.stats.rejectedRequests = this.requests.filter((r) => r.isAnswered && !r.isApproved).length

    // Average songs per playlist
    const totalSongsInPlaylists = this.playlists.reduce((sum, p) => sum + (p.songs?.length || 0), 0)
    this.stats.averageSongsPerPlaylist =
      this.playlists.length > 0 ? Math.round((totalSongsInPlaylists / this.playlists.length) * 10) / 10 : 0

    // Most active user (user with most playlists)
    const userPlaylistCounts = this.users.map((u) => ({
      name: u.userName,
      count: u.ownedPlaylists?.length || 0,
    }))
    const mostActive = userPlaylistCounts.reduce((max, user) => (user.count > max.count ? user : max), {
      name: "",
      count: 0,
    })
    this.stats.mostActiveUser = mostActive.name || "N/A"

    // Most popular genre
    const genreCounts: { [key: string]: number } = {}
    this.songs.forEach((song) => {
      genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1
    })
    const mostPopular = Object.entries(genreCounts).reduce(
      (max, [genre, count]) => (count > max.count ? { genre, count } : max),
      { genre: "", count: 0 },
    )
    this.stats.mostPopularGenre = mostPopular.genre || "N/A"

    // Total plays
    this.stats.totalPlays = this.songs.reduce((sum, song) => sum + song.countOfPlays, 0)
  }

  processChartData() {
    this.processUserGrowthData()
    this.processGenreData()
    this.processPopularSongsData()
    this.processRequestStatusData()
    this.processPlaylistSizeData()
    this.processMonthlyData()
  }

  processUserGrowthData() {
    // Group users by month
    const monthCounts: { [key: string]: number } = {}

    this.users.forEach((user) => {
      const date = new Date(user.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
    })

    // Sort by date and get last 12 months
    const sortedMonths = Object.entries(monthCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)

    this.userGrowthData = {
      labels: sortedMonths.map(([month]) => {
        const [year, monthNum] = month.split("-")
        const date = new Date(Number.parseInt(year), Number.parseInt(monthNum) - 1)
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      }),
      datasets: [
        {
          label: "New Users",
          data: sortedMonths.map(([, count]) => count),
          borderColor: "#4ecdc4",
          backgroundColor: "rgba(78, 205, 196, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    }
  }

  processGenreData() {
    const genreCounts: { [key: string]: number } = {}

    this.songs.forEach((song) => {
      genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1
    })

    const sortedGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8) // Top 8 genres

    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#54a0ff", "#5f27cd"]

    this.genreData = {
      labels: sortedGenres.map(([genre]) => genre),
      datasets: [
        {
          data: sortedGenres.map(([, count]) => count),
          backgroundColor: colors.slice(0, sortedGenres.length),
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    }
  }

  processPopularSongsData() {
    const topSongs = this.songs
      .sort((a, b) => b.countOfPlays - a.countOfPlays)
      .slice(0, 10)
      .map((song) => ({
        name: `${song.name} - ${song.artist}`,
        plays: song.countOfPlays,
      }))

    this.popularSongsData = {
      labels: topSongs.map((song) => song.name),
      datasets: [
        {
          label: "Plays",
          data: topSongs.map((song) => song.plays),
          backgroundColor: "rgba(255, 107, 107, 0.8)",
          borderColor: "#ff6b6b",
          borderWidth: 1,
        },
      ],
    }
  }

  processRequestStatusData() {
    this.requestStatusData = {
      labels: ["Pending", "Approved", "Rejected"],
      datasets: [
        {
          data: [this.stats.pendingRequests, this.stats.approvedRequests, this.stats.rejectedRequests],
          backgroundColor: ["#feca57", "#2ed573", "#ff4757"],
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    }
  }

  processPlaylistSizeData() {
    const sizeCounts = { "1-5": 0, "6-10": 0, "11-20": 0, "21-50": 0, "50+": 0 }

    this.playlists.forEach((playlist) => {
      const size = playlist.songs?.length || 0
      if (size <= 5) sizeCounts["1-5"]++
      else if (size <= 10) sizeCounts["6-10"]++
      else if (size <= 20) sizeCounts["11-20"]++
      else if (size <= 50) sizeCounts["21-50"]++
      else sizeCounts["50+"]++
    })

    this.playlistSizeData = {
      labels: Object.keys(sizeCounts),
      datasets: [
        {
          label: "Playlists",
          data: Object.values(sizeCounts),
          backgroundColor: [
            "rgba(78, 205, 196, 0.8)",
            "rgba(69, 183, 209, 0.8)",
            "rgba(255, 107, 107, 0.8)",
            "rgba(254, 202, 87, 0.8)",
            "rgba(150, 206, 180, 0.8)",
          ],
          borderColor: ["#4ecdc4", "#45b7d1", "#ff6b6b", "#feca57", "#96ceb4"],
          borderWidth: 1,
        },
      ],
    }
  }

  processMonthlyData() {
    const monthlyStats: { [key: string]: MonthlyData } = {}

    // Process users
    this.users.forEach((user) => {
      const date = new Date(user.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { month: monthKey, users: 0, songs: 0, playlists: 0 }
      }
      monthlyStats[monthKey].users++
    })

    // Process songs
    this.songs.forEach((song) => {
      const date = new Date(song.create_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { month: monthKey, users: 0, songs: 0, playlists: 0 }
      }
      monthlyStats[monthKey].songs++
    })

    // Process playlists
    this.playlists.forEach((playlist) => {
      const date = new Date(playlist.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { month: monthKey, users: 0, songs: 0, playlists: 0 }
      }
      monthlyStats[monthKey].playlists++
    })

    this.monthlyData = Object.values(monthlyStats)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6) // Last 6 months
  }

  initializeCharts() {
    setTimeout(() => {
      this.createUserGrowthChart()
      this.createGenreChart()
      this.createPopularSongsChart()
      this.createRequestStatusChart()
      this.createPlaylistSizeChart()
    }, 100)
  }

  createUserGrowthChart() {
    const canvas = document.getElementById("userGrowthChart") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    this.destroyChart("userGrowth")

    // Simple line chart implementation
    this.drawLineChart(ctx, this.userGrowthData, "User Growth Over Time")
  }

  createGenreChart() {
    const canvas = document.getElementById("genreChart") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    this.destroyChart("genre")

    // Simple pie chart implementation
    this.drawPieChart(ctx, this.genreData, "Songs by Genre")
  }

  createPopularSongsChart() {
    const canvas = document.getElementById("popularSongsChart") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    this.destroyChart("popularSongs")

    // Simple bar chart implementation
    this.drawBarChart(ctx, this.popularSongsData, "Most Popular Songs")
  }

  createRequestStatusChart() {
    const canvas = document.getElementById("requestStatusChart") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    this.destroyChart("requestStatus")

    // Simple doughnut chart implementation
    this.drawDoughnutChart(ctx, this.requestStatusData, "Request Status")
  }

  createPlaylistSizeChart() {
    const canvas = document.getElementById("playlistSizeChart") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    this.destroyChart("playlistSize")

    // Simple bar chart implementation
    this.drawBarChart(ctx, this.playlistSizeData, "Playlist Size Distribution")
  }

  private destroyChart(chartId: string) {
    if (this.charts[chartId]) {
      // Clear canvas
      const canvas = document.getElementById(`${chartId}Chart`) as HTMLCanvasElement
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
      }
      delete this.charts[chartId]
    }
  }

  private drawLineChart(ctx: CanvasRenderingContext2D, data: ChartData, title: string) {
    const canvas = ctx.canvas
    const width = canvas.width
    const height = canvas.height
    const padding = 60

    ctx.clearRect(0, 0, width, height)

    // Set up chart area
    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    // Get data
    const values = data.datasets[0].data as number[]
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)
    const range = maxValue - minValue || 1

    // Draw background
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)"
    ctx.fillRect(padding, padding, chartWidth, chartHeight)

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let i = 0; i <= data.labels.length - 1; i++) {
      const x = padding + (chartWidth / (data.labels.length - 1)) * i
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, padding + chartHeight)
      ctx.stroke()
    }

    // Draw line
    ctx.strokeStyle = data.datasets[0].borderColor
    ctx.lineWidth = 3
    ctx.beginPath()

    values.forEach((value, index) => {
      const x = padding + (chartWidth / (values.length - 1)) * index
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw area fill
    ctx.fillStyle = data.datasets[0].backgroundColor
    ctx.beginPath()
    values.forEach((value, index) => {
      const x = padding + (chartWidth / (values.length - 1)) * index
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.lineTo(padding + chartWidth, padding + chartHeight)
    ctx.lineTo(padding, padding + chartHeight)
    ctx.closePath()
    ctx.fill()

    // Draw points
    ctx.fillStyle = data.datasets[0].borderColor
    values.forEach((value, index) => {
      const x = padding + (chartWidth / (values.length - 1)) * index
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw labels
    ctx.fillStyle = "#ffffff"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"

    data.labels.forEach((label, index) => {
      const x = padding + (chartWidth / (data.labels.length - 1)) * index
      ctx.fillText(label, x, height - 20)
    })

    // Draw y-axis labels
    ctx.textAlign = "right"
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (range / 5) * (5 - i)
      const y = padding + (chartHeight / 5) * i
      ctx.fillText(Math.round(value).toString(), padding - 10, y + 4)
    }

    // Draw title
    ctx.fillStyle = "#ffffff"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.fillText(title, width / 2, 30)
  }

  private drawPieChart(ctx: CanvasRenderingContext2D, data: ChartData, title: string) {
    const canvas = ctx.canvas
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2 + 20
    const radius = Math.min(width, height) / 3

    ctx.clearRect(0, 0, width, height)

    const values = data.datasets[0].data as number[]
    const colors = data.datasets[0].backgroundColor as string[]
    const total = values.reduce((sum, value) => sum + value, 0)

    let currentAngle = -Math.PI / 2

    // Draw pie slices
    values.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = colors[index]
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      currentAngle += sliceAngle
    })

    // Draw legend
    const legendX = width - 150
    let legendY = 50

    data.labels.forEach((label, index) => {
      // Color box
      ctx.fillStyle = colors[index]
      ctx.fillRect(legendX, legendY, 15, 15)

      // Label text
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      ctx.fillText(`${label} (${values[index]})`, legendX + 20, legendY + 12)

      legendY += 25
    })

    // Draw title
    ctx.fillStyle = "#ffffff"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.fillText(title, width / 2, 30)
  }

  private drawBarChart(ctx: CanvasRenderingContext2D, data: ChartData, title: string) {
    const canvas = ctx.canvas
    const width = canvas.width
    const height = canvas.height
    const padding = 60

    ctx.clearRect(0, 0, width, height)

    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    const values = data.datasets[0].data as number[]
    const maxValue = Math.max(...values)
    const barWidth = chartWidth / values.length - 10

    // Draw background
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)"
    ctx.fillRect(padding, padding, chartWidth, chartHeight)

    // Draw bars
    values.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight
      const x = padding + index * (chartWidth / values.length) + 5
      const y = padding + chartHeight - barHeight

      ctx.fillStyle = data.datasets[0].backgroundColor
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw value on top of bar
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
    })

    // Draw labels (truncated for space)
    ctx.fillStyle = "#ffffff"
    ctx.font = "10px Arial"
    ctx.textAlign = "center"

    data.labels.forEach((label, index) => {
      const x = padding + index * (chartWidth / values.length) + barWidth / 2 + 5
      const truncatedLabel = label.length > 15 ? label.substring(0, 15) + "..." : label
      ctx.fillText(truncatedLabel, x, height - 20)
    })

    // Draw title
    ctx.fillStyle = "#ffffff"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.fillText(title, width / 2, 30)
  }

  private drawDoughnutChart(ctx: CanvasRenderingContext2D, data: ChartData, title: string) {
    const canvas = ctx.canvas
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2 + 20
    const outerRadius = Math.min(width, height) / 3
    const innerRadius = outerRadius * 0.6

    ctx.clearRect(0, 0, width, height)

    const values = data.datasets[0].data as number[]
    const colors = data.datasets[0].backgroundColor as string[]
    const total = values.reduce((sum, value) => sum + value, 0)

    let currentAngle = -Math.PI / 2

    // Draw doughnut slices
    values.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle)
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true)
      ctx.closePath()
      ctx.fillStyle = colors[index]
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      currentAngle += sliceAngle
    })

    // Draw center text
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.textAlign = "center"
    ctx.fillText(total.toString(), centerX, centerY - 5)
    ctx.font = "12px Arial"
    ctx.fillText("Total", centerX, centerY + 15)

    // Draw legend
    const legendX = width - 120
    let legendY = 50

    data.labels.forEach((label, index) => {
      // Color box
      ctx.fillStyle = colors[index]
      ctx.fillRect(legendX, legendY, 15, 15)

      // Label text
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      ctx.fillText(`${label} (${values[index]})`, legendX + 20, legendY + 12)

      legendY += 25
    })

    // Draw title
    ctx.fillStyle = "#ffffff"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.fillText(title, width / 2, 30)
  }

  onTimeRangeChange() {
    this.processChartData()
    this.initializeCharts()
  }
log(){
  console.log(this.monthlyData);
}
parseMonthYearToDate(monthYear: string): Date | null {
  const [month, yearSuffix] = monthYear.split('-');

  if (!month || !yearSuffix) return null;

  // מניחים שהשנה היא בסגנון "01" => 2001
  const year = parseInt(yearSuffix, 10);
  const fullYear = year < 50 ? 2000 + year : 1900 + year; // התאמה לשנות 1900 או 2000

  const monthNumber = parseInt(month, 10) - 1; // חודשים מתחילים מ־0 ב־JavaScript

  if (isNaN(monthNumber) || isNaN(fullYear)) return null;

  return new Date(fullYear, monthNumber, 1);
}
  refreshData() {
    this.loadAllData()
  }

  exportData() {
    const exportData = {
      stats: this.stats,
      monthlyData: this.monthlyData,
      timestamp: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `analytics-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  getGrowthPercentage(current: number, previous: number): number {
    if (previous === 0) return 0
    return Math.round(((current - previous) / previous) * 100)
  }
}
