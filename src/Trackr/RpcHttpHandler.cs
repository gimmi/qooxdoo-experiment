using System;
using System.Collections.Specialized;
using System.IO;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SpikeQooxdoo;

namespace Trackr
{
	public class RpcHttpHandler : IHttpHandler
	{
		public static ObjectFactory ObjectFactory = new ObjectFactory();

		public bool IsReusable
		{
			get { return false; }
		}

		public void ProcessRequest(HttpContext context)
		{
			try
			{
				JToken parameters = GetParameters(context);
				JsonSerializer jsonSerializer = ObjectFactory.GetJsonSerializer();
				try
				{
					HttpRequest request = context.Request;
					new RpcHandler(jsonSerializer, new ParameterValuesParser(jsonSerializer), ObjectFactory).Handle(request, context.Response, parameters);
				}
				finally
				{
					ObjectFactory.Release(jsonSerializer);
				}
			}
			catch(Exception e)
			{
				context.Response.StatusCode = 500;
				context.Response.ContentType = "text/plain";
				context.Response.Write(e.ToString());
			}
		}

		private static JToken GetParameters(HttpContext context)
		{
			if(context.Request.ContentType == "application/json")
			{
				return JToken.Load(new JsonTextReader(new StreamReader(context.Request.InputStream, context.Request.ContentEncoding)));
			}
			string verb = context.Request.RequestType;
			if(verb == "GET")
			{
				return FromNameValueCollection(context.Request.QueryString);
			}
			if(verb == "POST")
			{
				return FromNameValueCollection(context.Request.Form);
			}
			throw new Exception("Unsupported request type");
		}

		private static JObject FromNameValueCollection(NameValueCollection nameValueCollection)
		{
			var ret = new JObject();
			foreach(string key in nameValueCollection.AllKeys)
			{
				ret.Add(key, nameValueCollection[key]);
			}
			return ret;
		}
	}
}