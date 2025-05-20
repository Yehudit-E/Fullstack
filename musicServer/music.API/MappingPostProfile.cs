using AutoMapper;
using music.API.PostModels;
using music.Core.DTOs;

namespace music.API
{
    public class MappingPostProfile:Profile
    {
        public MappingPostProfile()
        {
            CreateMap<SongPostModel, SongDto>();
            CreateMap<UserPostModel, UserDto>();
            CreateMap<PlaylistPostModel, PlaylistDto>();
        }
    }
}
