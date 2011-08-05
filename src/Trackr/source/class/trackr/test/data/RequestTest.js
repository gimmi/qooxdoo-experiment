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

		"test: should invoke the expected url": function () {
			var method, url;
			this.getServer().respondWith(/.*/, function (xhr) {
				url = xhr.url;
				method = xhr.method;
				xhr.respond();
			});

			this.__target.send(null);

			this.getServer().respond();
			this.assertEquals("PUT", method);
			this.assertEquals("/rpc?class=Class&method=Method", url);
		},

		"test: should set response": function () {
			this.getServer().respondWith([200, { "Content-Type": "application/json" }, '123']);

			this.__target.send(null);

			this.getServer().respond();
			this.assertEquals(123, this.__target.getResponse());
		},

		"test: should call callback": function () {
			this.getServer().respondWith([200, { "Content-Type": "application/json" }, '123']);
			var callback = this.spy();
			var scope = {};

			this.__target.send(null, callback, scope);

			this.getServer().respond();
			this.assert(1, callback.callCount);
			this.assertIdentical(scope, callback.getCall(0).thisValue);
			this.assert(callback.getCall(0).calledWithExactly(123));
		},

		"test: should convert response": function () {
			this.getServer().respondWith([200, { "Content-Type": "application/json" }, '123']);
			this.__target.setResponseConverter(function (value) {
				return "Converted " + value;
			});
			var callback = this.spy();

			this.__target.send(null, callback);

			this.getServer().respond();
			this.assertEquals("Converted 123", this.__target.getResponse());
			this.assert(callback.calledWith("Converted 123"));
		}
	}
});