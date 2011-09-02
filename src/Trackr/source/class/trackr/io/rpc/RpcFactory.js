qx.Class.define("trackr.io.rpc.RpcFactory", {
	extend: qx.core.Object,
	construct: function (url) {
		this._nextId = 0;
		this._queue = [];
		this.initUrl(url);
		this.initBatchStrategy(new trackr.io.rpc.batchstrategy.AutomaticBatchStrategy(this));
	},

	properties: {
		url: { nullable: false, check: "String", deferredInit: true },
		batchStrategy: { nullable: false, check: "trackr.io.rpc.batchstrategy.IBatchStrategy", deferredInit: true }
	},

	events: {
		rpcResult: "qx.event.type.Data",
		rpcError: "qx.event.type.Data",
		ioError: "qx.event.type.Event"
	},

	members: {
		_nextId: null,
		_queue: null,
		create: function () {
			return new trackr.io.rpc.Rpc(this);
		},
		queue: function (method, params) {
			var id = this._nextId;
			this._nextId += 1;
			this._queue.push({
				jsonrpc: "2.0",
				id: id,
				method: method,
				params: params
			});
			this.getBatchStrategy().rpcQueued();
			return id;
		},
		invoke: function () {
			var request = new qx.io.request.Xhr();
			request.setMethod("POST");
			request.setUrl(this.getUrl());
			request.setRequestHeaders({ "Content-Type": "application/json" });
			request.setRequestData(qx.lang.Json.stringify(this._queue));
			request.addListenerOnce("success", function (e) {
				var responses = (qx.lang.Type.isArray(e.getData()) ? e.getData() : [e.getData()]);
				responses.forEach(function (response) {
					if (qx.lang.Type.isObject(response.error)) {
						this.fireDataEvent("rpcError", {
							id: response.id,
							code: response.error.code,
							message: response.error.message,
							data: response.error.data
						});
					} else {
						this.fireDataEvent("rpcResult", {
							id: response.id,
							result: response.result
						});
					}
				}, this);
			}, this);
			request.addListenerOnce("error", function () {
				this.fireEvent("ioError");
			}, this);
			request.send();
			this._queue.length = 0;
			this.getBatchStrategy().queueCleared();
		}
	}
});