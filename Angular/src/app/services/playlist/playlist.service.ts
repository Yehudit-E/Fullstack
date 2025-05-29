import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from '../../Global';
import { Playlist, PlaylistPostModel } from '../../models/Playlist';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private baseUrl = `${BASE_URL}/Playlist`;

  public playlists = new BehaviorSubject<Playlist[]>([]);
  public sharedPlaylists = new BehaviorSubject<Playlist[]>([]);

  constructor(private http: HttpClient) { }
  
  getAllPlaylistsFull(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.baseUrl}/full`);
  }

  getUserPlaylists(userId: number): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.baseUrl}/user/${userId}`);
  }

  getUserSharedPlaylists(userId: number): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.baseUrl}/shared/${userId}`);
  }

  getPlaylistFull(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.baseUrl}/full/${id}`);
  }

  createPlaylist(playlist: PlaylistPostModel): Observable<Playlist> {
    return this.http.post<Playlist>(this.baseUrl, playlist);
  }

  updatePlaylist(id: number, playlist: PlaylistPostModel): Observable<Playlist> {
    return this.http.put<Playlist>(`${this.baseUrl}/${id}`, playlist);
  }


  deletePlaylist(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }

  removeSongFromPlaylist(playlistId: number, songId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${playlistId}/song/${songId}`);
  }

  removeUserFromPlaylist(playlistId: number, userId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${playlistId}/user/${userId}`);
  }



  // שימושי למילוי מחדש של הפלייליסטים של המשתמש
  reloadUserPlaylists(userId: number) {
    this.getUserPlaylists(userId).subscribe({
      next: playlists => this.playlists.next(playlists),
      error: err => alert('Loading playlists failed')
    });
  }

  reloadSharedPlaylists(userId: number) {
    this.getUserSharedPlaylists(userId).subscribe({
      next: playlists => this.sharedPlaylists.next(playlists),
      error: err => alert('Loading shared playlists failed')
    });
  }
}
