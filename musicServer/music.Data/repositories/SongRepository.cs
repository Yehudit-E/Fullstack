using Microsoft.EntityFrameworkCore;
using music.Core.DTOs;
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
    public class SongRepository:Repository<Song>,ISongRepository
    {
        public SongRepository(DataContext dataContex) : base(dataContex)
        {
        }

        public async Task<IEnumerable<Song>> GetPublicAsync()
        {
            return await _dataSet.Where(x=>x.IsPublic==true).ToListAsync();
        }

        public async Task<Song> UpdateLikesAsync(int id)
        {
            var existingEntity = await _dataSet.FindAsync(id);
            if (existingEntity == null)
            {
                return null;
            }
            existingEntity.Likes++;
            return existingEntity;
        }
        public override async Task<Song> UpdateAsync(int id, Song updatedEntity)
        {
            var existingEntity = await _dataSet.FindAsync(id);
            if (existingEntity == null)
            {
                return null;
            }
            var properties = typeof(Song).GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                      .Where(prop => prop.Name != "Id").Where(prop => prop.Name != "Likes");

            foreach (var property in properties)
            {
                var updatedValue = property.GetValue(updatedEntity);
                if (updatedValue != null)
                {
                    property.SetValue(existingEntity, updatedValue);
                }
            }
            return existingEntity;
        }
        public async Task<Song> AddLyricsAsync(int id, string lyrics)
        {
            var existingEntity = await _dataSet.FindAsync(id);
            if (existingEntity == null)
            {
                return null;
            }
            existingEntity.Lyrics = lyrics;
            return existingEntity;
        }
    }
}
