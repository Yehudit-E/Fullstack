using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace music.Data.Migrations
{
    /// <inheritdoc />
    public partial class publictosharednumOfSongs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsPublic",
                table: "dbSong",
                newName: "IsShared");

            migrationBuilder.AddColumn<int>(
                name: "NumOfSongs",
                table: "dbPlaylist",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumOfSongs",
                table: "dbPlaylist");

            migrationBuilder.RenameColumn(
                name: "IsShared",
                table: "dbSong",
                newName: "IsPublic");
        }
    }
}
