﻿using System;
using System.Collections.Generic;
using System.Linq;

namespace Trackr
{
	public class TaskRepository
	{
		private readonly Task[] _tasks;

		private readonly IList<TaskState> _states = new List<TaskState> {
			new TaskState { Id = "1", Description = "Open" },
			new TaskState { Id = "2", Description = "Closed" },
			new TaskState { Id = "3", Description = "Test" },
		};

		public TaskRepository()
		{
			int n = 300;
			_tasks = new Task[n];
			for(int i = 0; i < n; i++)
			{
				_tasks[i] = new Task {
					Id = i.ToString(),
					Number = i,
					Title = string.Format("Task #{0}", i),
					Description = string.Format("Generated @{0}", DateTime.Now.TimeOfDay),
					Comments = BuildComments(i),
					State = _states[0],
					States = _states
				};
			}
		}

		private static List<Comment> BuildComments(int taskId)
		{
			var ret = new List<Comment>();
			for (int i = 0; i < 100; i++)
			{
				ret.Add(new Comment {Id = "1", User = "Gimmi", Text = string.Format("Ticket #{0} comment {1}", taskId, i)});
			}
			return ret;
		}

		public Task Load(string taskId)
		{
			return _tasks.Where(t => t.Id == taskId).Single();
		}

		public object Save(Task task)
		{
			return new { Errors = new[] { "Error 1", "Error 2" } };
		}

		public int GetRowCount(string filter)
		{
			return ApplyFilter(filter).Count();
		}

		public IEnumerable<object> GetRowData(string filter, int firstRow, int lastRow)
		{
			return ApplyFilter(filter).Skip(firstRow).Take(lastRow - firstRow + 1).Select(t => new { t.Id, t.Number, t.Title });
		}

		private IQueryable<Task> ApplyFilter(string filter)
		{
			return _tasks.AsQueryable().Where(t => t.Title.Contains(filter));
		}
	}
}