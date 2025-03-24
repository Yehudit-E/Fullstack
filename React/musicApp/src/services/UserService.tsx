import api from "../interceptor/api";
import { UserDto } from "../models/User";

const API_URL = "/User";

const UserService = {
   
    // 3. קבלת משתמש לפי מזהה
    getUserById: async (id:number) => {
        try {
            const response = await api.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw error;
        }
    },

    // 4. קבלת משתמש מלא לפי מזהה
    getFullUserById: async (id:number) => {
        try {
            const response = await api.get(`${API_URL}/full/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching full user by ID:", error);
            throw error;
        }
    },


    // 6. עדכון משתמש
    updateUser: async (id:number, userData:UserDto) => {
        try {
            const response = await api.put(`${API_URL}/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },
};

export default UserService;