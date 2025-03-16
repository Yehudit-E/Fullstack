using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
 

namespace music.Core.Intefaces.IRepositories
{
    public interface IRepositoryManager
    {
        IUserRepository _userRepository { get; set; }
        ISongRepository _songRepository { get; set; }
        IPlaylistRepository _playlistRepository { get; set; }
        IRequestRepository _requestRepository { get; set; }

        Task SaveAsync();


    }
}
