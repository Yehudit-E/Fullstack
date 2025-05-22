using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using music.API.PostModels;
using music.Core;
using music.Core.DTOs;
using music.Core.Entities;
using music.Core.Intefaces.IServices;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace music.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PlaylistController : ControllerBase
    {
        readonly IPlaylistService _iService;
        readonly IMapper _mapper;
        public PlaylistController(IPlaylistService iservice, IMapper mapper)
        {
            _iService = iservice;
            _mapper = mapper;
        }
        //// GET: api/<PlaylistController>
        //[HttpGet]
        //public async Task<IEnumerable<PlaylistDto>> Get()
        //{
        //    return await _iService.GetAsync();
        //}
        //[HttpGet("full")]
        //public async Task<IEnumerable<Playlist>> GetFull()
        //{
        //    return await _iService.GetFullAsync();
        //}

        //// GET api/<PlaylistControllers>/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<PlaylistDto>> Get(int id)
        //{
        //    PlaylistDto playlistDto = await _iService.GetByIdAsync(id);
        //    if (playlistDto == null)
        //        return NotFound();
        //    return playlistDto;
        //}
        [HttpGet("full/{id}")]
        public async Task<ActionResult<Playlist>> GetFull(int id)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            var playlist = await _iService.GetFullByIdAsync(id);
            if (tokenId != playlist.OwnerId && !playlist.SharedUsers.Any(x => x.Id == tokenId))
                return Forbid();
            Playlist result = await _iService.GetFullByIdAsync(id);
            if (result == null)
                return NotFound();
            return result;
        }
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<Playlist>>> GetUserPlaylists(int userId)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != userId)
                return Forbid();
            List<Playlist> result = await _iService.GetUserPlaylistsAsync(userId);
            if (result == null)
                return NotFound();
            return result;
        }

        // 2. שליפת הפלייליסטים ששיתפו עם המשתמש
        [HttpGet("shared/{userId}")]
        public async Task<ActionResult<List<Playlist>>> GetUserSharedPlaylists(int userId)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != userId)
                return Forbid();
            List<Playlist> result = await _iService.GetUserSharedPlaylistsAsync(userId);
            if (result == null)
                return NotFound();
            return result;
        }

        // POST api/<PlaylistControllers>
        [HttpPost]
        public async Task<ActionResult<PlaylistDto>> Post([FromBody] PlaylistPostModel playlistPostModel)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != playlistPostModel.OwnerId)
                return Forbid();
            PlaylistDto playlistDto = _mapper.Map<PlaylistDto>(playlistPostModel);
            playlistDto.CreatedAt = DateTime.Now;
            playlistDto = await _iService.AddAsync(playlistDto);
            if (playlistDto == null)
                return NotFound();
            return playlistDto;
        }

        // PUT api/<PlaylistControllers>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<PlaylistDto>> Put(int id, [FromBody] PlaylistPostModel playlistPostModel)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != playlistPostModel.OwnerId)
                return Forbid();
            PlaylistDto playlistDto = _mapper.Map<PlaylistDto>(playlistPostModel);
            playlistDto = await _iService.UpdateAsync(id, playlistDto);
            if (playlistDto == null)
                return NotFound();
            return playlistDto;
        }
        // PUT api/<PlaylistControllers>/5
        [HttpPut("{id}/user")]
        public async Task<ActionResult<Playlist>> Put(int id, [FromBody] EmailType userEmail)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            Playlist playlist = await _iService.GetFullByIdAsync(id);
            if (tokenId != playlist.OwnerId)
                return Forbid();
            playlist = await _iService.AddUserAsync(playlist, userEmail.Email);
            if (playlist == null)
                return NotFound();
            return playlist;
        }

        // DELETE api/<PlaylistControllers>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            var playlist = await _iService.GetByIdAsync(id);
            if (tokenId != playlist.OwnerId)
                return Forbid();
            return await _iService.DeleteAsync(id);
        }
        //Task<bool> RemoveSongFromPlaylistAsync(int playlistId, int songId)
        [HttpDelete("{playlistId}/song/{songId}")]
        public async Task<ActionResult<bool>> RemoveSongFromPlaylistAsync(int playlistId, int songId)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            var playlist = await _iService.GetByIdAsync(playlistId);
            if (tokenId != playlist.OwnerId)
                return Forbid();
            return await _iService.RemoveSongFromPlaylistAsync(playlistId, songId);
        }
        //[HttpDelete("{playlistId}/user/{userId}")]
        //public async Task<ActionResult<bool>> RemoveUserFromPlaylistAsync(int playlistId, int userId)
        //{
        //    var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
        //    var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
        //    var playlist = await _iService.GetByIdAsync(playlistId);
        //    if (tokenId != playlist.OwnerId &&tokenId!=userId)
        //        return Forbid();
        //    return await _iService.RemoveUserFromPlaylistAsync(playlistId, userId);
        //}
        [HttpPost("{playlistId}/share")]
        public async Task<ActionResult<bool>> SharePlaylist(int playlistId, [FromBody] EmailType emailRequest)
        {
            var tokenId = int.Parse(User.Claims.First(claim => claim.Type == "id").Value);
            var playlist = await _iService.GetByIdAsync(playlistId);
            if (playlist == null || playlist.OwnerId != tokenId)
                return Forbid();

            var success = await _iService.SharePlaylistAsync(playlist, emailRequest.Email);
            if (!success)
                return BadRequest();
            return Ok();
        }

        [HttpGet("accept-share")]
        public async Task<ActionResult<bool>> AcceptShare([FromQuery] string token)
        {
            var parsed = PlaylistTokenHelper.ParseToken(token);
            if (parsed == null)
                return Forbid();

            var (playlistId, email, signature) = parsed.Value;
            var secret = Environment.GetEnvironmentVariable("SECRET");

            if (!PlaylistTokenHelper.IsValidSignature(playlistId, email, signature, secret))
                return Forbid();

            var userId = int.Parse(User.Claims.First(claim => claim.Type == "id").Value);
            var playlist = await _iService.GetFullByIdAsync(playlistId);
            if (userId != playlist.OwnerId && userId != userId) // נראה כמו טעות לוגית כאן, כנראה התכוונת לבדוק שלא הוזמנת
                return Forbid();

            playlist = await _iService.AddUserAsync(playlist, email);
            if (playlist == null)
                return NotFound();

            return Ok();
        }
    }
    public class EmailType
    {
        public string Email { get; set; }
    }
}
