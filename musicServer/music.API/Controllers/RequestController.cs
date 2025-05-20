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
    public class requestController : ControllerBase
    {
        readonly IRequestService _iService;
        readonly IMapper _mapper;
        public requestController(IRequestService iservice, IMapper mapper)
        {
            _iService = iservice;
            _mapper = mapper;
        }
        // GET: api/<requestController>
        [HttpGet]
        [Authorize(Policy ="Admin")]
        public async Task<IEnumerable<RequestDto>> Get()
        {
            return await _iService.GetAsync();
        }
        [HttpGet("full")]
        [Authorize(Policy = "Admin")]
        public async Task<IEnumerable<Request>> GetFull()
        {
            return await _iService.GetFullAsync();
        }
        [HttpGet("not-answered")]
        [Authorize(Policy = "Admin")]
        public async Task<IEnumerable<Request>> GetFullNotAnswered()
        {
            return await _iService.GetFullNotAnsweredAsync();
        }
        // GET api/<requestControllers>/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<RequestDto>> Get(int id)
        //{
        //    RequestDto requestDto = await _iService.GetByIdAsync(id);
        //    if (requestDto == null)
        //        return NotFound();
        //    return requestDto;
        //}

        // POST api/<requestControllers>
        [HttpPost]
        public async Task<ActionResult<bool>> Post([FromBody] RequestDto requestDto)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != requestDto.UserId) 
                return Forbid();
            //RequestDto requestDto = _mapper.Map<RequestDto>(requestPostModel);
            bool res = await _iService.AddAsync(requestDto);
            return res;
        }

        // PUT api/<requestControllers>/5
        [HttpPut("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<RequestDto>> Put(int id, bool isApproved)
        {
            var requestDto = await _iService.UpdateStatusAsync(id, isApproved);
            if (requestDto == null)
                return NotFound();
            return Ok(requestDto);
        }

        // DELETE api/<requestControllers>/5
        //[HttpDelete("{id}")]
        //public async Task<ActionResult<bool>> Delete(int id)
        //{
        //    return await _iService.DeleteAsync(id);
        //}
    }
}
