qx.Class.define("trackr.view.EditTaskComposite", {
	extend: qx.ui.container.Composite,

	construct: function(taskId) {
		this.base(arguments);

		this._taskId = taskId;

		var form = this.__createForm();

		this._controller = new qx.data.controller.Form(null, form);

		this._setLayout(new qx.ui.layout.Canvas());
		this._add(new qx.ui.form.renderer.Single(form), { left: 10, top: 10 });

		this.__loadTask();
	},

	members: {
		_taskId: null,
		_store: null,
		_controller: null,

		__loadTask: function() {
			if (this._store) {
				this._store.reload();
				return;
			}
			this._store = new qx.data.store.Json("/rpc?class=Trackr.TaskRepository&method=Get", {
				configureRequest: qx.lang.Function.bind(function(req) {
					req.setMethod("PUT");
					req.setRequestHeaders({ "Content-Type": "application/json" });
					req.setRequestData(qx.lang.Json.stringify({ taskId: this._taskId }));
				}, this)
			});
			this._store.bind("model", this._controller, "model");
		},

		__createForm: function() {
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