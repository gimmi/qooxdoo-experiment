using System;

namespace Trackr
{
	public class TaskRepository
	{
		public Task Get(string taskId)
		{
			return new Task { Id = taskId, Number = 1, Title = string.Format("Task #{0} generated @{1}", 1, DateTime.Now.TimeOfDay), Description = "Task description" };
		}
	}
}