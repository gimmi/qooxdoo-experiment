using System.Collections.Generic;
using System.Linq;

namespace Trackr
{
	public class TicketInfoRepository
	{
		private readonly TicketInfo[] _ticketInfos;

		public TicketInfoRepository()
		{
			int n = 300;
			_ticketInfos = new TicketInfo[n];
			for(int i = 0; i < n; i++)
			{
				_ticketInfos[i] = new TicketInfo { Id = n.ToString(), Number = n, Title = "Ticket #" + i };
			}
		}

		public int GetRowCount()
		{
			return _ticketInfos.Length;
		}

		public IEnumerable<TicketInfo> GetRowData(int firstRow, int lastRow)
		{
			return _ticketInfos.Skip(firstRow).Take(lastRow - firstRow + 1);
		}
	}
}