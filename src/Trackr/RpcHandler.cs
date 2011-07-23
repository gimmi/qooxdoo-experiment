using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SpikeQooxdoo;

namespace Trackr
{
	public class RpcHandler
	{
		private readonly JsonSerializer _jsonSerializer;
		private readonly ParameterValuesParser _parameterValuesParser;
		private readonly ObjectFactory _objectFactory;

		public RpcHandler(JsonSerializer jsonSerializer, ParameterValuesParser parameterValuesParser, ObjectFactory objectFactory)
		{
			_jsonSerializer = jsonSerializer;
			_parameterValuesParser = parameterValuesParser;
			_objectFactory = objectFactory;
		}

		public void Handle(HttpRequest request, HttpResponse response, JToken requestData)
		{
			Type type = Type.GetType(request.QueryString["class"], true, false);
			MethodInfo method = type.GetMethods().Single(m => m.Name == request.QueryString["method"]);
			object[] parameters = _parameterValuesParser.Parse(method, requestData);

			object result;
			object instance = _objectFactory.GetInstance(type);
			try
			{
				result = method.Invoke(instance, parameters);
			}
			finally
			{
				_objectFactory.Release(instance);
			}
			response.ContentType = "application/json";
			using(var jsonWriter = new JsonTextWriter(new StreamWriter(response.OutputStream, response.ContentEncoding)))
			{
				_jsonSerializer.Serialize(jsonWriter, result);
			}
		}
	}
}