using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using music.API.PostModels;
using music.Core.DTOs;
using music.Core.Entities;
using music.Core.Intefaces.IServices;
using music.Service.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace music.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SongController : ControllerBase
    {
        private readonly ISongService _iService;
        private readonly IMapper _mapper;
        private readonly IS3Service _s3Service;
        private readonly IEmailService _emailService;
        private readonly IUserService _userService;

        public SongController(ISongService iservice, IMapper mapper, IS3Service s3Service, IEmailService emailService,IUserService userService)
        {
            _iService = iservice;
            _mapper = mapper;
            _s3Service = s3Service;
            _emailService = emailService;
            _userService = userService;
        }
        // GET: api/<SongController>
        [HttpGet]
        [Authorize(Policy = "Admin")]
        public async Task<IEnumerable<SongDto>> Get()
        {
            return await _iService.GetAsync();
        }

        [HttpGet("public")]
        [AllowAnonymous]
        public async Task<IEnumerable<SongDto>> GetPublic()
        {
            return await _iService.GetPublicAsync();
        }

        // GET api/<SongControllers>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SongDto>> Get(int id)
        {
            SongDto songDto = await _iService.GetByIdAsync(id);
            if (songDto == null)
                return NotFound();
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            bool flag = await _iService.IsOwnerOfPlaylist(songDto.playlistId, tokenId);
            if (!flag && songDto.IsPublic == false)
                return Forbid();
            return songDto;
        }

        // POST api/<SongControllers>
        [HttpPost]
        public async Task<ActionResult<SongDto>> Post([FromBody] SongPostModel songPostModel)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            bool flag = await _iService.IsOwnerOfPlaylist(songPostModel.playlistId, tokenId);
            if (!flag)
                return Forbid();
            SongDto songDto = _mapper.Map<SongDto>(songPostModel);
            songDto.CreatedAt = DateTime.Now;
            songDto = await _iService.AddAsync(songDto);
            if (songDto == null)
                return NotFound();
            return songDto;
        }
        [HttpPost("public")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<SongDto>> Post([FromBody] PublicSongPostModel songPostModel)
        {
            SongDto songDto = _mapper.Map<SongDto>(songPostModel);
            songDto.CreatedAt = DateTime.Now;
            songDto.IsPublic = true;
            songDto.playlistId = 1;
            songDto = await _iService.AddAsync(songDto);
            if (songDto == null)
                return NotFound();
            return songDto;
        }
        // PUT api/<SongControllers>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<SongDto>> Put(int id, [FromBody] SongPostModel songPostModel)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            bool flag = await _iService.IsOwnerOfSong(id, tokenId);
            if (!flag)
                return Forbid();
            flag = await _iService.IsOwnerOfPlaylist(songPostModel.playlistId, tokenId);
            if (!flag)
                return Forbid();
            SongDto prevSongDto = await _iService.GetByIdAsync(id);
            SongDto songDto = _mapper.Map<SongDto>(songPostModel);
            songDto.CountOfPlays = prevSongDto.CountOfPlays;
            songDto.IsPublic = prevSongDto.IsPublic;
            // songDto.CreatedAt = DateTime.Now;
            songDto = await _iService.UpdateAsync(id, songDto);
            if (songDto == null)
                return NotFound();
            return songDto;
        }
        [HttpPut("public/{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<SongDto>> Put(int id, [FromBody] PublicSongPostModel songPostModel)
        {
            SongDto prevSongDto = await _iService.GetByIdAsync(id);
            SongDto songDto = _mapper.Map<SongDto>(songPostModel);
            songDto.CountOfPlays = prevSongDto.CountOfPlays;
            songDto.IsPublic = prevSongDto.IsPublic;
            songDto.playlistId = 1;
            // songDto.CreatedAt = DateTime.Now;
            songDto = await _iService.UpdateAsync(id, songDto);
            if (songDto == null)
                return NotFound();
            return songDto;
        }
        [HttpPut("{id}/plays")]
        public async Task<ActionResult<SongDto>> Put(int id)
        {
            var songDto = await _iService.UpdatePlaysAsync(id);
            if (songDto == null)
                return NotFound();
            return songDto;
        }
        [HttpPut("{id}/Lyrics")]
        [AllowAnonymous]
        public async Task<ActionResult<SongDto>> AddLyrics(int id, [FromBody] string lyrics)
        {
            var song = await _iService.GetByIdAsync(id);
            if (song == null)
                return NotFound();
            SongDto songDto = await _iService.AddLyricsAsync(id, lyrics);
            if (songDto == null)
                return NotFound();
            return songDto;
        }
        // DELETE api/<SongControllers>/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            return await _iService.DeleteAsync(id);
        }

        //// ⬆️ שלב 1: קבלת URL להעלאת קובץ ל-S3
        [HttpGet("upload-url")]
        [Authorize]
        public async Task<IActionResult> GetUploadUrl([FromQuery] string fileName, [FromQuery] string contentType)
        {
            if (string.IsNullOrEmpty(fileName))
                return BadRequest("Missing file name");
            var url = await _s3Service.GeneratePresignedUrlAsync(
                fileName, contentType);
            return Ok(new { url });
        }

        //// ⬆️ שלב 1: קבלת URL להעלאת קובץ ל-S3
        //[HttpGet("upload-image-url")]
        //[Authorize]
        //public async Task<IActionResult> GetUploadImageUrl([FromQuery] string fileName, [FromQuery] string contentType)
        //{
        //    if (string.IsNullOrEmpty(fileName))
        //        return BadRequest("Missing file name");
        //    var url = await _s3Service.GeneratePresignedUrlAsync(
        //        "" + fileName, contentType);
        //    return Ok(new { url });
        //}
        [HttpPost("{id}/share")]
        public async Task<ActionResult<bool>> ShareSongByEmail(int id, [FromBody] string email)
        {
            var song = await _iService.GetByIdAsync(id);
            if (song == null)
                return NotFound();

            var userId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            bool hasPermission = song.IsPublic || await _iService.IsOwnerOfPlaylist(song.playlistId, userId);
            if (!hasPermission)
                return Forbid();
            var user = await _userService.GetByIdAsync(userId);
            var emailRequest = new EmailRequest
            {
                To = email,
                Subject = "A song has been shared with you from MusiX 🎵",
                Body = $@"<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Song Shared With You</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }}
        .email-container {{
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }}
        .email-header {{
            background-color: #f5f5f5;
            padding: 20px 30px;
            text-align: center;
            border-bottom: 1px solid #eaeaea;
        }}
        .logo {{
            max-width: 120px;
            margin-bottom: 10px;
        }}
        .email-content {{
            padding: 30px;
            text-align: center;
        }}
        .playlist-icon {{
            width: 60px;
            height: 60px;
            margin: 0 auto 20px;
            background-color: #f0f0f0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }}
        h1 {{
            color: #333;
            font-size: 22px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 20px;
        }}
        p {{
            color: #555;
            font-size: 16px;
            margin-bottom: 25px;
        }}
        .song-name {{
            font-weight: 600;
            color: #333;
        }}
        .button {{
            display: inline-block;
            background-color: #4a90e2;
            color: white !important;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 4px;
            font-weight: 500;
            margin-bottom: 25px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }}
        .note {{
            font-size: 14px;
            color: #888;
            margin-top: 30px;
            font-style: italic;
        }}
        .email-footer {{
            background-color: #f5f5f5;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #888;
            border-top: 1px solid #eaeaea;
        }}
        @media only screen and (max-width: 600px) {{
            .email-container {{
                width: 100%;
                border-radius: 0;
            }}
            .email-content {{
                padding: 20px;
            }}
        }}
    </style>
</head>
<body>
    <div class=""email-container"">
        <div class=""email-header"">
            <svg class=""logo"" width=""120"" height=""30"" viewBox=""0 0 120 30"" fill=""none"" xmlns=""http://www.w3.org/2000/svg"">
                <rect width=""30"" height=""30"" rx=""6"" fill=""#4a90e2""/>
                <path d=""M15 7.5v15M7.5 15h15"" stroke=""white"" stroke-width=""2"" stroke-linecap=""round""/>
                <text x=""40"" y=""20"" font-family=""Arial"" font-size=""16"" font-weight=""bold"" fill=""#333"">MusiX</text>
            </svg>
        </div>

        <div class=""email-content"">
            <div class=""playlist-icon"">
                <svg width=""30"" height=""30"" viewBox=""0 0 24 24"" fill=""none"" xmlns=""http://www.w3.org/2000/svg"">
                    <path d=""M9 18V5l12-2v13"" stroke=""#4a90e2"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""/>
                    <circle cx=""6"" cy=""18"" r=""3"" stroke=""#4a90e2"" stroke-width=""2""/>
                    <circle cx=""18"" cy=""16"" r=""3"" stroke=""#4a90e2"" stroke-width=""2""/>
                </svg>
            </div>

            <h1>A Song Was Shared With You</h1>

            <p><strong>{HttpContext.User.Identity?.Name} {user.Email}</strong> has shared a song with you via MusiX 🎶</p>

            <p>Song name: <span class=""song-name"">{song.Name}</span></p>

            <a href=""{song.AudioFilePath}"" class=""button"">Listen Now</a>

            <p class=""note"">If you're not interested, you can safely ignore this email.</p>
        </div>

        <div class=""email-footer"">
            &copy; 2025 MusiX. All rights reserved.
        </div>
    </div>
</body>
</html>"
            };

            bool sent = await _emailService.SendEmailAsync(emailRequest);
            if (!sent)
                return StatusCode(500);

            return Ok();
        }

    }

}
