qx.Class.define("trackr.test.data.RequestTest", {
	extend: qx.dev.unit.TestCase,

	include: [qx.dev.unit.MMock],

	members: {
		__target: null,

		setUp: function () {
			this.useFakeServer();
			this.__target = new trackr.data.Request("Class", "Method");
		},

		tearDown: function () {
			this.getSandbox().restore();
		},

		"test: should notify and set response received from server": function () {
			this.getServer().respondWith("PUT", "/rpc?class=Class&method=Method", [ 200,  { "Content-Type": "application/json" }, '[{"id":12,"comment":"Hey there"}]']);
			this.__target.send({});
			this.getServer().respond();
			this.assertJsonEquals([{ id: 12, comment: "Hey there" }], this.__target.getResponse());
		}
	}
});