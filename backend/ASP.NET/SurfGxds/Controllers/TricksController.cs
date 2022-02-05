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
    public class TricksController : ControllerBase
    {
        private readonly SurfGxdsContext _context;
        private readonly SurfGxdsContextProcedures _contextProcedures;

        public TricksController(SurfGxdsContext context,
            SurfGxdsContextProcedures contextProcedures)
        {
            _context = context;
            _contextProcedures = contextProcedures;
        }

        // GET: api/Tricks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trick>>> GetTricks()
        {
            return await _context.Tricks.ToListAsync();
        }

        // GET: api/Tricks/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Trick>> GetTrick(int id)
        {
            var trick = await _context.Tricks.FindAsync(id);

            if (trick == null)
            {
                return NotFound();
            }

            return trick;
        }

        // PUT: api/Tricks/1
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTrick(int id, Trick trick)
        {
            if (id != trick.Id)
            {
                return BadRequest();
            }

            _context.Entry(trick).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TrickExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Tricks
        [HttpPost]
        public async Task<ActionResult<Trick>> PostTrick(Trick trick)
        {
            _context.Tricks.Add(trick);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTrick", new { id = trick.Id }, trick);
        }

        // DELETE: api/Tricks/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrick(int id)
        {
            var trick = await _context.Tricks.FindAsync(id);
            if (trick == null)
            {
                return NotFound();
            }

            _context.Tricks.Remove(trick);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TrickExists(int id)
        {
            return _context.Tricks.Any(e => e.Id == id);
        }

        // Sql with relatives
        // [HttpGet("GetTrickFromComplete")]
        // public async Task<Complete?> GetTrickFromComplete(int? completeId)
        // {
        //     return await _context.Completes
        //         .Include(complete => complete.Trick)
        //         .Where(complete => complete.Id == completeId)
        //         .FirstOrDefaultAsync();
        // }

        // Views
        [HttpGet("GetTricksRoute")]
        public async Task<IEnumerable<TricksRouteViewer>> GetTricksRoute(int map_id)
        {
            return await _context.TricksRouteViewers.Where(t => t.MapId == map_id).ToListAsync();
        }

        // Procedures
        [HttpGet("GetTopAvg")]
        public async Task<IEnumerable<GetTopAvg>> GetTopAvg(string map, int limit, int offset)
        {
            return await _contextProcedures.GetTopAvg
                .FromSqlRaw("call get_top_avg({0},{1},{2});", map, limit, offset)
                .ToListAsync();
        }

        [HttpGet("GetTrickSvr")]
        public async Task<IEnumerable<GetTrickSvr>> GetTrickSvr(int p_trick_id, string p_steamid)
        {
            return await _contextProcedures.GetTrickSvr
                .FromSqlRaw("call get_trick_swr({0},{1});", p_trick_id, p_steamid)
                .ToListAsync();
        }

        [HttpGet("GetTrickTvr")]
        public async Task<IEnumerable<GetTrickTvr>> GetTrickTvr(int p_trick_id, string p_steamid)
        {
            return await _contextProcedures.GetTrickTvr
                .FromSqlRaw("call get_trick_twr({0},{1});", p_trick_id, p_steamid)
                .ToListAsync();
        }

        // Need create guard
        [HttpPatch("PatchTrickRouteParse")]
        public async Task<IEnumerable<PatchTrickRouteParse>> PatchTrickRouteParse(int p_trick_id, string p_new_route)
        {
            return await _contextProcedures.PatchTrickRouteParse
                .FromSqlRaw("call patch_trick_route_parse('',{0},{1});", p_trick_id, p_new_route)
                .ToListAsync();
        }
    }
}