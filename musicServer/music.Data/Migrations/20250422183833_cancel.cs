using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace music.Data.Migrations
{
    /// <inheritdoc />
    public partial class cancel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_dbRequest_RequestSong_RequestSongId",
                table: "dbRequest");

            migrationBuilder.DropTable(
                name: "RequestSong");

            migrationBuilder.DropIndex(
                name: "IX_dbRequest_RequestSongId",
                table: "dbRequest");

            migrationBuilder.DropColumn(
                name: "RequestSongId",
                table: "dbRequest");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_dbRequest_dbSong_SongId",
                table: "dbRequest");

            migrationBuilder.DropIndex(
                name: "IX_dbRequest_SongId",
                table: "dbRequest");

            migrationBuilder.AddColumn<int>(
                name: "RequestSongId",
                table: "dbRequest",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "RequestSong",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Artist = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AudioFilePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Genre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequestSong", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_dbRequest_RequestSongId",
                table: "dbRequest",
                column: "RequestSongId");

            migrationBuilder.AddForeignKey(
                name: "FK_dbRequest_RequestSong_RequestSongId",
                table: "dbRequest",
                column: "RequestSongId",
                principalTable: "RequestSong",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
