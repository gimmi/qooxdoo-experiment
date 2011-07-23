using System;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Trackr
{
	public class ParameterValuesParser
	{
		private readonly JsonSerializer _jsonSerializer;

		public ParameterValuesParser(JsonSerializer jsonSerializer)
		{
			_jsonSerializer = jsonSerializer;
		}

		public virtual object[] Parse(MethodInfo method, JToken requestData)
		{
			if(requestData.Type == JTokenType.Array)
			{
				return ParseByPosition(method.GetParameters(), (JArray)requestData);
			}
			return ParseByName(method.GetParameters(), (JObject)requestData);
		}

		public virtual object[] ParseByPosition(ParameterInfo[] parameterInfos, JArray data)
		{
			if(parameterInfos.Length != data.Count)
			{
				throw new Exception(String.Format("Method expect {0} parameter(s), but passed {1} parameter(s)", parameterInfos.Length, data.Count));
			}
			var parameters = new object[parameterInfos.Length];
			for(int i = 0; i < parameterInfos.Length; i++)
			{
				parameters[i] = Deserialize(parameterInfos[i], data[i], _jsonSerializer);
			}
			return parameters;
		}

		public virtual object[] ParseByName(ParameterInfo[] parameterInfos, JObject data)
		{
			var parameters = new object[parameterInfos.Length];
			for(int i = 0; i < parameterInfos.Length; i++)
			{
				JToken value;
				if(data.TryGetValue(parameterInfos[i].Name, out value))
				{
					parameters[i] = Deserialize(parameterInfos[i], value, _jsonSerializer);
				}
				else
				{
					throw new Exception(String.Format("Method expect a parameter named '{0}', but it has not been found", parameterInfos[i].Name));
				}
			}
			return parameters;
		}

		private static object Deserialize(ParameterInfo parameterInfo, JToken value, JsonSerializer jsonSerializer)
		{
			return jsonSerializer.Deserialize(new JTokenReader(value), parameterInfo.ParameterType);
		}
	}
}