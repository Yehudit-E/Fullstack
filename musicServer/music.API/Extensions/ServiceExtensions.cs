
using Microsoft.EntityFrameworkCore;
using music.Core.Intefaces.IRepositories;
//using music.Core.services;
using music.Core;
using music.Data.repositories;
using music.Data;
using music.Core.Intefaces.IServices;
using music.Service.Services;
using music.API;
using music.Core.Services;
using music.Service;

namespace music.Api.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddDependencyInjectoions(this IServiceCollection services)
        {

            services.AddAutoMapper(typeof(MappingProfile), typeof(MappingPostProfile));

            // Register repositories
            services.AddScoped<IRepositoryManager, RepositoryManager>();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ISongRepository, SongRepository>();
            services.AddScoped<IPlaylistRepository, PlaylistRepository>();
            services.AddScoped<IRequestRepository, RequestRepository>();


            // Register services
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ISongService, SongService>();
            services.AddScoped<IPlaylistService, PlaylistService>();
            services.AddScoped<IRequestService, RequestService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IS3Service, S3Service>();
        }


    }
}
