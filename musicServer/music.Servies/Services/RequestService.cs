using AutoMapper;
using music.Core.DTOs;
using music.Core.Entities;
using music.Core.Intefaces.IRepositories;
using music.Core.Intefaces.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Service.Services
{
    public class RequestService:IRequestService
    {
        private readonly IRepositoryManager _iManager;
        private readonly IMapper _mapper;
        public RequestService(IRepositoryManager iManager, IMapper mapper)
        {
            _iManager = iManager;
            _mapper = mapper;
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

        public async Task<RequestDto> AddAsync(RequestDto requestDto)
        {
            Request request = _mapper.Map<Request>(requestDto);
            request = await _iManager._requestRepository.AddAsync(request);
            if (request != null)
                await _iManager.SaveAsync();
            requestDto = _mapper.Map<RequestDto>(request);
            return requestDto;
        }
        public async Task<RequestDto> UpdateStatusAsync(int id, bool IsApproved)
        {
            var request = await _iManager._requestRepository.UpdateStatusAsync(id, IsApproved);
            if (request != null)
                await _iManager.SaveAsync();
            var requestDto = _mapper.Map<RequestDto>(request);
            return requestDto;
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
