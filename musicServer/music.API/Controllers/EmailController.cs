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

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {    
            await _emailService.SendEmailAsync(request);
            return Ok();
        }
    }
}
