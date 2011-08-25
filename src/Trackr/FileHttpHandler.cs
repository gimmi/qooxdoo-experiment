using System;
using System.Configuration;
using System.IO;
using System.Threading;
using System.Web;
using System.Web.UI.WebControls;

namespace Trackr
{
	public class FileHttpHandler : IHttpHandler
	{
		private static readonly string FilesLocation = ConfigurationManager.AppSettings["FilesLocation"];

		public bool IsReusable
		{
			get { return false; }
		}

		public void ProcessRequest(HttpContext context)
		{
			var repository = new AttachmentRepository();
			Attachment attachment;
			switch (context.Request.HttpMethod)
			{
				case "GET":
					attachment = repository.Load(Guid.Parse(context.Request.QueryString["id"]));
					context.Response.ContentType = attachment.MimeType;
					context.Response.AppendHeader("Content-Disposition", string.Format("attachment; filename=\"{0}\"", attachment.Name));
					context.Response.TransmitFile(IdToFileName(attachment.Id));
					break;
				case "POST":
					HttpPostedFile httpPostedFile = context.Request.Files["file"];
					attachment = repository.Create(httpPostedFile.FileName, httpPostedFile.ContentType);
					using (var fileStream = File.Create(IdToFileName(attachment.Id)))
					{
						httpPostedFile.InputStream.CopyTo(fileStream);
					}
					context.Response.ContentType = "text/plain";
					context.Response.Write(attachment.Id);
					Thread.Sleep(5000); // TODO for debug
					break;
			}
		}

		private string IdToFileName(Guid id)
		{
			return Path.Combine(FilesLocation, id.ToString());
		}
	}
}