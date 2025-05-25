using AutoMapper;
using music.Core;
using music.Core.DTOs;
using music.Core.Entities;
using music.Core.Intefaces.IRepositories;
using music.Core.Intefaces.IServices;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace music.Service.Services
{
    public class PlaylistService : IPlaylistService
    {
        private readonly IRepositoryManager _iManager;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        public PlaylistService(IRepositoryManager iManager, IMapper mapper, IEmailService emailService)
        {
            _iManager = iManager;
            _mapper = mapper;
            _emailService = emailService;
        }
        public async Task<IEnumerable<PlaylistDto>> GetAsync()
        {
            IEnumerable<Playlist> playlists = await _iManager._playlistRepository.GetAsync();
            IEnumerable<PlaylistDto> playlistDto = _mapper.Map<List<PlaylistDto>>(playlists);
            return playlistDto;
        }
        public async Task<IEnumerable<Playlist>> GetFullAsync()
        {
            return await _iManager._playlistRepository.GetFullAsync();
        }
        public async Task<PlaylistDto>? GetByIdAsync(int id)
        {
            Playlist playlist = await _iManager._playlistRepository.GetByIdAsync(id);
            PlaylistDto playlistDto = _mapper.Map<PlaylistDto>(playlist);
            return playlistDto;
        }
        public async Task<Playlist?> GetFullByIdAsync(int id)
        {
            Playlist playlist = await _iManager._playlistRepository.GetFullByIdAsync(id);
            return playlist;
        }
        public async Task<List<Playlist>> GetUserSharedPlaylistsAsync(int userId)
        {
            List<Playlist> playlists = await _iManager._playlistRepository.GetUserSharedPlaylistsAsync(userId);
            return playlists;
        }
        public async Task<List<Playlist>> GetUserPlaylistsAsync(int userId)
        {
            List<Playlist> playlists = await _iManager._playlistRepository.GetUserPlaylistsAsync(userId);
            return playlists;
        }
        public async Task<PlaylistDto> AddAsync(PlaylistDto playlistDto)
        {
            Playlist playlist = _mapper.Map<Playlist>(playlistDto);
            playlist = await _iManager._playlistRepository.AddAsync(playlist);
            if (playlist != null)
                await _iManager.SaveAsync();
            playlistDto = _mapper.Map<PlaylistDto>(playlist);
            return playlistDto;
        }
        public async Task<PlaylistDto> UpdateAsync(int id, PlaylistDto playlistDto)
        {
            Playlist playlist = _mapper.Map<Playlist>(playlistDto);
            playlist = await _iManager._playlistRepository.UpdateAsync(id, playlist);
            if (playlist != null)
                await _iManager.SaveAsync();
            playlistDto = _mapper.Map<PlaylistDto>(playlist);
            return playlistDto;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            bool flag = await _iManager._playlistRepository.DeleteByIdAsync(id);
            if (flag)
                await _iManager.SaveAsync();
            return flag;
        }
        public async Task<bool> RemoveSongFromPlaylistAsync(int playlistId, int songId)
        {
            Playlist playlist = await _iManager._playlistRepository.GetFullByIdAsync(playlistId);
            if (playlist == null)
                return false;
            Song song = playlist.Songs.FirstOrDefault(x => x.Id == songId);
            if (song == null)
                return false;
            playlist.Songs.Remove(song);
            await _iManager.SaveAsync();
            return true;
        }
        public async Task<bool> RemoveUserFromPlaylistAsync(int playlistId, int songId)
        {
            Playlist playlist = await _iManager._playlistRepository.GetFullByIdAsync(playlistId);
            if (playlist == null)
                return false;
            User user = playlist.SharedUsers.FirstOrDefault(x => x.Id == songId);
            if (user == null)
                return false;
            playlist.SharedUsers.Remove(user);
            await _iManager.SaveAsync();
            return true;
        }
        public async Task<int> GetUserIdByEmailAsync(string email)
        {
            var u = await _iManager._userRepository.GetByEmailAsync(email);
            return u.Id;
        }
        public async Task<Playlist> AddUserAsync(Playlist playlist, string userEmail)
        {
            var userId = await GetUserIdByEmailAsync(userEmail);
            if (playlist.SharedUsers.Any(x => x.Id == userId))
                return null;
            var user = await _iManager._userRepository.GetByIdAsync(userId);
            if (user == null)
                return null;
            playlist.SharedUsers.Add(user);
            await _iManager.SaveAsync();
            return playlist;
        }
        public async Task<bool> SharePlaylistAsync(PlaylistDto playlist, string email,string sharedByEmail)
        {
            var baseUrl = Environment.GetEnvironmentVariable("BASEURL");
            var secret = Environment.GetEnvironmentVariable("SECRET");

            if (string.IsNullOrEmpty(baseUrl) || string.IsNullOrEmpty(secret))
                throw new InvalidOperationException("Base URL or Secret Key not defined in environment variables.");

            var link = PlaylistTokenHelper.GenerateSecureLink(playlist.Id, email, baseUrl, secret,playlist.Name, sharedByEmail);

            Console.WriteLine(link);
            var body = $"<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Playlist Invitation</title>\r\n    <style>\r\n        /* Base styles */\r\n        body {{\r\n            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\r\n            line-height: 1.6;\r\n            color: #333;\r\n            background-color: #f9f9f9;\r\n            margin: 0;\r\n            padding: 0;\r\n        }}\r\n        \r\n        .email-container {{\r\n            max-width: 600px;\r\n            margin: 0 auto;\r\n            background-color: #ffffff;\r\n            border-radius: 8px;\r\n            overflow: hidden;\r\n            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);\r\n        }}\r\n        \r\n        .email-header {{\r\n            background-color: #f5f5f5;\r\n            padding: 20px 30px;\r\n            text-align: center;\r\n            border-bottom: 1px solid #eaeaea;\r\n        }}\r\n        \r\n        .logo {{\r\n            max-width: 120px;\r\n            margin-bottom: 10px;\r\n        }}\r\n        \r\n        .email-content {{\r\n            padding: 30px;\r\n            text-align: center;\r\n        }}\r\n        \r\n        .playlist-icon {{\r\n            width: 60px;\r\n            height: 60px;\r\n            margin: 0 auto 20px;\r\n            background-color: #f0f0f0;\r\n            border-radius: 50%;\r\n            display: flex;\r\n            align-items: center;\r\n            justify-content: center;\r\n        }}\r\n        \r\n        h1 {{\r\n            color: #333;\r\n            font-size: 22px;\r\n            font-weight: 600;\r\n            margin-top: 0;\r\n            margin-bottom: 20px;\r\n        }}\r\n        \r\n        p {{\r\n            color: #555;\r\n            font-size: 16px;\r\n            margin-bottom: 25px;\r\n        }}\r\n        \r\n        .playlist-name {{\r\n            font-weight: 600;\r\n            color: #333;\r\n        }}\r\n        \r\n        .button {{\r\n            display: inline-block;\r\n            background-color: #4a90e2;\r\n            color: white !important;\r\n            text-decoration: none;\r\n            padding: 12px 30px;\r\n            border-radius: 4px;\r\n            font-weight: 500;\r\n            margin-bottom: 25px;\r\n            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\r\n        }}\r\n        \r\n        .note {{\r\n            font-size: 14px;\r\n            color: #888;\r\n            margin-top: 30px;\r\n            font-style: italic;\r\n        }}\r\n        \r\n        .email-footer {{\r\n            background-color: #f5f5f5;\r\n            padding: 15px;\r\n            text-align: center;\r\n            font-size: 12px;\r\n            color: #888;\r\n            border-top: 1px solid #eaeaea;\r\n        }}\r\n        \r\n        /* Responsive styles */\r\n        @media only screen and (max-width: 600px) {{\r\n            .email-container {{\r\n                width: 100%;\r\n                border-radius: 0;\r\n            }}\r\n            \r\n            .email-content {{\r\n                padding: 20px;\r\n            }}\r\n        }}\r\n    </style>\r\n</head>\r\n<body>\r\n    <div class=\"email-container\">\r\n        <div class=\"email-header\">\r\n            <!-- You can add your logo here -->\r\n            <svg class=\"logo\" width=\"120\" height=\"30\" viewBox=\"0 0 120 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\r\n                <rect width=\"30\" height=\"30\" rx=\"6\" fill=\"#4a90e2\"/>\r\n                <path d=\"M15 7.5v15M7.5 15h15\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\"/>\r\n                <text x=\"40\" y=\"20\" font-family=\"Arial\" font-size=\"16\" font-weight=\"bold\" fill=\"#333\">MusiX Share Playlist</text>\r\n            </svg>\r\n        </div>\r\n        \r\n        <div class=\"email-content\">\r\n            <div class=\"playlist-icon\">\r\n                <!-- Music note icon -->\r\n                <svg width=\"30\" height=\"30\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\r\n                    <path d=\"M9 18V5l12-2v13\" stroke=\"#4a90e2\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\r\n                    <circle cx=\"6\" cy=\"18\" r=\"3\" stroke=\"#4a90e2\" stroke-width=\"2\"/>\r\n                    <circle cx=\"18\" cy=\"16\" r=\"3\" stroke=\"#4a90e2\" stroke-width=\"2\"/>\r\n                </svg>\r\n            </div>\r\n            \r\n            <h1>You've Been Invited to a Playlist</h1>\r\n            \r\n            <p>You have been invited to view the playlist <span class=\"playlist-name\">{playlist.Name}</span></p>\r\n            \r\n            <a href=\"{link}\" class=\"button\">View Playlist</a>\r\n            \r\n            <p class=\"note\">If you don't want to accept this invitation, you can simply ignore this email.</p>\r\n        </div>\r\n        \r\n        <div class=\"email-footer\">\r\n            &copy; 2025 MusiX. All rights reserved.\r\n        </div>\r\n    </div>\r\n</body>\r\n</html>\r\n";

            var res = await _emailService.SendEmailAsync(new EmailRequest()
            {
                To = email,
                Subject = "Someone shared a playlist with you on MusiX",
                Body = body
            });

            return res;
        }

    }
}
