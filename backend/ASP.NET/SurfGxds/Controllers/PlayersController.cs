using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SurfGxds.Data;
using SurfGxds.Models;

namespace SurfGxds.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayersController : ControllerBase
    {
        private readonly SurfGxdsContext _context;
        private readonly SurfGxdsContextProcedures _contextProcedures;

        public PlayersController(SurfGxdsContext context,
            SurfGxdsContextProcedures contextProcedures)
        {
            _context = context;
            _contextProcedures = contextProcedures;
        }

        // GET: api/Player
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Player>>> GetPlayers()
        {
            return await _context.Players.ToListAsync();
        }

        // GET: api/Players/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Player>> GetPlayer(int id)
        {
            var player = await _context.Players.FindAsync(id);

            if (player == null)
            {
                return NotFound();
            }

            return player;
        }

        // DELETE: api/Players/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlayer(int id)
        {
            var player = await _context.Players.FindAsync(id);
            if (player == null)
            {
                return NotFound();
            }

            _context.Players.Remove(player);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Procedures

        // Need create guard
        [HttpPut("PutPlayerData")]
        public async Task<IActionResult> PutPlayerData(string p_steamid2, string p_steamid64, string p_nick)
        {
            _contextProcedures.PutPlayerData
               .FromSqlRaw("call put_player_data({0},{1},{2});", p_steamid2, p_steamid64, p_nick);

            return NoContent();
        }
    }
}