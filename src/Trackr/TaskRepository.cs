using System;

namespace Trackr
{
	public class TaskRepository
	{
		public Task Load(string taskId)
		{
			return new Task { Id = taskId, Number = 1, Title = string.Format("Task #{0} generated @{1}", 1, DateTime.Now.TimeOfDay), Description = "Task description" };
		}

		public object Save(Task task)
		{
			return new { Success = false, Message = "Server side validation error!" };
		}
	}
}