import api from "../interceptor/api";
import { ContactEmailRequest } from "../models/ContactEmailRequest";

const API_URL = "/email";

const EmailService = {

  // שליחת אימייל
  sendContactEmail: async (request: ContactEmailRequest) => {
    try {
      const response = await api.post(`${API_URL}/contact`, request);
      return response.data;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },

};

export default EmailService;
