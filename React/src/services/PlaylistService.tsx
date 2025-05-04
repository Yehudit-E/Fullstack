import api from "../interceptor/api";
import {  PlaylistPostModel } from "../models/Playlist";

const API_URL = "/Playlist";

const PlaylistService = {
    // 1. קבלת פלייליסט מלא לפי מזהה
    getFullPlaylistById: async (id: number) => {
        try {
            const response = await api.get(`${API_URL}/full/${id}`);
            console.log(response.data);
            
            return response.data;
        } catch (error) {
            console.error("Error fetching full playlist by ID:", error);
            throw error;
        }
    },

    // 2. יצירת פלייליסט חדש
    createPlaylist: async (playlistData: PlaylistPostModel) => {
        try {
            const response = await api.post(API_URL, playlistData);
            return response.data;
        } catch (error) {
            console.error("Error creating playlist:", error);
            throw error;
        }
    },

    // 3. עדכון פלייליסט
    updatePlaylist: async (id: number, playlistData: PlaylistPostModel) => {
        try {
            const response = await api.put(`${API_URL}/${id}`, playlistData);
            return response.data;
        } catch (error) {
            console.error("Error updating playlist:", error);
            throw error;
        }
    },

    // 4. הוספת משתמש לפלייליסט
    addUserToPlaylist: async (id: number, userEmail: string) => {
        try {
            console.log(id,userEmail);
            
            const response = await api.put(`${API_URL}/${id}/user`, {email:userEmail});
            return response.data;
        } catch (error) {
            console.error("Error adding user to playlist:", error);
        }
    },

    // 5. מחיקת פלייליסט
    deletePlaylist: async (id: number) => {
        try {
            const response = await api.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting playlist:", error);
            throw error;
        }
    },

    // 6. הסרת שיר מפלייליסט
    removeSongFromPlaylist: async (playlistId: number, songId: number) => {
        try {
            const response = await api.delete(`${API_URL}/${playlistId}/song/${songId}`);
            return response.data;
        } catch (error) {
            console.error("Error removing song from playlist:", error);
            throw error;
        }
    },

    // 7. שליפת הפלייליסטים של המשתמש (פלייליסטים אישיים)
    getUserPlaylists: async (userId: number) => {
        try {
            const response = await api.get(`${API_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user playlists:", error);
            throw error;
        }
    },

    // 8. שליפת הפלייליסטים ששיתפו עם המשתמש
    getUserSharedPlaylists: async (userId: number) => {
        try {
            const response = await api.get(`${API_URL}/shared/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user shared playlists:", error);
            throw error;
        }
    },
    getUploadUrl: async (fileName:string, contentType:string) => {
        try {
            console.log("filename"+fileName);
            console.log("contentType"+contentType);
            
            const response = await api.get("/song/upload-url", {
                params: { fileName, contentType},
            });
            return response.data.url;
        } catch (error) {
            console.error("Error getting upload URL:", error);
            throw error;
        }
    },
};

export default PlaylistService;
