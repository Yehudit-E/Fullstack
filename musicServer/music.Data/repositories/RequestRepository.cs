using Microsoft.EntityFrameworkCore;
using music.Core.Entities;
using music.Core.Intefaces.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace music.Data.repositories
{
    public class RequestRepository : Repository<Request>, IRequestRepository
    {
        public RequestRepository(DataContext dataContex) : base(dataContex)
        {
        }


        public async Task<IEnumerable<Request>> GetFullNotAnsweredAsync()
        {
            return await _dataSet.AsSplitQuery().Where(x => x.IsApproved == false).Include(x => x.User).ToListAsync();
        }

        public async Task<IEnumerable<Request>> GetFullAsync()
        {
            return await _dataSet.AsSplitQuery().Include(x => x.Song).Include(x => x.User).ToListAsync();
        }

        public async Task<Request> UpdateStatusAsync(int id, bool IsApproved)
        {
            var request = await _dataSet.Include(x => x.Song).FirstOrDefaultAsync(x => x.Id == id);
            if (request == null)
                return null;
            request.IsAnswered = true;
            request.IsApproved = IsApproved;
            if (IsApproved)
                request.Song.IsPublic = true;
            return request;
        }
    }
}
