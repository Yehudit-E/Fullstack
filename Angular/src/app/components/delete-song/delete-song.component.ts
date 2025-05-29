import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import  { Song } from "../../models/Song"
import  { SongService } from "../../services/song/song.service"

@Component({
  selector: "app-delete-song",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./delete-song.component.html",
  styleUrl: "./delete-song.component.css",
})
export class DeleteSongComponent {
  @Input() isVisible = false
  @Input() songToDelete: Song | null = null
  @Output() onClose = new EventEmitter<void>()
  @Output() onSongDeleted = new EventEmitter<void>()

  isDeleting = false

  constructor(private songService: SongService) {}

  closeModal() {
    this.onClose.emit()
  }

  confirmDelete() {
    if (!this.songToDelete || this.isDeleting) return

    this.isDeleting = true

    this.songService.deleteSong(this.songToDelete.id).subscribe({
      next: () => {
        this.isDeleting = false
        this.closeModal()
        this.onSongDeleted.emit()
      },
      error: (error) => {
        console.error("Error deleting song:", error)
        this.isDeleting = false
        // You might want to show an error message here
      },
    })
  }
}
