import { useRef, useState } from "react";
import * as mm from "music-metadata-browser";
import { Buffer } from "buffer";
import { SongPostModel } from "../models/Song";
import SongService from "../services/SongService";

interface UseSongUploaderProps {
  onUploadSuccess: (song: SongPostModel) => void;
  playlistId: number;
}

export function useSongUploader({ onUploadSuccess, playlistId }: UseSongUploaderProps) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
const [fullMetadata, setFullMetadata] = useState<any>(null);

  const [metaData, setMetaData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    year: new Date().getFullYear().toString(),
  });

  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const extractMetaData = async (file: File) => {
    try {
      const metadata = await mm.parseBlob(file);
      const title = metadata.common.title || file.name.replace(/\.[^/.]+$/, "");
      const artist = metadata.common.artist || metadata.common.albumartist || "Unknown Artist";
      const genre = metadata.common.genre?.[0] || "Unknown Genre";
      const album = metadata.common.album || "Unknown Album";
      const year = metadata.common.year?.toString() || new Date().getFullYear().toString();

      return { metadata, title, artist, genre, album, year };
    } catch (e) {
      console.error("Metadata error:", e);
      return {
        metadata: null,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Unknown Artist",
        genre: "Unknown Genre",
        album: "Unknown Album",
        year: new Date().getFullYear().toString(),
      };
    }
  };

  const uploadImage = async (imageData: Buffer, imageName: string, imageFormat: string): Promise<string | null> => {
    try {
      const uploadUrl = await SongService.getUploadUrl(imageName, `image/${imageFormat}`);
      const imageUrl = uploadUrl.split("?")[0];

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", `image/${imageFormat}`);

        xhr.onload = () => (xhr.status === 200 ? resolve(imageUrl) : reject(null));
        xhr.onerror = () => reject(null);
        xhr.send(imageData);
      });
    } catch (err) {
      console.error("Error uploading image:", err);
      return null;
    }
  };

  // פונקציה להעלאת קובץ - עדיין כאן אבל תשנה מעט: 
  // ההפרדה בין העלאת קובץ לבין אישור פרטי השיר תתבצע ע"י ה-step
  const uploadSongFile = async (file: File) => {
    setLoading(true);
    setProgress(0);
    setError("");

    try {
      const { metadata, title, artist, genre, album, year } = await extractMetaData(file);
setFullMetadata(metadata);
      setMetaData({ title, artist, genre, album, year });
      setStep(2); // עובר לשלב פרטי השיר

      // לא מבצע העלאה של השיר כאן אלא רק בשלב האישור
      setLoading(false);
    } catch (err) {
      setError("Metadata extraction failed.");
      setLoading(false);
    }
  };

  // פונקציה להעלאת השיר בסיום מילוי פרטים
  const submitSong = async () => {
    if (!file) {
      setError("No file selected.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // העלאת קובץ האודיו
      const uploadUrl = await SongService.getUploadUrl(file.name, file.type);
      const audioUrl = uploadUrl.split("?")[0];

      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded * 100) / event.total);
          setProgress(percentage);
        }
      };

      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.onload = async () => {
          if (xhr.status !== 200) {
            setError("Upload failed. Please try again.");
            setLoading(false);
            reject();
            return;
          }

          // העלאת עטיפת השיר במידת הצורך
          let imageUrl = "https://yehuditmusic.s3.us-east-1.amazonaws.com/default-image.png";
          if (fullMetadata?.common.picture?.length) {
            const image = fullMetadata.common.picture[0].data;
            const format = fullMetadata.common.picture[0].format || "jpeg";
            const imageName = `${file.name.replace(/\.[^/.]+$/, "")}_cover.${format.split("/")[1] || "jpg"}`;
            const uploadedImage = await uploadImage(image, imageName, format);
            if (uploadedImage) imageUrl = uploadedImage;
          }

          // יצירת האובייקט של השיר עם הנתונים מהמטה-דאטה שנשלט בטופס
          const song: SongPostModel = {
            name: metaData.title,
            artist: metaData.artist,
            genre: metaData.genre,
            year: Number(metaData.year),
            album: metaData.album,
            audioFilePath: audioUrl,
            imageFilePath: imageUrl,
            playlistId,
            lyrics: "",
          };

          await SongService.addSong(song);
          onUploadSuccess(song);
          setLoading(false);
          setSuccess(true);
          setStep(3);
          resolve();
        };

        xhr.onerror = () => {
          setError("Error uploading file. Please try again.");
          setLoading(false);
          reject();
        };

        xhr.send(file);
      });

      await uploadPromise;
    } catch (err) {
      setError("Upload error. Please try again.");
      setLoading(false);
    }
  };

  const cancelUpload = () => {
    if (xhrRef.current && loading) xhrRef.current.abort();
    setProgress(0);
    setLoading(false);
  };

  // שינוי ערך בטופס
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetaData((prev) => ({ ...prev, [name]: value }));
  };

  // טיפול בשינוי קובץ מה-uploader (input או drag & drop)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    uploadSongFile(selectedFile); // שולח לשלב הבא עם המטה-דאטה
  };

  // טיפול ב-drag & drop
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;
    setFile(droppedFile);
    uploadSongFile(droppedFile);
  };

  // השלמת התהליך: לחצן הוספה לפלייליסט (שלב 2)
  const handleSubmitSong = () => {
    submitSong();
  };

  return {
    step,
    setStep,
    file,
    setFile,
    progress,
    loading,
    error,
    success,
    metaData,
    setMetaData,
    cancelUpload,
    handleFileChange,
    handleFileDrop,
    handleInputChange,
    handleSubmitSong,
  };
}
