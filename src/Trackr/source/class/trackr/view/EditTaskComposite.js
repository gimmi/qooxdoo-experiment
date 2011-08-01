qx.Class.define("trackr.view.EditTaskComposite", {
	extend: qx.ui.container.Composite,

	construct: function (taskId) {
		this.base(arguments);

		this._taskId = taskId;
		this._setLayout(new qx.ui.layout.VBox(10));

		var idField = new qx.ui.form.TextField();

		var numberField = new qx.ui.form.Spinner();

		var titleField = new qx.ui.form.TextField();
		titleField.setRequired(true);

		var descriptionField = new qx.ui.form.TextArea();

		var commentField = new qx.ui.form.TextArea();

		var commentsList = new qx.ui.form.List();
		var commentsController = new qx.data.controller.List(null, commentsList, "text");
		
		var buttons = new qx.ui.container.Composite(new qx.ui.layout.HBox(10));
		var saveButton = new qx.ui.form.Button("Save", "icon/16/actions/help-about.png");
		saveButton.addListener("execute", this.__saveTask, this);
		buttons.add(saveButton, { flex: 0 });
		this._add(buttons, { flex: 0 });

		this._controller = new qx.data.controller.Object();
		this._controller.addTarget(idField, "value", "id", true);
		this._controller.addTarget(numberField, "value", "number", true);
		this._controller.addTarget(titleField, "value", "title", true);
		this._controller.addTarget(descriptionField, "value", "description", true);
		this._controller.addTarget(commentField, "value", "comment", true);
		this._controller.addTarget(commentsController, "model", "comments", true);

		var headerComposite = new qx.ui.container.Composite(new qx.ui.layout.Grid(10, 10).setColumnFlex(3, 1));
		headerComposite.add(new qx.ui.basic.Label("Number"), { row: 0, column: 0 });
		headerComposite.add(numberField, { row: 0, column: 1 });
		headerComposite.add(new qx.ui.basic.Label("Title"), { row: 0, column: 2 });
		headerComposite.add(titleField, { row: 0, column: 3 });
		this._add(headerComposite, { flex: 0 });

		var tabView = new qx.ui.tabview.TabView();
		var descriptionTabPage = new qx.ui.tabview.Page("Comments", "icon/16/actions/help-about.png");
		descriptionTabPage.setLayout(new qx.ui.layout.Canvas());
		descriptionTabPage.add(descriptionField, { edge: 0 });
		tabView.add(descriptionTabPage);
		var commentsTabPage = new qx.ui.tabview.Page("Description", "icon/16/actions/help-about.png");
		commentsTabPage.setLayout(new qx.ui.layout.Canvas());
		var splitPane = new qx.ui.splitpane.Pane("vertical");
		splitPane.add(commentsList, 1);
		splitPane.add(commentField, 0);
		commentsTabPage.add(splitPane, { edge: 0 });
		tabView.add(commentsTabPage);
		this._add(tabView, { flex: 1 });

		this.__loadTask();
	},

	members: {
		_taskId: null,
		_store: null,
		_controller: null,
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

		__setErrors: function (errors) {
			if (errors.length === 0) {
				if (this._errorWidget) {
					this.remove(this._errorWidget);
				}
			} else {
				if (!this._errorWidget) {
					this._errorWidget = new trackr.view.ErrorComposite();
					this.addAt(this._errorWidget, 0, { flex: 0 });
				}
				this._errorWidget.setErrors(errors);
			}
		},

		__saveTask: function () {
			var req = new qx.io.request.Xhr("/rpc?class=Trackr.TaskRepository&method=Save", "PUT");
			req.setRequestHeaders({ "Content-Type": "application/json" });
			req.setRequestData(qx.lang.Json.stringify({
				task: qx.util.Serializer.toNativeObject(this._store.getModel())
			}));

			req.addListener("success", function (e) {
				var response = e.getTarget().getResponse();
				this.__setErrors(response.errors);
			}, this);

			req.send();
		}
	}
});