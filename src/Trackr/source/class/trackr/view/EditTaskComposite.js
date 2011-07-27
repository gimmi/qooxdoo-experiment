qx.Class.define("trackr.view.EditTaskComposite", {
	extend: qx.ui.container.Composite,

	construct: function(taskId) {
		this.base(arguments);

		this._taskId = taskId;

		var form = new qx.ui.form.Form();

		var idField = new qx.ui.form.TextField();
		form.add(idField, "Id", null, "id");

		var numberField = new qx.ui.form.Spinner();
		form.add(numberField, "Number", null, "number");

		var titleField = new qx.ui.form.TextField();
		form.add(titleField, "Title", null, "title");

		var descriptionField = new qx.ui.form.TextArea();
		form.add(descriptionField, "Description", null, "description");

		this._controller = new qx.data.controller.Form(null, form);

		this._setLayout(new qx.ui.layout.VBox(10));
		this._add(new qx.ui.form.renderer.Single(form), { flex: 0 });

		var tabView = new qx.ui.tabview.TabView();
		var descriptionTabPage = new qx.ui.tabview.Page("Description", "icon/16/actions/help-about.png");
		descriptionTabPage.setLayout(new qx.ui.layout.Canvas());
		descriptionTabPage.add(descriptionField, { edge: 0 });
		tabView.add(descriptionTabPage);
		this._add(tabView, { flex: 1 });

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
		}
	}
});