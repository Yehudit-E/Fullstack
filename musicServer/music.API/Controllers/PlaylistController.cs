using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using music.API.PostModels;
using music.Core.DTOs;
using music.Core.Entities;
using music.Core.Intefaces.IServices;

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
            var playlist= await _iService.GetByIdAsync(id);
            if (tokenId != playlist.OwnerId)
                return Forbid();
            Playlist result = await _iService.GetFullByIdAsync(id);
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
        public async Task<ActionResult<Playlist>> Put(int id,  [FromBody] int userId)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            Playlist playlist = await _iService.GetFullByIdAsync(id); 
            if (tokenId != playlist.OwnerId)
                return Forbid();
            playlist = await _iService.AddUserAsync(playlist, userId);
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
        [HttpDelete("song/{songId}")]
        public async Task<ActionResult<bool>> RemoveSongFromPlaylistAsync(int songId,int playlistId)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            var playlist = await _iService.GetByIdAsync(playlistId);
            if (tokenId != playlist.OwnerId)
                return Forbid();
             return await _iService.RemoveSongFromPlaylistAsync(playlistId, songId);
        }

    }
}
