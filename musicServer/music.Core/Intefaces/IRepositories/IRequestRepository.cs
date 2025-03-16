using music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.Intefaces.IRepositories
{
    public interface IRequestRepository : IRepository<Request>
    {
        Task<IEnumerable<Request>> GetFullNotAnsweredAsync();
        Task<IEnumerable<Request>> GetFullAsync();
        Task<Request> UpdateStatusAsync(int id, bool IsApproved);

    }
}
