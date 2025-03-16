using AutoMapper;
using music.Core.DTOs;
using music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace music.Core
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<Song, SongDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<Playlist, PlaylistDto>().ReverseMap();
            CreateMap<Request, RequestDto>().ReverseMap();
        }
    }
}
