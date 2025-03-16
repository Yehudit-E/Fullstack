using music.Core.Intefaces.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Data.repositories
{
    public class RepositoryManager:IRepositoryManager
    {
        DataContext _dataContext;
        public IUserRepository _userRepository { get; set; }
        public ISongRepository _songRepository { get; set; }
        public IPlaylistRepository _playlistRepository { get; set; }
        public IRequestRepository _requestRepository { get; set; }
        
        public RepositoryManager(DataContext dataContext,IUserRepository userRepository,ISongRepository songRepository,
                                    IPlaylistRepository playlistRepository,IRequestRepository requestRepository)
        {
            _dataContext = dataContext;
            _userRepository = userRepository;
            _songRepository = songRepository;
            _playlistRepository = playlistRepository;
            _requestRepository = requestRepository;
        }
        public async Task SaveAsync()
        {
            await _dataContext.SaveChangesAsync();
        }
    }
}
