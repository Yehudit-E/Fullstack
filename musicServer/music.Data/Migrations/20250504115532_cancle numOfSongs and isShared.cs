using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace music.Data.Migrations
{
    /// <inheritdoc />
    public partial class canclenumOfSongsandisShared : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "dbPlaylist");

            migrationBuilder.DropColumn(
                name: "NumOfSongs",
                table: "dbPlaylist");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "dbPlaylist",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "NumOfSongs",
                table: "dbPlaylist",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
