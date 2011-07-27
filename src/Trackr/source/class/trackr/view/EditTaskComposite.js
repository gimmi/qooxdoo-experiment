qx.Class.define("trackr.view.EditTaskComposite", {
	extend: qx.ui.container.Composite,

	construct: function (taskId) {
		this.base(arguments);

		this._taskId = taskId;

		var form = this.__createForm();

		var store = new qx.data.store.Json("/rpc?class=Trackr.TaskRepository&method=Get", {
			configureRequest: function (req) {
				req.setMethod("PUT");
				req.setRequestHeaders({ "Content-Type": "application/json" });
				req.setRequestData(qx.lang.Json.stringify({ taskId: taskId }));
			}
		});

		var controller = new qx.data.controller.Form(null, form);

		store.bind("model", controller, "model");

		this._setLayout(new qx.ui.layout.Canvas());
		this._add(new qx.ui.form.renderer.Single(form), { left: 10, top: 10 });
	},

	members: {
		_taskId: null,

		__createForm: function () {
			var form = new qx.ui.form.Form();

			var id = new qx.ui.form.TextField();
			form.add(id, "Id", null, "id");

			var number = new qx.ui.form.Spinner();
			form.add(number, "Number", null, "number");

			var title = new qx.ui.form.TextField();
			form.add(title, "Title", null, "title");

			return form;
		}
	}
});