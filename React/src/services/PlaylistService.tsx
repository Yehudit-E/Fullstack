import api from "../interceptor/api";
import { PlaylistPostModel } from "../models/Playlist";

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
            console.log(response.data);
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

    // 6א. הסרת משתמש מפלייליסט
    removeUserFromPlaylist: async (playlistId: number, userId: number) => {
        try {
            const response = await api.delete(`${API_URL}/${playlistId}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error removing user from playlist:", error);
            throw error;
        }
    },

    // 7. שליפת הפלייליסטים של המשתמש (אישיים)
    getUserPlaylists: async (userId: number) => {
        try {
            const response = await api.get(`${API_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user playlists:", error);
            throw error;
        }
    },

    // 8. שליפת פלייליסטים ששיתפו איתו
    getUserSharedPlaylists: async (userId: number) => {
        try {
            const response = await api.get(`${API_URL}/shared/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user shared playlists:", error);
            throw error;
        }
    },

    // 9. קבלת URL להעלאת קובץ שיר ל-S3
    getUploadUrl: async (fileName: string, contentType: string) => {
        try {
            const response = await api.get("/song/upload-url", {
                params: { fileName, contentType },
            });
            return response.data.url;
        } catch (error) {
            console.error("Error getting upload URL:", error);
            throw error;
        }
    },

    // 🔹 10. שיתוף פלייליסט במייל
    sharePlaylist: async (playlistId: number, email: string) => {
        console.log(email);
        try {
            const response = await api.post(`${API_URL}/${playlistId}/share`, {
                email,
            });
            return response.data;
        } catch (error) {
            console.error("Error sharing playlist:", error);
            throw error;
        }
    },

    // 🔹 11. קבלת שיתוף לפי טוקן מהקישור
    acceptPlaylistShare: async (token: string) => {
        try {
            const response = await api.get(`${API_URL}/accept-share`, {
                params: { token },
            });
            return response.data;
        } catch (error) {
            console.error("Error accepting shared playlist:", error);
            throw error;
        }
    },
};

export default PlaylistService;