# ASP.NET Core backend contract

Set `VITE_BACKEND=api` and `VITE_API_BASE_URL=https://localhost:7065/api` (example) to use your own API.
All calls go through `src/services/api.js` (Axios). JWT is sent as `Authorization: Bearer <token>`.

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/analytics/visit` `{visitorId, path}` | public | register a visit (dedupe per visitor/day) → `{ totalViews }` |
| GET  | `/analytics/views` | public | → `{ totalViews }` |
| POST | `/analytics/project-view` `{slug, visitorId}` | public | count a project page view |
| POST | `/contact` `{name,email,subject,message}` | public | store message / send email |
| GET  | `/projects`, `/skills`, `/settings` | public | content when `VITE_REMOTE_CONTENT=true` |
| POST | `/auth/login` `{email,password}` → `{token,user}` | public | JWT login |
| POST | `/auth/google` `{idToken}` → `{token,user}` | public | verify Google ID token, issue JWT |
| GET  | `/admin/stats` | Admin | `{visitors, projectViews, projectViewsBySlug, messages, unread, projects, skills}` |
| GET/POST/PUT/DELETE | `/admin/{projects|skills|messages}[/{id}]` | Admin | CRUD |
| POST | `/admin/upload` (multipart `file`, `folder`) → `{url}` | Admin | images / resume |
| GET/PUT | `/admin/settings` | Admin | `{resumePath, profileImage}` |

## Program.cs essentials
```csharp
builder.Services.AddCors(o => o.AddPolicy("web", p => p
    .WithOrigins("http://localhost:5173", "https://your-domain.com")
    .AllowAnyHeader().AllowAnyMethod()));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o => o.TokenValidationParameters = new()
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = false,
    });
builder.Services.AddAuthorization(o => o.AddPolicy("AdminOnly", p => p.RequireRole("Admin")));

app.UseCors("web");          // exactly once, before auth
app.UseAuthentication();
app.UseAuthorization();
```

## Analytics controller (unique visitor per day)
```csharp
[ApiController, Route("api/analytics")]
public class AnalyticsController(AppDbContext db) : ControllerBase
{
    [HttpPost("visit")]
    public async Task<IActionResult> Visit(VisitDto dto)
    {
        var day = DateOnly.FromDateTime(DateTime.UtcNow);
        var seen = await db.Visits.AnyAsync(v => v.VisitorId == dto.VisitorId && v.Day == day);
        if (!seen) { db.Visits.Add(new Visit { VisitorId = dto.VisitorId, Day = day, Path = dto.Path }); await db.SaveChangesAsync(); }
        return Ok(new { totalViews = await db.Visits.CountAsync() });
    }

    [HttpGet("views")]
    public async Task<IActionResult> Views() => Ok(new { totalViews = await db.Visits.CountAsync() });
}
public record VisitDto(string VisitorId, string Path);
```

## Admin controllers
Decorate with `[Authorize(Policy = "AdminOnly")]`. Put the `Admin` role claim in the JWT
(`new Claim(ClaimTypes.Role, "Admin")`) — the frontend reads it to protect `/admin`.
For Google OAuth use `GoogleJsonWebSignature.ValidateAsync(idToken, new() { Audience = new[] { clientId } })`
and map the verified email to a user with the `Admin` role.
