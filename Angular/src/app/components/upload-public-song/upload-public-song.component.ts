import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { SongService } from "../../services/song/song.service"
import { PublicSongPostModel } from "../../models/Song"
  import { parseBlob } from 'music-metadata-browser';

interface MetaData {
  title: string
  artist: string
  genre: string
  album: string
  year: string
}

interface UploadProgress {
  audio: number
  image: number
}

interface ExtractedImage {
  data: ArrayBuffer
  format: string
  name: string
}

@Component({
  selector: "app-upload-public-song",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./upload-public-song.component.html",
  styleUrl: "./upload-public-song.component.css",
})
export class UploadPublicSongComponent implements OnInit {
  // File handling
  audioFile: File | null = null
  extractedImage: ExtractedImage | null = null

  // Upload progress
  uploadProgress: UploadProgress = { audio: 0, image: 0 }

  // Form data
  metaData: MetaData = {
    title: "",
    artist: "",
    genre: "",
    album: "",
    year: new Date().getFullYear().toString(),
  }

  // UI state
  currentStep = 1
  isLoading = false
  error = ""
  success = false

  imageFile: File | null = null
  // Upload URLs
  audioUploadUrl: { url: string } | undefined = { url: "" }
  imageUploadUrl: { url: string } | undefined = { url: "" }

  // Genre options
  genres = [
    "Pop",
    "Rock",
    "Hip Hop",
    "Electronic",
    "R&B",
    "Jazz",
    "Classical",
    "Country",
    "Folk",
    "Alternative",
    "Metal",
    "Blues",
    "Reggae",
    "Other",
  ]

  constructor(
    private songService: SongService,
    private router: Router,
  ) { }

  ngOnInit() {
    // Component initialization
  }

  // File handling methods
  onAudioFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (file) {
      if (!file.type.startsWith("audio/")) {
        this.error = "Please select an audio file (mp3, wav, etc.)"
        return
      }

      this.audioFile = file
      console.log(this.audioFile);

      this.extractMetaDataAndImage(file)
      this.error = ""
    }
  }

  onAudioFileDrop(event: DragEvent) {
    event.preventDefault()
    const file = event.dataTransfer?.files[0]

    if (file) {
      if (!file.type.startsWith("audio/")) {
        this.error = "Please select an audio file (mp3, wav, etc.)"
        return
      }

      this.audioFile = file
      this.extractMetaDataAndImage(file)
      this.error = ""
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault()
  }

  removeAudioFile() {
    this.audioFile = null
    this.extractedImage = null
    this.uploadProgress = { audio: 0, image: 0 }
    this.resetMetaData()
  }

  removeImageFile() {
    this.imageFile = null
    this.uploadProgress.image = 0
  }

  private resetMetaData() {
    this.metaData = {
      title: "",
      artist: "",
      genre: "",
      album: "",
      year: new Date().getFullYear().toString(),
    }
  }


private async extractMetaDataAndImage(file: File) {
  try {
    const metadata = await parseBlob(file);

    this.metaData.title = metadata.common.title || this.metaData.title || file.name.replace(/\.[^/.]+$/, "");
    this.metaData.artist = metadata.common.artist || "";
    this.metaData.genre = metadata.common.genre?.[0] || "";
    this.metaData.album = metadata.common.album || "";
    this.metaData.year = metadata.common.year?.toString() || new Date().getFullYear().toString();

    if (metadata.common.picture && metadata.common.picture.length > 0) {
      const picture = metadata.common.picture[0];
      const blob = new Blob([picture.data], { type: picture.format });
      const imageUrl = URL.createObjectURL(blob);

      this.extractedImage = {
        data: picture.data,
        format: picture.format || 'image/jpeg',
        name: `${this.metaData.title || 'cover'}.${picture.format?.split('/')[1] || 'jpg'}`,
      };
    }
  } catch (error) {
    console.error("Metadata extraction error:", error);
    // fallback: extract from file name
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    const parts = fileName.split(" - ");
    if (parts.length >= 2) {
      this.metaData.artist = parts[0].trim();
      this.metaData.title = parts[1].trim();
    } else {
      this.metaData.title = fileName;
    }
    this.metaData.year = new Date().getFullYear().toString();
  }
}


//   private simulateImageExtraction(fileName: string) {
//   // Simulate that we found an embedded image
//   // In real implementation, this would be the actual extracted image data
//   const canvas = document.createElement("canvas")
//   canvas.width = 300
//   canvas.height = 300
//   const ctx = canvas.getContext("2d")

//   if (ctx) {
//     // Create a simple gradient as placeholder
//     const gradient = ctx.createLinearGradient(0, 0, 300, 300)
//     gradient.addColorStop(0, "#ff6b6b")
//     gradient.addColorStop(1, "#4ecdc4")
//     ctx.fillStyle = gradient
//     ctx.fillRect(0, 0, 300, 300)

//     // Add text
//     ctx.fillStyle = "white"
//     ctx.font = "20px Arial"
//     ctx.textAlign = "center"
//     ctx.fillText("Album Art", 150, 150)

//     // Convert to blob
//     canvas.toBlob(
//       (blob) => {
//         if (blob) {
//           blob.arrayBuffer().then((buffer) => {
//             this.extractedImage = {
//               data: buffer,
//               format: "jpeg",
//               name: `${fileName}_cover.jpg`,
//             }
//           })
//         }
//       },
//       "image/jpeg",
//       0.8,
//     )
//   }
// }

// Step navigation
nextStep() {
  if (this.currentStep < 3) {
    this.currentStep++
  }
}

previousStep() {
  if (this.currentStep > 1) {
    this.currentStep--
  }
}

goToStep(step: number) {
  this.currentStep = step
}

  // Upload methods
  async uploadFiles() {
  if (!this.audioFile) {
    this.error = "Please select an audio file"
    return
  }

  try {
    this.isLoading = true
    this.error = ""
    this.uploadProgress = { audio: 0, image: 0 }

    // Get upload URLs
    await this.getUploadUrls()

    // Upload audio file
    await this.uploadAudioFile()

    // Upload image file if selected
    if (this.imageFile) {
      await this.uploadImageFile()
    }

    this.nextStep()
  } catch (error) {
    console.error("Upload error:", error)
    this.error = "Error uploading files. Please try again."
  } finally {
    this.isLoading = false
  }
}

  async uploadFilesAndContinue() {
  if (!this.audioFile) {
    this.error = "Please select an audio file"
    return
  }

  try {
    this.isLoading = true
    this.error = ""
    this.uploadProgress = { audio: 0, image: 0 }

    // Get upload URLs
    await this.getUploadUrls()

    // Upload audio file
    await this.uploadAudioFile()

    // Upload extracted image if available
    if (this.extractedImage) {
      await this.uploadImageFile()
    }

    // Move to next step
    this.nextStep()
  } catch (error) {
    console.error("Upload error:", error)
    this.error = "Error uploading files. Please try again."
  } finally {
    this.isLoading = false
  }
}



  private async getUploadUrls() {
  if (!this.audioFile) return

  // Get audio upload URL
  this.audioUploadUrl = await this.songService.getUploadUrl(this.audioFile.name, this.audioFile.type).toPromise()

  // Get image upload URL if image is extracted
  if (this.extractedImage) {
    this.imageUploadUrl = await this.songService
      .getUploadUrl(this.extractedImage.name, `image/${this.extractedImage.format}`)
      .toPromise()
  }
}

  private uploadAudioFile(): Promise < void> {
  return new Promise((resolve, reject) => {
    if (!this.audioFile || !this.audioUploadUrl) {
      reject("No audio file or upload URL")
      return
    }

    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        this.uploadProgress.audio = Math.round((event.loaded * 100) / event.total)
      }
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve()
      } else {
        reject("Audio upload failed")
      }
    }

    xhr.onerror = () => reject("Audio upload error")

    xhr.open("PUT", this.audioUploadUrl.url)
    xhr.setRequestHeader("Content-Type", this.audioFile.type)
    xhr.send(this.audioFile)
  })
}


  private uploadImageFile(): Promise < void> {
  return new Promise((resolve, reject) => {
    if (!this.extractedImage || !this.imageUploadUrl) {
      reject("No image data or upload URL")
      return
    }

    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        this.uploadProgress.image = Math.round((event.loaded * 100) / event.total)
      }
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve()
      } else {
        reject("Image upload failed")
      }
    }

    xhr.onerror = () => reject("Image upload error")

    xhr.open("PUT", this.imageUploadUrl.url)
    xhr.setRequestHeader("Content-Type", `image/${this.extractedImage.format}`)
    xhr.send(this.extractedImage.data)
  })
}

  // Form submission
  async submitSong() {
  if (!this.audioFile) {
    this.error = "No audio file selected"
    return
  }

  if (!this.metaData.title || !this.metaData.artist) {
    this.error = "Title and artist are required"
    return
  }

  try {
    this.isLoading = true
    this.error = ""

    // Get the final URLs (remove query parameters)
    const audioUrl = this.audioUploadUrl?.url?.split("?")[0]
    const imageUrl = this.imageUploadUrl
      ? this.imageUploadUrl?.url.split("?")[0]
      : "https://yehuditmusic.s3.us-east-1.amazonaws.com/default-image.png"

    // Create song post model
    const songPostModel = new PublicSongPostModel(
      this.metaData.title,
      this.metaData.artist,
      this.metaData.genre || "Unknown Genre",
      Number.parseInt(this.metaData.year) || new Date().getFullYear(),
      this.metaData.album || "Unknown Album",
      "", // lyrics - empty for now
      audioUrl ? audioUrl : "https://yehuditmusic.s3.us-east-1.amazonaws.com/",
      imageUrl,
    )

    // Add song to server
    await this.songService.addPublicSong(songPostModel).toPromise()

    this.success = true
    this.nextStep()

    // Auto-redirect after success
    setTimeout(() => {
      this.router.navigate(["/songs"])
    }, 3000)
  } catch (error) {
    console.error("Submit error:", error)
    this.error = "Error adding song. Please try again."
  } finally {
    this.isLoading = false
  }
}

// Utility methods
formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " bytes"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  else return (bytes / 1048576).toFixed(1) + " MB"
}



resetForm() {
  this.audioFile = null
  this.extractedImage = null
  this.uploadProgress = { audio: 0, image: 0 }
  this.resetMetaData()
  this.currentStep = 1
  this.error = ""
  this.success = false
  this.audioUploadUrl = { url: "" }
  this.imageUploadUrl = { url: "" }
}

goToSongs() {
  this.router.navigate(["/songs"])
}
}
