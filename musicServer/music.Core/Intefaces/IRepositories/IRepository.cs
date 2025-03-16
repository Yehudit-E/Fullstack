using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.Intefaces.IRepositories
{
    public interface IRepository<T>
    {
        Task<IEnumerable<T>> GetAsync();
        Task<T>? GetByIdAsync(int id);
        Task<T> AddAsync(T item);
        Task<T> UpdateAsync(int id, T item);
        Task<bool> DeleteByIdAsync(int id);
    }
}
