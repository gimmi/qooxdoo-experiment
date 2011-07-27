qx.Class.define("trackr.view.EditTaskComposite", {
	extend: qx.ui.container.Composite,

	construct: function (taskId) {
		this.base(arguments);

		this._taskId = taskId;
		var mainGridLayout = new qx.ui.layout.Grid(10, 10);
		mainGridLayout.setColumnFlex(3, 1);
		mainGridLayout.setRowFlex(2, 1);
		this._setLayout(mainGridLayout);

		var idField = new qx.ui.form.TextField();

		var numberField = new qx.ui.form.Spinner();

		var titleField = new qx.ui.form.TextField();

		var descriptionField = new qx.ui.form.TextArea();

		var saveButton = new qx.ui.form.Button("Save");
		saveButton.addListener("execute", this.__saveTask, this);

		this._controller = new qx.data.controller.Object();
		this._controller.addTarget(idField, "value", "id", true);
		this._controller.addTarget(numberField, "value", "number", true);
		this._controller.addTarget(titleField, "value", "title", true);
		this._controller.addTarget(descriptionField, "value", "description", true);
		
		this._validationManager = new qx.ui.form.validation.Manager();

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
		_validationManager: null,

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
			if (!this._validationManager.validate()) {
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
					this._validationManager.setInvalidMessage(response.message);
				}
			}, this);

			req.send();
		}
	}
});