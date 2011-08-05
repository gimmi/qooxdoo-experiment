qx.Class.define("trackr.data.Request", {
	extend: qx.core.Object,

	statics: {
		TO_MODEL_CONVERTER: function (value) { return qx.data.marshal.Json.createModel(value); },
		TO_NATIVE_CONVERTER: function (value) { return qx.util.Serializer.toNativeObject(value); }
	},

	properties: {
		response: { nullable: true, event: "changeResponse" },
		requestConverter: { nullable: false, check: "Function", init: function (value) { return value; } },
		responseConverter: { nullable: false, check: "Function", init: function (value) { return value; } }
	},

	events: {
		changeResponse: "qx.event.type.Data"
	},

	construct: function (clazz, method) {
		this.base(arguments);
		var url = qx.util.Uri.appendParamsToUrl("/rpc", {
			"class": clazz,
			"method": method
		});
		this._xhr = new qx.io.request.Xhr(url, "PUT");
		this._xhr.setRequestHeaders({ "Content-Type": "application/json" });
		this._xhr.bind("response", this, "response", { converter: qx.lang.Function.bind(this.__convertResponse, this) });
	},

	members: {
		_xhr: null,

		send: function (params, listener, self) {
			params = this.__convertRequest(params);
			params = qx.lang.Json.stringify(params);
			listener = listener || qx.lang.Function.empty;
			self = self || this;

			this._xhr.setRequestData(params);
			this._xhr.addListenerOnce("success", function (e) {
				var response = this.__convertResponse(e.getTarget().getResponse());
				listener.call(self, response);
			}, this);
			this._xhr.send();
		},

		__convertRequest: function (value) {
			return this.getRequestConverter()(value);
		},

		__convertResponse: function (value) {
			return this.getResponseConverter()(value);
		}
	}
});