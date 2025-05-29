using AutoMapper;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.SqlServer.Server;
using music.API.PostModels;
using music.Core.DTOs;
using music.Core.Entities;
using music.Core.Services;
using music.Core.Shared;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace music.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService, IMapper mapper) : ControllerBase
    {
        private readonly IAuthService _authService = authService;
        private readonly IMapper _mapper = mapper;

        [HttpPost("login")]
        public ActionResult<LoginResponseDto> Login([FromBody] LoginModel model)
        {
            Console.WriteLine("------------------------------------------");
            Console.WriteLine(model);
            var result =  _authService.Login(model.Email, model.Password);
            if (!result.IsSuccess)
            {
                return StatusCode(result.StatusCode,result.ErrorMessage);
            }
            return Ok(result.Data); 
        }

        [HttpPost("register")]
        public async Task<ActionResult<LoginResponseDto>> Register([FromBody] UserPostModel user)
        {
            Console.WriteLine(user);
            if (user == null)
                return BadRequest("User data is required.");
            var userDto = _mapper.Map<UserDto>(user);
            userDto.CreatedAt = DateTime.Now;
            var result = await _authService.Register(userDto);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return StatusCode(result.StatusCode, result.ErrorMessage);
        }
        [HttpPost("google")]
        public async Task<IActionResult> GoogleSignIn([FromBody] GoogleSignInRequest request)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest(new { message = "Google token is required." });
            }

            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID") ?? "YOUR_GOOGLE_CLIENT_ID" }
                });

                //var existingUser = await _._userRepository.GetByEmailAsync(payload.Email);
                //string profilePictureUrlS3 = null;
                //if (existingUser == null && !string.IsNullOrEmpty(payload.Picture))
                //{
                //    using (var httpClient = new HttpClient())
                //    {
                //        try
                //        {
                //            var response = await httpClient.GetAsync(payload.Picture);
                //            response.EnsureSuccessStatusCode();
                //            string contentType = response.Content.Headers.ContentType?.ToString();

                //            using (var imageStream = await response.Content.ReadAsStreamAsync())
                //            {
                //                var fileName = $"{payload.Subject}_{DateTime.UtcNow.Ticks}.jpg";
                //                profilePictureUrlS3 = await _s3Service.UploadFileAsync(imageStream, fileName, contentType);

                //            }
                //        }
                //        catch (HttpRequestException ex)
                //        {
                //            //Console.WriteLine($"Error downloading Google profile picture: {ex.Message}. Status Code: {ex.StatusCode}");
                //            // המשך כרגיל בלי תמונת פרופיל S3
                //        }
                //        catch (Exception ex)
                //        {
                //            //Console.WriteLine($"General error during download of Google profile picture: {ex.Message}");
                //            // המשך כרגיל בלי תמונת פרופיל S3
                //        }
                //    }
                //}
                //else
                //{
                //    Console.WriteLine("Google payload does not contain a picture URL.");
                //}

                var user = await _authService.GetOrCreateUserAsync(payload.Email, payload.GivenName+" "+payload.FamilyName);
                var jwtToken = _authService.GenerateJwtToken(user);

                return Ok(new { user, token = jwtToken });
            }
            catch (InvalidJwtException ex)
            {
                return Unauthorized(new { message = "Invalid Google token", error = ex.Message });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = "Google Sign-In failed", error = ex.Message });
            }
        }

    }
    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
    public class GoogleSignInRequest
    {
        public string Token { get; set; }
    }
}
