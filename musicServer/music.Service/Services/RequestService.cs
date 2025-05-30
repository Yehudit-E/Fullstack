using AutoMapper;
using music.Core.DTOs;
using music.Core.Entities;
using music.Core.Intefaces.IRepositories;
using music.Core.Intefaces.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace music.Service.Services
{
    public class RequestService : IRequestService
    {
        private readonly IRepositoryManager _iManager;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly ISongService _songService;
        private readonly IEmailService _emailService;


        public RequestService(IRepositoryManager iManager, IMapper mapper, IEmailService emailService, IUserService userService, ISongService songService)
        {
            _iManager = iManager;
            _mapper = mapper;
            _emailService = emailService;
            _userService = userService;
            _songService = songService;
        }
        public async Task<IEnumerable<RequestDto>> GetAsync()
        {
            IEnumerable<Request> requests = await _iManager._requestRepository.GetAsync();
            IEnumerable<RequestDto> requestsDtos = _mapper.Map<List<RequestDto>>(requests);
            return requestsDtos;
        }
        public async Task<IEnumerable<Request>> GetFullAsync()
        {
            return await _iManager._requestRepository.GetFullAsync();
        }

        public async Task<RequestDto>? GetByIdAsync(int id)
        {
            Request request = await _iManager._requestRepository.GetByIdAsync(id);
            RequestDto requestDto = _mapper.Map<RequestDto>(request);
            return requestDto;
        }

        public async Task<bool> AddAsync(RequestDto requestDto)
        {
            Song song = new Song()
            {
                AudioFilePath = requestDto.Song.SongAudioFilePath,
                ImageFilePath = requestDto.Song.SongAudioFilePath,
                Name = requestDto.Song.SongName,
                Artist = requestDto.Song.SongArtist,
                Genre = requestDto.Song.SongGenre,
                Album = requestDto.Song.SongAlbum,
                Year = requestDto.Song.SongYear,
                Lyrics = "",
                CreatedAt = DateTime.Now,
                CountOfPlays = 0,
                IsPublic = false,
                PlaylistId = 1,
            }; ;
            Request request = new Request()
            {
                UserId = requestDto.UserId,
                SongId = song.Id,
                Song = song
            };

            request = await _iManager._requestRepository.AddAsync(request);
            if (request == null)
                return false;
            await _iManager.SaveAsync();
            return true;
        }
        public async Task<Request> UpdateStatusAsync(int id, bool IsApproved)
        {
            var prevRequest = await GetByIdAsync(id);
            var user = await _userService.GetByIdAsync(prevRequest.UserId);
            var request = await _iManager._requestRepository.UpdateStatusAsync(id, IsApproved);
            if (request != null)
            {
                await _iManager.SaveAsync();
                EmailRequest emailRequest = new EmailRequest()
                {
                    To = user.Email,
                    Subject = "טיפול בבקשה",
                    Body = ""
                };
                _emailService.SendEmailAsync(emailRequest);
            }
            return request;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            bool flag = await _iManager._requestRepository.DeleteByIdAsync(id);
            if (flag)
                await _iManager.SaveAsync();
            return flag;
        }

        public async Task<IEnumerable<Request>> GetFullNotAnsweredAsync()
        {
            IEnumerable<Request> requests = await _iManager._requestRepository.GetFullNotAnsweredAsync();
            return requests;
        }


    }
}
