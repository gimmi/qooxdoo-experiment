qx.Class.define("trackr.io.rpc.batchstrategy.NoBatchStrategy", {
	extend: qx.core.Object,

	implement: [trackr.io.rpc.batchstrategy.IBatchStrategy],

	construct: function (rpcFactory) {
		this.__rpcFactory = rpcFactory;
	},

	members: {
		__rpcFactory: null,
		// @override trackr.io.rpc.batchstrategy.IBatchStrategy
		rpcQueued: function () {
			this.__rpcFactory.invoke();
		},
		// @override trackr.io.rpc.batchstrategy.IBatchStrategy
		queueCleared: function () {
		}
	}
});