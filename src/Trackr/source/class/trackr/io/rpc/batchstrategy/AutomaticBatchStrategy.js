qx.Class.define("trackr.io.rpc.batchstrategy.AutomaticBatchStrategy", {
	extend: qx.core.Object,

	implement: [trackr.io.rpc.batchstrategy.IBatchStrategy],

	construct: function (rpcFactory) {
		this.__rpcFactory = rpcFactory;
	},

	properties: {
		milliseconds: { nullable: false, check: "Integer", init: 10 }
	},

	members: {
		__rpcFactory: null,
		__timerId: null,
		// @override trackr.data.IBatchStrategy
		rpcQueued: function () {
			if (this.__timerId === null) {
				this.__timerId = qx.util.TimerManager.getInstance().start(this.__timerCallback, null, this, null, this.getMilliseconds());
			}
		},
		// @override trackr.data.IBatchStrategy
		queueCleared: function () {
			if (this.__timerId !== null) {
				qx.util.TimerManager.getInstance().stop(this.__timerId);
				this.__timerId = null;
			}
		},
		__timerCallback: function () {
			this.__timerId = null;
			this.__rpcFactory.invoke();
		}
	}
});