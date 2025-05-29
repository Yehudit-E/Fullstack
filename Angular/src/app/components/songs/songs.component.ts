import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { SongService } from "../../services/song/song.service"
import {  Song, PublicSongPostModel } from "../../models/Song"
import { PlayerComponent } from "../player/player.component"
import { EditSongComponent } from "../edit-song/edit-song.component"
import { DeleteSongComponent } from "../delete-song/delete-song.component"

@Component({
  selector: "app-songs",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PlayerComponent, EditSongComponent, DeleteSongComponent],
  templateUrl: "./songs.component.html",
  styleUrl: "./songs.component.css",
})
export class SongsComponent implements OnInit {
  songs: Song[] = []
  filteredSongs: Song[] = []
  searchTerm = ""
  sortBy: "name" | "artist" | "year" | "plays" = "name"
  sortDirection: "asc" | "desc" = "asc"
  isLoading = false
  showEditSongModal = false
  showDeleteModal = false
  songToDelete: Song | null = null
  songToEdit: Song | null = null

  // Player related properties
  currentlyPlaying: Song | null = null
  showMusicPlayer = false

  constructor(
    private songService: SongService,
    private fb: FormBuilder,
  ) {
    
  }

  ngOnInit() {
    this.loadSongs()
  }

  loadSongs() {
    this.isLoading = true
    this.songService.getPublicSongs().subscribe({
      next: (songs) => {
        this.songs = songs
        this.filteredSongs = [...songs]
        this.applyFiltersAndSort()
        this.isLoading = false
        console.log(this.songs)
      },
      error: (error) => {
        console.error("Error loading songs:", error)
        this.isLoading = false
      },
    })
  }

  onSearch() {
    this.applyFiltersAndSort()
  }

  onSort(field: "name" | "artist" | "year" | "plays") {
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
    this.filteredSongs = this.songs.filter(
      (song) =>
        song.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        song.album.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        song.genre.toLowerCase().includes(this.searchTerm.toLowerCase()),
    )

    // Sort
    this.filteredSongs.sort((a, b) => {
      let comparison = 0

      switch (this.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "artist":
          comparison = a.artist.localeCompare(b.artist)
          break
        case "year":
          comparison = a.year - b.year
          break
        case "plays":
          comparison = a.countOfPlays - b.countOfPlays
          break
      }

      return this.sortDirection === "asc" ? comparison : -comparison
    })
  }

  



  openEditSongModal(song: Song) {
    this.songToEdit = song
    this.showEditSongModal = true
  }

  closeEditSongModal() {
    this.showEditSongModal = false
    this.songToEdit = null
  }

  onSongUpdated() {
    this.loadSongs()
  }

  openDeleteModal(song: Song) {
    this.songToDelete = song
    this.showDeleteModal = true
  }

  closeDeleteModal() {
    this.showDeleteModal = false
    this.songToDelete = null
  }

  onSongDeleted() {
    this.loadSongs()
  }

routToUpload(){
    window.location.href = "/upload"
}

  // Player methods
  playSong(song: Song) {
    this.currentlyPlaying = song
    this.showMusicPlayer = true
  }

  onPlayerClose() {
    this.showMusicPlayer = false
    this.currentlyPlaying = null
  }

  onSongEnd() {
    // Optionally play next song or just stop
    this.showMusicPlayer = false
    this.currentlyPlaying = null
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  getFormErrorMessage(fieldName: string, form: FormGroup): string {
    const field = form.get(fieldName)
    if (field?.hasError("required")) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
    }
    if (field?.hasError("minlength")) {
      const minLength = field.errors?.["minlength"]?.requiredLength
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${minLength} characters`
    }
    if (field?.hasError("min")) {
      const min = field.errors?.["min"]?.min
      return `Year must be at least ${min}`
    }
    if (field?.hasError("max")) {
      const max = field.errors?.["max"]?.max
      return `Year cannot be greater than ${max}`
    }
    return ""
  }
}
