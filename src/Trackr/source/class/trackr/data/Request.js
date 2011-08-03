qx.Class.define("trackr.data.Request", {
	extend: qx.core.Object,

	properties: {
		model : { nullable: true, event: "changeModel" }
	},

	construct: function(clazz, method) {
		this.base(arguments);
		var url = qx.util.Uri.appendParamsToUrl("/rpc", {
			"class": clazz,
			"method": method
		});
		this._xhr = new qx.io.request.Xhr(url, "PUT");
		this._xhr.setRequestHeaders({ "Content-Type": "application/json" });
		this._xhr.bind("response", this, "model", { converter: this.__responseConverter });
	},

	members: {
		_xhr: null,

		send: function(params, listener, self) {
			params = qx.util.Serializer.toNativeObject(params);
			params = qx.lang.Json.stringify(params);
			listener = listener || qx.lang.Function.empty;
			self = self || this;

			this._xhr.setRequestData(params);
			this._xhr.addListenerOnce("success", function(e) {
				var response = this.__responseConverter(e.getTarget().getResponse());
				listener.call(self, response);
			}, this);
			this._xhr.send();
		},

		__responseConverter: function(value) {
			return qx.data.marshal.Json.createModel(value);
		}
	}
});