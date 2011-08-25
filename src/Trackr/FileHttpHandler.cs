using System;
using System.Configuration;
using System.IO;
using System.Threading;
using System.Web;

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
			switch(context.Request.HttpMethod)
			{
				case "GET":
					context.Response.ContentType = context.Request.QueryString["type"] ?? "application/octet-stream";
					context.Response.AppendHeader("Content-Disposition", string.Format("attachment; filename=\"{0}\"", context.Request.QueryString["name"] ?? "file.bin"));
					context.Response.TransmitFile(IdToFileName(context.Request.QueryString["id"]));
					break;
				case "POST":
					string id = Guid.NewGuid().ToString();
					HttpPostedFile httpPostedFile = context.Request.Files["file"];
					using(FileStream fileStream = File.Create(IdToFileName(id)))
					{
						httpPostedFile.InputStream.CopyTo(fileStream);
					}
					context.Response.ContentType = "text/plain";
					context.Response.Write(string.Format("{{\"id\":\"{0}\",\"name\":\"{1}\",\"type\":\"{2}\"}}", id, httpPostedFile.FileName, httpPostedFile.ContentType));
					Thread.Sleep(5000); // TODO for debug
					break;
			}
		}

		private string IdToFileName(string id)
		{
			return Path.Combine(FilesLocation, id);
		}
	}
}