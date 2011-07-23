using System.Collections.Generic;
using System.Linq;

namespace Trackr
{
	public class TicketInfoRepository
	{
		private readonly TicketInfo[] _ticketInfos = new[] {
			new TicketInfo { Id = "1", Number = 1, Title = " Ticket #1" },
			new TicketInfo { Id = "2", Number = 2, Title = " Ticket #2" }
		};

		public int GetRowCount()
		{
			return _ticketInfos.Length;
		}

		public IEnumerable<TicketInfo> GetRowData(int firstRow, int lastRow)
		{
			return _ticketInfos.Skip(firstRow).Take(lastRow - firstRow);
		}
	}
}