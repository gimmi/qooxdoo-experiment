qx.Class.define("trackr.test.io.rpc.RpcFactoryTest", {
	extend: qx.dev.unit.TestCase,

	members: {
		"test: should do rpc request": function () {
			var factory = new trackr.io.rpc.RpcFactory("/jsonrpc2");
			var rpc = factory.create();
			rpc.setMethod("");
			rpc.setParams({});
			rpc.addListener("success", function (e) {

			}, this);
			rpc.send();
		}
	}
});