using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace music.Data.Migrations
{
    /// <inheritdoc />
    public partial class deletedescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "dbSong");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "dbSong",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
