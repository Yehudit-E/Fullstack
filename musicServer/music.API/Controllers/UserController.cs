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
    public class UserController : ControllerBase
    {
        readonly IUserService _iService;
        readonly IMapper _mapper;
        public UserController(IUserService iservice, IMapper mapper)
        {
            _iService = iservice;
            _mapper = mapper;
        }
        // GET: api/<UserController>
        [HttpGet]
        [Authorize(Policy="Admin")]
        public async Task<IEnumerable<UserDto>> Get()
        {
            return await _iService.GetAsync();
        }
        [HttpGet("full")]
        [Authorize(Policy = "Admin")]
        public async Task<IEnumerable<User>> GetFull()
        {
            return await _iService.GetFullAsync();
        }
        // GET api/<UserControllers>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> Get(int id)
        {
            UserDto userDto = await _iService.GetByIdAsync(id);
            if (userDto == null)
                return NotFound();
            return userDto;
        }
        [HttpGet("full/{id}")]
     
        public async Task<ActionResult<User>> GetFull(int id)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != id)
                return Forbid();
            User user = await _iService.GetFullByIdAsync(id);
            if (user == null)
                return NotFound();
            return Ok(user);
        }

        // POST api/<UserControllers>
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<UserDto>> Post([FromBody] UserPostModel userPostModel)
        {
            if (userPostModel == null)
                return BadRequest("User data is required.");
            var userDto = _mapper.Map<UserDto>(userPostModel);
            userDto.CreatedAt = DateTime.Now;
            var result = await _iService.AddAsync(userDto);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return StatusCode(result.StatusCode, result.ErrorMessage);
        }

        // PUT api/<UserControllers>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Put(int id, [FromBody] UserPostModel userPostModel)
        {
            if (userPostModel == null)
                return BadRequest("User data is required.");
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != id)
                return Forbid();
            UserDto userDto = _mapper.Map<UserDto>(userPostModel);
            userDto = await _iService.UpdateAsync(id, userDto);
            if (userDto == null)
                return NotFound();
            return Ok(userDto);
        }
        // DELETE api/<UserControllers>/5
        //[HttpDelete("{id}")]
        //[Authorize(Policy = "Admin")]
        //public async Task<ActionResult<bool>> Delete(int id)
        //{
        //    if (id == null)
        //        return BadRequest("User data is required.");
        //    return await _iService.DeleteAsync(id);
        //}
    }
}
