using System;
using System.Linq;

namespace Trackr
{
	public class AttachmentRepository
	{
		private static readonly Attachment[] Attachments = new[] {
			new Attachment { Id = new Guid("DBB02650-3C56-4C5E-A82F-2ACD06BE5956"), Name = "file.txt", MimeType = "application/octet-stream" }
		};

		public Attachment Create(string name, string mimeType)
		{
			return new Attachment { Id = Guid.NewGuid(), Name = name, MimeType = mimeType };
		}

		public Attachment Load(Guid id)
		{
			return Attachments.Single(a => a.Id == id);
		}
	}
}