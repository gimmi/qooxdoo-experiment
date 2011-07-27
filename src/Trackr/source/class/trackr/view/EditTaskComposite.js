qx.Class.define("trackr.view.EditTaskComposite", {
	extend: qx.ui.container.Composite,

	construct: function (taskId) {
		this.base(arguments);

		this._taskId = taskId;
		var mainGridLayout = new qx.ui.layout.Grid(10, 10);
		mainGridLayout.setColumnFlex(3, 1);
		mainGridLayout.setRowFlex(2, 1);
		this._setLayout(mainGridLayout);
		
		var form = new qx.ui.form.Form();

		var idField = new qx.ui.form.TextField();
		form.add(idField, "Id", null, "id");

		var numberField = new qx.ui.form.Spinner();
		form.add(numberField, "Number", null, "number");

		var titleField = new qx.ui.form.TextField();
		form.add(titleField, "Title", null, "title");

		var descriptionField = new qx.ui.form.TextArea();
		form.add(descriptionField, "Description", null, "description");

		var saveButton = new qx.ui.form.Button("Save");
		saveButton.addListener("execute", this.__saveTask, this);
		form.addButton(saveButton);

		this._controller = new qx.data.controller.Form(null, form);

		this._add(new qx.ui.basic.Label("Number"), { row: 0, column: 0 });
		this._add(numberField, { row: 0, column: 1 });
		this._add(new qx.ui.basic.Label("Title"), { row: 0, column: 2 });
		this._add(titleField, { row: 0, column: 3 });

		this._add(saveButton, { row: 1, column: 0 });

		var tabView = new qx.ui.tabview.TabView();
		var descriptionTabPage = new qx.ui.tabview.Page("Description", "icon/16/actions/help-about.png");
		descriptionTabPage.setLayout(new qx.ui.layout.Canvas());
		descriptionTabPage.add(descriptionField, { edge: 0 });
		tabView.add(descriptionTabPage);
		this._add(tabView, { row: 2, column: 0, colSpan: 4 });

		this.__loadTask();
	},

	members: {
		_taskId: null,
		_store: null,
		_controller: null,

		__loadTask: function () {
			if (this._store) {
				this._store.reload();
				return;
			}
			this._store = new qx.data.store.Json("/rpc?class=Trackr.TaskRepository&method=Load", {
				configureRequest: qx.lang.Function.bind(function (req) {
					req.setMethod("PUT");
					req.setRequestHeaders({ "Content-Type": "application/json" });
					req.setRequestData(qx.lang.Json.stringify({ taskId: this._taskId }));
				}, this)
			});
			this._store.bind("model", this._controller, "model");
		},

		__saveTask: function () {
			if (!this._controller.getTarget().validate()) {
				alert('invalid');
				return;
			}
			var req = new qx.io.request.Xhr("/rpc?class=Trackr.TaskRepository&method=Save", "PUT");
			req.setRequestHeaders({ "Content-Type": "application/json" });
			req.setRequestData(qx.lang.Json.stringify({
				task: qx.util.Serializer.toNativeObject(this._store.getModel())
			}));

			req.addListener("success", function (e) {
				var response = e.getTarget().getResponse();
				if (!response.success) {
					this._controller.getTarget().getValidationManager().setInvalidMessage(response.message);
				}
			}, this);

			req.send();
		}
	}
});