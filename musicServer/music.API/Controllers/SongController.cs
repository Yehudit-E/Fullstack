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
        public SongController(ISongService iservice, IMapper mapper, IS3Service s3Service)
        {
            _iService = iservice;
            _mapper = mapper;
            _s3Service = s3Service;
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
            if (!flag)
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
            SongDto songDto = _mapper.Map<SongDto>(songPostModel);
            songDto.CreatedAt = DateTime.Now;
            songDto = await _iService.UpdateAsync(id, songDto);
            if (songDto == null)
                return NotFound();
            return songDto;
        }
        [HttpPut("{id}/like")]
        public async Task<ActionResult<SongDto>> Put(int id)
        {
            var songDto = await _iService.UpdateLikesAsync(id);
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
        //[HttpDelete("{id}")]
        //[Authorize(Policy = "Admin")]
        //public async Task<ActionResult<bool>> Delete(int id)
        //{
        //    return await _iService.DeleteAsync(id);
        //}

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
    }

}
