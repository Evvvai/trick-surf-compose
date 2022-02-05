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
    public class TriggersController : ControllerBase
    {
        private readonly SurfGxdsContext _context;
        private readonly SurfGxdsContextProcedures _contextProcedures;

        public TriggersController(SurfGxdsContext context,
            SurfGxdsContextProcedures contextProcedures)
        {
            _context = context;
            _contextProcedures = contextProcedures;
        }

        // GET: api/Triggers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trigger>>> GetTriggers()
        {
            return await _context.Triggers.ToListAsync();
        }

        // GET: api/Triggers/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Trigger>> GetTrigger(int id)
        {
            var trigger = await _context.Triggers.FindAsync(id);

            if (trigger == null)
            {
                return NotFound();
            }

            return trigger;
        }

        // PUT: api/Triggers/1
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTrigger(int id, Trigger trigger)
        {
            if (id != trigger.Id)
            {
                return BadRequest();
            }

            _context.Entry(trigger).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TriggerExists(id))
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

        // POST: api/Triggers
        [HttpPost]
        public async Task<ActionResult<Trigger>> PostTrigger(Trigger trigger)
        {
            _context.Triggers.Add(trigger);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTrigger", new { id = trigger.Id }, trigger);
        }

        // DELETE: api/Triggers/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrigger(int id)
        {
            var trigger = await _context.Triggers.FindAsync(id);
            if (trigger == null)
            {
                return NotFound();
            }

            _context.Triggers.Remove(trigger);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/HopTrigger/1
        [HttpGet("HopTrigger/{id}")]
        public async Task<ActionResult<HopTrigger>> GetHopTrigger(int id)
        {
            var trigger = await _context.HopTriggers.FindAsync(id);

            if (trigger == null)
            {
                return NotFound();
            }

            return trigger;
        }

        // POST: api/HopTrigger
        [HttpPost("HopTrigger/")]
        public async Task<ActionResult<HopTrigger>> PostHopTrigger(int trigger_id)
        {
            var hopTriggers = new HopTrigger();
            hopTriggers.TriggerId = trigger_id;

            _context.HopTriggers.Add(hopTriggers);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHopTrigger", new { trigger_id = trigger_id }, trigger_id);
        }

        // DELETE: api/HopTrigger/1
        [HttpDelete("HopTrigger/{trigger_id}")]
        public async Task<IActionResult> DeleteHopTrigger(int id)
        {
            var trigger = await _context.HopTriggers.FindAsync(id);
            if (trigger == null)
            {
                return NotFound();
            }

            _context.HopTriggers.Remove(trigger);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool TriggerExists(int id)
        {
            return _context.Triggers.Any(e => e.Id == id);
        }
    }
}