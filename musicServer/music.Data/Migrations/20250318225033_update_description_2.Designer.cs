﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using music.Data;

#nullable disable

namespace music.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20250318225033_update_description_2")]
    partial class update_description_2
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("PermissionRole", b =>
                {
                    b.Property<string>("RolesId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("permissionId")
                        .HasColumnType("int");

                    b.HasKey("RolesId", "permissionId");

                    b.HasIndex("permissionId");

                    b.ToTable("PermissionRole");
                });

            modelBuilder.Entity("PlaylistUser", b =>
                {
                    b.Property<int>("SharedPlaylistsId")
                        .HasColumnType("int");

                    b.Property<int>("SharedUsersId")
                        .HasColumnType("int");

                    b.HasKey("SharedPlaylistsId", "SharedUsersId");

                    b.HasIndex("SharedUsersId");

                    b.ToTable("PlaylistUser");
                });

            modelBuilder.Entity("RoleUser", b =>
                {
                    b.Property<string>("RolesId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("UsersId")
                        .HasColumnType("int");

                    b.HasKey("RolesId", "UsersId");

                    b.HasIndex("UsersId");

                    b.ToTable("RoleUser");
                });

            modelBuilder.Entity("music.Core.Entities.Permission", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Permission");
                });

            modelBuilder.Entity("music.Core.Entities.Playlist", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OwnerId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.ToTable("dbPlaylist");
                });

            modelBuilder.Entity("music.Core.Entities.Request", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<bool>("IsAnswered")
                        .HasColumnType("bit");

                    b.Property<bool>("IsApproved")
                        .HasColumnType("bit");

                    b.Property<DateTime>("RequestedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("SongId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("SongId");

                    b.HasIndex("UserId");

                    b.ToTable("dbRequest");
                });

            modelBuilder.Entity("music.Core.Entities.Role", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Role");
                });

            modelBuilder.Entity("music.Core.Entities.Song", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Artist")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("AudioFilePath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Genre")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsDelited")
                        .HasColumnType("bit");

                    b.Property<bool>("IsPublic")
                        .HasColumnType("bit");

                    b.Property<int>("Likes")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PlaylistId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("PlaylistId");

                    b.ToTable("dbSong");
                });

            modelBuilder.Entity("music.Core.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("dbUser");
                });

            modelBuilder.Entity("PermissionRole", b =>
                {
                    b.HasOne("music.Core.Entities.Role", null)
                        .WithMany()
                        .HasForeignKey("RolesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("music.Core.Entities.Permission", null)
                        .WithMany()
                        .HasForeignKey("permissionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("PlaylistUser", b =>
                {
                    b.HasOne("music.Core.Entities.Playlist", null)
                        .WithMany()
                        .HasForeignKey("SharedPlaylistsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("music.Core.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("SharedUsersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("RoleUser", b =>
                {
                    b.HasOne("music.Core.Entities.Role", null)
                        .WithMany()
                        .HasForeignKey("RolesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("music.Core.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UsersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("music.Core.Entities.Playlist", b =>
                {
                    b.HasOne("music.Core.Entities.User", "Owner")
                        .WithMany("OwnedPlaylists")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("music.Core.Entities.Request", b =>
                {
                    b.HasOne("music.Core.Entities.Song", "Song")
                        .WithMany()
                        .HasForeignKey("SongId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("music.Core.Entities.User", "User")
                        .WithMany("Requests")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Song");

                    b.Navigation("User");
                });

            modelBuilder.Entity("music.Core.Entities.Song", b =>
                {
                    b.HasOne("music.Core.Entities.Playlist", "playlist")
                        .WithMany("Songs")
                        .HasForeignKey("PlaylistId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("playlist");
                });

            modelBuilder.Entity("music.Core.Entities.Playlist", b =>
                {
                    b.Navigation("Songs");
                });

            modelBuilder.Entity("music.Core.Entities.User", b =>
                {
                    b.Navigation("OwnedPlaylists");

                    b.Navigation("Requests");
                });
#pragma warning restore 612, 618
        }
    }
}
