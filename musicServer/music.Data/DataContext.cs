




using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using music.Core.Entities;

namespace music.Data
{
    public class DataContext:DbContext
    {
        public DbSet<Song> dbSong { get; set; }
        public DbSet<User> dbUser { get; set; }
        public DbSet<Playlist> dbPlaylist { get; set; }
        public DbSet<Request> dbRequest { get; set; }
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    if (!optionsBuilder.IsConfigured)
        //    {
        //        optionsBuilder.UseSqlServer("Data Source =DESKTOP-8ED3CL9; Initial Catalog = music2_db; Integrated Security = true;TrustServerCertificate=True;");
        //    }
        //}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // קשר One-to-Many – המשתמש שהוא הבעלים של רשימת ההשמעה
            modelBuilder.Entity<Playlist>()
                .HasOne(p => p.Owner)
                .WithMany(u => u.OwnedPlaylists)
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Restrict); // לא מוחקים פלייליסט אם מוחקים יוזר

            // קשר Many-to-Many – ללא צורך בטבלת ביניים!
            modelBuilder.Entity<Playlist>()
                .HasMany(p => p.SharedUsers)
                .WithMany(u => u.SharedPlaylists);
        }

    }
}
