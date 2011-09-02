qx.Class.define("trackr.io.rpc.batchstrategy.ManualBatchStrategy", {
	extend: qx.core.Object,

	implement: [trackr.io.rpc.batchstrategy.IBatchStrategy],

	members: {
		// @override trackr.io.rpc.IBatchStrategy
		rpcQueued: function () {
		},
		// @override trackr.io.rpc.IBatchStrategy
		queueCleared: function() {
		}
	}
});