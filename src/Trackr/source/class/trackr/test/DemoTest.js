qx.Class.define("trackr.test.DemoTest", {
	extend: qx.dev.unit.TestCase,

	members: {
		testSimple: function () {
			this.assertEquals(4, 3 + 1, "This should never fail!");
			this.assertFalse(false, "Can false be true?!");
		},

		testAdvanced: function () {
			var a = 3;
			var b = a;
			this.assertIdentical(a, b, "A rose by any other name is still a rose");
			this.assertInRange(3, 1, 10, "You must be kidding, 3 can never be outside [1,10]!");
		},

		"test: should do json encoded request with qx.io.request": function () {
			var req = new qx.io.request.Xhr("/rpc?class=Trackr.TaskInfoRepository&method=GetAll", "PUT");
			req.setRequestHeaders({ "Content-Type": "application/json" });
			req.setRequestData(qx.lang.Json.stringify({ "par": "Hello world" }));

			req.addListener("success", function (e) {
				this.resume(function () {
					this.assertEquals(200, e.getTarget().getStatus());
				}, this);
			},
			this);

			req.send();

			this.wait(1000);
		},

		"test: should do json encoded request with qx.io.remote": function () {
			var req = new qx.io.remote.Request("/rpc?class=Trackr.TaskInfoRepository&method=GetAll", "POST", "application/json");
			req.setRequestHeader("Content-Type", "application/json");
			req.setData(qx.lang.Json.stringify({ "par": "Hello world" }));

			req.addListener("completed", function (e) {
				this.resume(function () {
					var response = e.getContent();
					//this.assertEquals(200, e.getTarget().getStatus());
				}, this);
			},
			this);

			req.send();

			this.wait(1000);
		},

		"test: should create nested objects": function () {
			var model = qx.data.marshal.Json.createModel({
				id: 1,
				details: [{
					id: 2
				}, {
					id: 3
				}]
			}, true);
			
			this.assertEquals(2, model.getDetails().length);
		},

		"test: should serialize nested objects": function () {
			var model = qx.data.marshal.Json.createModel({
				id: 1,
				details: [{
					id: 2
				}, {
					id: 3
				}]
			}, true);

			var json = qx.lang.Json.stringify(qx.util.Serializer.toNativeObject(model));
			
			this.assertEquals('{"id":1,"details":[{"id":2},{"id":3}]}', json);
		}
	}
});