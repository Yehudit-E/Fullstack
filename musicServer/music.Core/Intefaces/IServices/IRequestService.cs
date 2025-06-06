﻿using music.Core.DTOs;
using music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.Intefaces.IServices
{
    public interface IRequestService
    {
        Task<IEnumerable<RequestDto>> GetAsync();
        Task<IEnumerable<Request>> GetFullAsync();
        Task<IEnumerable<Request>> GetFullNotAnsweredAsync();
        Task<RequestDto> GetByIdAsync(int id);
        Task<bool> AddAsync(RequestDto requestDto);
        Task<Request> UpdateStatusAsync(int id, bool IApproved);
        Task<bool> DeleteAsync(int id);
    }
}
