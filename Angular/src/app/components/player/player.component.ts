import {
  Component,
  Input,
  Output,
  EventEmitter,
  type OnInit,
  type OnDestroy,
  type OnChanges,
  type SimpleChanges,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import type { Song } from "../../models/Song"

@Component({
  selector: "app-player",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./player.component.html",
  styleUrl: "./player.component.css",
})
export class PlayerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() currentSong: Song | undefined | null = null
  @Input() isVisible = false
  @Output() onClose = new EventEmitter<void>()
  @Output() onSongEnd = new EventEmitter<void>()

  audioElement: HTMLAudioElement | null = null
  currentTime = 0
  duration = 0
  volume = 1
  isPlaying = false
  isLoading = false

  ngOnInit() {
    // Component initialization
  }

  ngOnDestroy() {
    this.cleanup()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["currentSong"] && this.currentSong) {
      this.loadAndPlaySong()
    }
  }

  private cleanup() {
    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement.src = ""
      this.audioElement = null
    }
    this.isPlaying = false
    this.currentTime = 0
    this.duration = 0
  }

  private loadAndPlaySong() {
    if (!this.currentSong) return

    // Cleanup previous audio
    this.cleanup()

    // Create new audio element
    this.audioElement = new Audio()
    this.setupAudioEvents()

    this.isLoading = true
    this.audioElement.src = this.currentSong.audioFilePath
    this.audioElement.load()

    // Play when ready
    this.audioElement.addEventListener(
      "canplay",
      () => {
        this.isLoading = false
        this.play()
      },
      { once: true },
    )
  }

  private setupAudioEvents() {
    if (!this.audioElement) return

    this.audioElement.ontimeupdate = () => {
      this.currentTime = this.audioElement?.currentTime || 0
      this.duration = this.audioElement?.duration || 0
    }

    this.audioElement.onended = () => {
      this.isPlaying = false
      this.currentTime = 0
      this.onSongEnd.emit()
    }

    this.audioElement.onerror = () => {
      console.error("Error playing audio")
      this.isLoading = false
      this.isPlaying = false
    }

    this.audioElement.onloadedmetadata = () => {
      this.duration = this.audioElement?.duration || 0
    }

    this.audioElement.onplay = () => {
      this.isPlaying = true
    }

    this.audioElement.onpause = () => {
      this.isPlaying = false
    }

    this.audioElement.onloadstart = () => {
      this.isLoading = true
    }

    this.audioElement.oncanplay = () => {
      this.isLoading = false
    }
  }

  togglePlayPause() {
    if (!this.audioElement) return

    if (this.audioElement.paused) {
      this.play()
    } else {
      this.pause()
    }
  }

  play() {
    if (this.audioElement) {
      this.audioElement.play().catch((error) => {
        console.error("Error playing audio:", error)
        this.isPlaying = false
      })
    }
  }

  pause() {
    if (this.audioElement) {
      this.audioElement.pause()
    }
  }

  seekTo(event: Event) {
    if (!this.audioElement) return

    const target = event.target as HTMLInputElement
    const seekTime = (Number.parseFloat(target.value) / 100) * this.duration
    this.audioElement.currentTime = seekTime
  }

  setVolume(event: Event) {
    if (!this.audioElement) return

    const target = event.target as HTMLInputElement
    this.volume = Number.parseFloat(target.value) / 100
    this.audioElement.volume = this.volume
  }

  closePlayer() {
    this.cleanup()
    this.onClose.emit()
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return "0:00"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  getProgressPercentage(): number {
    if (!this.duration) return 0
    return (this.currentTime / this.duration) * 100
  }
}
