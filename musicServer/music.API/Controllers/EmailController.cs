using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using music.Core.Entities;
using music.Core.Intefaces.IServices;

namespace music.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController(IEmailService emailService, IUserService userService) : ControllerBase
    {
        private readonly IEmailService _emailService = emailService;
        private readonly IUserService _userService = userService;

        [HttpPost("contact")]
        public async Task<IActionResult> SendEmail([FromBody] ContactEmailRequest request)
        {
            EmailRequest emailRequest = new EmailRequest()
            {
                To= "musix.app.team@gmail.com",
                Subject= $"New message from {request.Name}",
                Body= "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"UTF-8\" />\r\n    <style>\r\n      body {\r\n        font-family: Arial, sans-serif;\r\n        background-color: #f9f9f9;\r\n        padding: 20px;\r\n        color: #333;\r\n      }\r\n      .container {\r\n        background-color: #fff;\r\n        border-radius: 8px;\r\n        padding: 20px;\r\n        border: 1px solid #ddd;\r\n        max-width: 600px;\r\n        margin: auto;\r\n      }\r\n      h2 {\r\n        color: #444;\r\n        margin-bottom: 20px;\r\n      }\r\n      .row {\r\n        margin-bottom: 10px;\r\n      }\r\n      .label {\r\n        font-weight: bold;\r\n        color: #555;\r\n      }\r\n      .value {\r\n        margin-left: 10px;\r\n        white-space: pre-line;\r\n      }\r\n    </style>\r\n  </head>\r\n  <body>\r\n    <div class=\"container\">\r\n      <h2>New Contact Form Submission</h2>\r\n      <div class=\"row\">\r\n        <span class=\"label\">Name:</span>\r\n        <span class=\"value\">"+request.Name+"</span>\r\n      </div>\r\n      <div class=\"row\">\r\n        <span class=\"label\">Email:</span>\r\n        <span class=\"value\">"+request.EmailAdress+"</span>\r\n      </div>\r\n      <div class=\"row\">\r\n        <span class=\"label\">Subject:</span>\r\n        <span class=\"value\">"+request.Subject+"</span>\r\n      </div>\r\n      <div class=\"row\">\r\n        <span class=\"label\">Message:</span>\r\n        <span class=\"value\">"+request.Message+"</span>\r\n      </div>\r\n    </div>\r\n  </body>\r\n</html>`"
            };
            await _emailService.SendEmailAsync(emailRequest);
            return Ok();
        }
        public class ContactEmailRequest
        {
            public string Name { get; set; }
            public string EmailAdress { get; set; }
            public string Subject { get; set; }
            public string Message { get; set; }

        }
    }
}
