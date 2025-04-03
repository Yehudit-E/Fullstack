import api from "../interceptor/api";
import { RequestPostModel } from "../models/Request";
const API_URL = "/request";

const RequestService = {
    // 1. קבלת כל הבקשות
    getRequests: async () => {
        try {
            const response = await api.get(`${API_URL}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching requests:", error);
            throw error;
        }
    },

    // 2. קבלת בקשות מלאות
    getFullRequests: async () => {
        try {
            const response = await api.get(`${API_URL}/full`);
            return response.data;
        } catch (error) {
            console.error("Error fetching full requests:", error);
            throw error;
        }
    },

    // 3. קבלת בקשות שלא נענו
    getNotAnsweredRequests: async () => {
        try {
            const response = await api.get(`${API_URL}/not-answered`);
            return response.data;
        } catch (error) {
            console.error("Error fetching not answered requests:", error);
            throw error;
        }
    },

    // 4. הוספת בקשה
    createRequest: async (requestPostModel: RequestPostModel) => {
        try {
            const response = await api.post(`${API_URL}`, requestPostModel);
            return response.data;
        } catch (error) {
            console.error("Error creating request:", error);
            throw error;
        }
    },

    // 5. עדכון בקשה
    updateRequestStatus: async (id: number, isApproved: boolean) => {
        try {
            const response = await api.put(`${API_URL}/${id}`, { isApproved });
            return response.data;
        } catch (error) {
            console.error("Error updating request status:", error);
            throw error;
        }
    }
};

export default RequestService;
