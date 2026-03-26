using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodoController : ControllerBase
{
    // In-memory store — seeded with a couple of example items
    private static readonly List<TodoItem> _todos = new()
    {
        new TodoItem { Id = 1, Title = "Buy groceries", IsCompleted = false },
        new TodoItem { Id = 2, Title = "Read a book",   IsCompleted = true  },
    };

    private static int _nextId = 3;

    // GET /api/todos
    [HttpGet]
    public ActionResult<IEnumerable<TodoItem>> GetAll()
    {
        return Ok(_todos);
    }

    // POST /api/todos
    [HttpPost]
    public ActionResult<TodoItem> Create([FromBody] TodoItem item)
    {
        if (string.IsNullOrWhiteSpace(item.Title))
            return BadRequest(new { message = "Title is required." });

        item.Id = _nextId++;
        item.IsCompleted = false;
        _todos.Add(item);

        return CreatedAtAction(nameof(GetAll), new { id = item.Id }, item);
    }

    // PUT /api/todos/{id}
    [HttpPut("{id}")]
    public ActionResult<TodoItem> Update(int id, [FromBody] TodoItem updated)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo is null)
            return NotFound(new { message = $"Todo with id {id} not found." });

        if (string.IsNullOrWhiteSpace(updated.Title))
            return BadRequest(new { message = "Title is required." });

        todo.Title = updated.Title;
        todo.IsCompleted = updated.IsCompleted;

        return Ok(todo);
    }

    // DELETE /api/todos/{id}
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo is null)
            return NotFound(new { message = $"Todo with id {id} not found." });

        _todos.Remove(todo);
        return NoContent();
    }
}
