using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace music.Data.Migrations
{
    /// <inheritdoc />
    public partial class playlistfiledsimagedescriptionandisPublic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "dbPlaylist",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImageFilePath",
                table: "dbPlaylist",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "dbPlaylist",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "dbPlaylist");

            migrationBuilder.DropColumn(
                name: "ImageFilePath",
                table: "dbPlaylist");

            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "dbPlaylist");
        }
    }
}
