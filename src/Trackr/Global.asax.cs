using System;
using System.Web;
using JsonRpcHandler;
using JsonRpcHandler.MethodResolver;

namespace Trackr
{
	public class Global : HttpApplication
	{
		protected void Application_Start(object sender, EventArgs e)
		{
			JsonRpcHttpHandler.MethodResolver = new LambdaMethodResolver()
				.Register<TaskRepository>("TaskRepository.getRowCount", x => x.GetRowCount(null))
				.Register<TaskRepository>("TaskRepository.getRowData", x => x.GetRowData(null, 0, 0))
				.Register<TaskRepository>("TaskRepository.load", x => x.Load(null))
				.Register<TaskRepository>("TaskRepository.save", x => x.Save(null));
		}

		protected void Session_Start(object sender, EventArgs e) {}

		protected void Application_BeginRequest(object sender, EventArgs e) {}

		protected void Application_AuthenticateRequest(object sender, EventArgs e) {}

		protected void Application_Error(object sender, EventArgs e) {}

		protected void Session_End(object sender, EventArgs e) {}

		protected void Application_End(object sender, EventArgs e) {}
	}
}