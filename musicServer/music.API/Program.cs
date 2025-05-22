using Auto1040.Api.Extensions;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using music.Api.Extensions;
using music.Data;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});
builder.Services.AddControllers();
builder.Services.AddSwaggerGen(c =>{
   c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod() 
               .AllowAnyHeader();
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

//builder.Services.AddDbContext<DataContext>();


builder.Services.AddDependencyInjectoions();

builder.Services.AddSwagger();

builder.AddJwtAuthentication();

builder.AddJwtAuthorization();

Env.Load();
// מוסיף את המשתנים ל-AppSettings בצורה דינאמית
builder.Configuration["AWS:BucketName"] = Env.GetString("AWS_BUCKET_NAME");
builder.Configuration["AWS:Region"] = Env.GetString("AWS_REGION");
builder.Configuration["AWS:AccessKey"] = Env.GetString("AWS_ACCESS_KEY");
builder.Configuration["AWS:SecretKey"] = Env.GetString("AWS_SECRET_KEY");

builder.Configuration["SMTP:SMTP_SERVER"] = Env.GetString("SMTP_SERVER");
builder.Configuration["SMTP:PORT"] = Env.GetString("SMTP_PORT");
builder.Configuration["SMTP:GOOGLE_USER_EMAIL"] = Env.GetString("GOOGLE_USER_EMAIL");
builder.Configuration["SMTP:PASSWORD"] = Env.GetString("PASSWORD");

string connectionString = Env.GetString("DATABASE_CONNECTION_STRING");

builder.Services.AddDbContext<DataContext>(options =>
     options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
    options => options.CommandTimeout(60)));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAllOrigins");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
app.UseSwagger();

app.UseSwaggerUI(c =>{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = string.Empty; 
});

app.Run();
