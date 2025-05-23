import api from "../interceptor/api";
import { Request } from "../models/Request";
const API_URL = "/request";

const RequestService = {

    //  הוספת בקשה
    createRequest: async (request: Request) => {
        try {
            console.log(request);          
            const response = await api.post(`${API_URL}`, request);
            return response.data;
        } catch (error) {
            console.error("Error creating request:", error);
            throw error;
        }
    },

};

export default RequestService;
