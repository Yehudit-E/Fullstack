import { Component, Input, Output, EventEmitter,  OnChanges,  SimpleChanges } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { Song, PublicSongPostModel } from "../../models/Song"
import  { SongService } from "../../services/song/song.service"

@Component({
  selector: "app-edit-song",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./edit-song.component.html",
  styleUrl: "./edit-song.component.css",
})
export class EditSongComponent implements OnChanges {
  @Input() isVisible = false
  @Input() songToEdit: Song | null = null
  @Output() onClose = new EventEmitter<void>()
  @Output() onSongUpdated = new EventEmitter<void>()

  editSongForm: FormGroup
  isEditingSong = false
  editSongError: string | null = null

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
  ) {
    this.editSongForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      artist: ["", [Validators.required, Validators.minLength(2)]],
      genre: ["", [Validators.required]],
      year: ["", [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      album: ["", [Validators.required]],
      lyrics: [""],
      audioFilePath: ["", [Validators.required]],
      imageFilePath: ["", [Validators.required]],
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["songToEdit"] && this.songToEdit) {
      this.populateForm()
    }
    if (changes["isVisible"] && this.isVisible) {
      this.editSongError = null
    }
  }

  private populateForm() {
    if (this.songToEdit) {
      this.editSongForm.patchValue({
        name: this.songToEdit.name,
        artist: this.songToEdit.artist,
        genre: this.songToEdit.genre,
        year: this.songToEdit.year,
        album: this.songToEdit.album,
        lyrics: this.songToEdit.lyrics,
        audioFilePath: this.songToEdit.audioFilePath,
        imageFilePath: this.songToEdit.imageFilePath,
      })
    }
  }

  closeModal() {
    this.editSongForm.reset()
    this.editSongError = null
    this.onClose.emit()
  }

  onEditSong() {
    if (this.editSongForm.invalid || !this.songToEdit) {
      this.editSongForm.markAllAsTouched()
      return
    }

    this.isEditingSong = true
    this.editSongError = null

    const updatedSong: PublicSongPostModel = this.editSongForm.value

    this.songService.updateSong(this.songToEdit.id, updatedSong).subscribe({
      next: () => {
        this.isEditingSong = false
        this.closeModal()
        this.onSongUpdated.emit()
      },
      error: (err) => {
        this.isEditingSong = false
        this.editSongError = "Failed to update song. Please try again."
        console.error("Error updating song:", err)
      },
    })
  }

  getFormErrorMessage(fieldName: string): string {
    const field = this.editSongForm.get(fieldName)
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
