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
    public class MapsController : ControllerBase
    {
        private readonly SurfGxdsContext _context;
        private readonly SurfGxdsContextProcedures _contextProcedures;

        public MapsController(SurfGxdsContext context,
            SurfGxdsContextProcedures contextProcedures)
        {
            _context = context;
            _contextProcedures = contextProcedures;
        }

        // GET: api/Maps
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Map>>> GetMaps()
        {
            return await _context.Maps.ToListAsync();
        }

        // GET: api/Maps/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Map>> GetMap(int id)
        {
            var map = await _context.Maps.FindAsync(id);

            if (map == null)
            {
                return NotFound();
            }

            return map;
        }

        // PUT: api/Maps/1
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMap(int id, Map map)
        {
            if (id != map.Id)
            {
                return BadRequest();
            }

            _context.Entry(map).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MapExists(id))
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

        // POST: api/Maps
        [HttpPost]
        public async Task<ActionResult<Map>> PostMap(Map map)
        {
            _context.Maps.Add(map);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMap", new { id = map.Id }, map);
        }

        // DELETE: api/Maps/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMap(int id)
        {
            var map = await _context.Maps.FindAsync(id);
            if (map == null)
            {
                return NotFound();
            }

            _context.Maps.Remove(map);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MapExists(int id)
        {
            return _context.Maps.Any(e => e.Id == id);
        }
    }
}