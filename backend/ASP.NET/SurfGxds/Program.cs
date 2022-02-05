using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SurfGxds.Data;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<SurfGxdsContext>(
options =>
{
    options.UseMySql(builder.Configuration.GetConnectionString("SurfGxdsDB"),
    Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.19-mysql"));
});

builder.Services.AddMvc(option => option.EnableEndpointRouting = false)
    .AddNewtonsoftJson(opt => opt.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);

builder.Services.AddDbContext<SurfGxdsContextProcedures>(
options =>
{
    options.UseMySql(builder.Configuration.GetConnectionString("SurfGxdsDB"),
    Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.19-mysql"));
});


var app = builder.Build();

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

app.UseSwagger();
app.UseSwaggerUI();

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
