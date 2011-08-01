using System.Collections.Generic;

namespace Trackr
{
	public class Task
	{
		public string Id;
		public int Number;
		public string Title;
		public string Description;
		public string Comment;
		public IList<Comment> Comments = new List<Comment>();
		public TaskState State;
		public IList<TaskState> States;
	}
}