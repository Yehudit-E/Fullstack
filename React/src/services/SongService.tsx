import api from "../interceptor/api";
import { SongDto, SongPostModel } from "../models/Song";

const SongService = {


    // 2. קבלת שירים ציבוריים
    getPublicSongs: async () => {
        try {
            const response = await api.get("/song/public");
            return response.data;
        } catch (error) {
            console.error("Error fetching public songs:", error);
            throw error;
        }
    },

    // 3. קבלת שיר לפי מזהה
    getSongById: async (id: number) => {
        try {
            const response = await api.get(`/song/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching song by ID:", error);
            throw error;
        }
    },

    // 4. הוספת שיר
    addSong: async (songPostModel:SongPostModel) => {
        try {
            const response = await api.post("/song", songPostModel);
            return response.data;
        } catch (error) {
            console.error("Error adding song:", error);
            throw error;
        }
    },

    // 5. עדכון שיר
    updateSong: async (id:number, songPostModel:SongDto) => {
        try {
            const response = await api.put(`/song/${id}`, songPostModel);
            return response.data;
        } catch (error) {
            console.error("Error updating song:", error);
            throw error;
        }
    },

    // 6. עדכון "לייק" לשיר
    likeSong: async (id:number) => {
        try {
            const response = await api.put(`/song/${id}/like`);
            return response.data;
        } catch (error) {
            console.error("Error liking song:", error);
            throw error;
        }
    },

    // 7. קבלת URL להעלאת קובץ ל-S3
    getUploadUrl: async (fileName:string, contentType:string) => {
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
};

export default SongService;
