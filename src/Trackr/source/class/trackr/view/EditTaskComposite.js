qx.Class.define("trackr.view.EditTaskComposite", {
	extend: qx.ui.container.Composite,

	construct: function (taskId) {
		this.base(arguments);

		this._taskId = taskId;
		this._setLayout(new qx.ui.layout.VBox(10));

		this._errorWidget = new qx.ui.basic.Label("Errors").set({
			backgroundColor: "red",
			decorator: new qx.ui.decoration.Single(3, "solid", "black")
		});

		this._errorWidget = new qx.ui.core.Widget().set({
			backgroundColor: "red",
			decorator: new qx.ui.decoration.Single(3, "solid", "black"),
			minHeight: 200
		});
		this._errorWidget = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
		this._errorWidget.setBackgroundColor("red");
		this._errorWidget.setPadding(10, 10, 10, 10);
		this._errorWidget.setDecorator(new qx.ui.decoration.Single(3, "solid", "black"));
		this._errorWidget.add(new qx.ui.basic.Label("Errors"));
		this._errorWidget.add(new qx.ui.basic.Label("Errors"));
		this._errorWidget.add(new qx.ui.basic.Label("Errors"));
		this._add(this._errorWidget, { flex: 0 });

		var idField = new qx.ui.form.TextField();

		var numberField = new qx.ui.form.Spinner();

		var titleField = new qx.ui.form.TextField();
		titleField.setRequired(true);

		var descriptionField = new qx.ui.form.TextArea();

		var saveButton = new qx.ui.form.Button("Save");
		saveButton.addListener("execute", this.__saveTask, this);

		this._controller = new qx.data.controller.Object();
		this._controller.addTarget(idField, "value", "id", true);
		this._controller.addTarget(numberField, "value", "number", true);
		this._controller.addTarget(titleField, "value", "title", true);
		this._controller.addTarget(descriptionField, "value", "description", true);

		this._validationManager = new qx.ui.form.validation.Manager();
		this._validationManager.add(idField);
		this._validationManager.add(numberField);
		this._validationManager.add(titleField);
		this._validationManager.add(descriptionField);
		this._validationManager.addListener("changeValid", function (e) {
			alert(e.getTarget().getInvalidMessage());
		}, this);

		var headerComposite = new qx.ui.container.Composite();
		headerComposite.setLayout(new qx.ui.layout.Grid(10, 10).setColumnFlex(3, 1));
		headerComposite.add(new qx.ui.basic.Label("Number"), { row: 0, column: 0 });
		headerComposite.add(numberField, { row: 0, column: 1 });
		headerComposite.add(new qx.ui.basic.Label("Title"), { row: 0, column: 2 });
		headerComposite.add(titleField, { row: 0, column: 3 });
		headerComposite.add(saveButton, { row: 1, column: 0 });
		this._add(headerComposite, { flex: 0 });

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
		_validationManager: null,
		_errorWidget: null,

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
			// this._errorWidget.setVisibility("excluded");
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