qx.Class.define("trackr.io.rpc.Rpc", {
	extend: qx.core.Object,
	construct: function (factory) {
		this._factory = factory;
		this._factory.addListener("rpcResult", this.__onFactoryRpcResult, this);
		this._factory.addListener("rpcError", this.__onFactoryRpcError, this);
		this._factory.addListener("ioError", this.__onFactoryIoError, this);
		this.initParams([]);
	},

	properties: {
		method: { nullable: false, check: "String", init: "method" },
		params: { nullable: false, deferredInit: true }
	},

	events: {
		success: "qx.event.type.Data",
		error: "qx.event.type.Event"
	},

	members: {
		_id: null,
		_factory: null,
		__onFactoryRpcResult: function (e) {
			var response = e.getData();
			if (response.id === this._id) {
				this.fireDataEvent("success", response.result);
			}
		},
		__onFactoryRpcError: function (e) {
			var response = e.getData();
			if (response.id === this._id) {
				this.fireEvent("error");
			}
		},
		__onFactoryIoError: function () {
			this._id = null;
			this.fireEvent("error");
		},
		send: function () {
			// TODO check for this._id === null
			this._id = this._factory.queue(this.getMethod(), this.getParams());
		}
	}
});