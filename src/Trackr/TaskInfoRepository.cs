using System;
using System.Collections.Generic;
using System.Linq;

namespace Trackr
{
	public class TaskInfoRepository
	{
		private readonly TaskInfo[] _taskInfos;

		public TaskInfoRepository()
		{
			int n = 300;
			_taskInfos = new TaskInfo[n];
			for(int i = 0; i < n; i++)
			{
				_taskInfos[i] = new TaskInfo { Id = i.ToString(), Number = i, Title = string.Format("Task #{0} generated @{1}", i, DateTime.Now.TimeOfDay)};
			}
		}

		public int GetRowCount(string filter)
		{
			return ApplyFilter(filter).Count();
		}

		public IEnumerable<TaskInfo> GetRowData(string filter, int firstRow, int lastRow)
		{
			return ApplyFilter(filter).Skip(firstRow).Take(lastRow - firstRow + 1);
		}

		private IQueryable<TaskInfo> ApplyFilter(string filter)
		{
			return _taskInfos.AsQueryable().Where(t => t.Title.Contains(filter));
		}
	}
}