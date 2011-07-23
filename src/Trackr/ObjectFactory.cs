using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace SpikeQooxdoo
{
	public class ObjectFactory
	{
		public virtual object GetInstance(Type type)
		{
			return Activator.CreateInstance(type);
		}

		public virtual JsonSerializer GetJsonSerializer()
		{
			return new JsonSerializer { ContractResolver = new CamelCasePropertyNamesContractResolver() };
		}

		public virtual void Release(object instance) { }
	}
}