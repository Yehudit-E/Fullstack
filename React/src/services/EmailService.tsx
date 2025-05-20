import api from "../interceptor/api";
import { EmailRequest } from "../models/EmailRequest";

const API_URL = "/email";

const EmailService = {

  // שליחת אימייל
  sendEmail: async (request: EmailRequest) => {
    try {
      const response = await api.post(`${API_URL}/send`, request);
      return response.data;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },

};

export default EmailService;
