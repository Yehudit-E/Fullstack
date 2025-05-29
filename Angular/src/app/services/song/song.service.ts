import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from '../../Global';
import { Song, PublicSongPostModel, SongPostModel } from '../../models/Song';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private baseUrl = `${BASE_URL}/Song`;

  public songs = new BehaviorSubject<Song[]>([]);

  constructor(private http: HttpClient) {}

  getAllSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.baseUrl); // דורש הרשאת Admin
  }

  getPublicSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.baseUrl}/public`);
  }

  // getSongById(id: number): Observable<Song> {
  //   return this.http.get<Song>(`${this.baseUrl}/${id}`);
  // }

  addPublicSong(songPost: PublicSongPostModel): Observable<Song> {
    return this.http.post<Song>(this.baseUrl+"/public", songPost);
  }

  updateSong(id: number, songPost: PublicSongPostModel): Observable<Song> {
    console.log(`Updating song with ID: ${id}`, songPost);
    return this.http.put<Song>(`${this.baseUrl}/public/${id}`, songPost);
  }

  deleteSong(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  // incrementPlays(id: number): Observable<Song> {
  //   return this.http.put<Song>(`${this.baseUrl}/${id}/plays`, {});
  // }

  // addLyrics(id: number, lyrics: string): Observable<Song> {
  //   return this.http.put<Song>(`${this.baseUrl}/${id}/Lyrics`, lyrics, {
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // }

  getUploadUrl(fileName: string, contentType: string): Observable<{ url: string }> {
    const params = new HttpParams()
      .set('fileName', fileName)
      .set('contentType', contentType);
    return this.http.get<{ url: string }>(`${this.baseUrl}/upload-url`, { params });
  }

  // shareSongByEmail(id: number, email: string): Observable<boolean> {
  //   return this.http.post<boolean>(`${this.baseUrl}/${id}/share`, email, {
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // }

  // שימושי - למילוי מחדש של BehaviorSubject אחרי שינוי
  reloadPublicSongs() {
    this.getPublicSongs().subscribe({
      next: songs => this.songs.next(songs),
      error: err => alert('loading songs failed')
    });
  }
}
