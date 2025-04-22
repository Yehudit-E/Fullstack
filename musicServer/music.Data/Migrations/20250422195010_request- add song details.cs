using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace music.Data.Migrations
{
    /// <inheritdoc />
    public partial class requestaddsongdetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_dbRequest_dbSong_SongId",
                table: "dbRequest");

            migrationBuilder.DropIndex(
                name: "IX_dbRequest_SongId",
                table: "dbRequest");

            migrationBuilder.DropColumn(
                name: "SongId",
                table: "dbRequest");

            migrationBuilder.AddColumn<string>(
                name: "Genre",
                table: "dbRequest",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SongArtist",
                table: "dbRequest",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SongAudioFilePath",
                table: "dbRequest",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SongName",
                table: "dbRequest",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Genre",
                table: "dbRequest");

            migrationBuilder.DropColumn(
                name: "SongArtist",
                table: "dbRequest");

            migrationBuilder.DropColumn(
                name: "SongAudioFilePath",
                table: "dbRequest");

            migrationBuilder.DropColumn(
                name: "SongName",
                table: "dbRequest");

            migrationBuilder.AddColumn<int>(
                name: "SongId",
                table: "dbRequest",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_dbRequest_SongId",
                table: "dbRequest",
                column: "SongId");

            migrationBuilder.AddForeignKey(
                name: "FK_dbRequest_dbSong_SongId",
                table: "dbRequest",
                column: "SongId",
                principalTable: "dbSong",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
