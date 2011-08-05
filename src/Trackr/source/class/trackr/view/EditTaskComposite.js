qx.Class.define("trackr.view.EditTaskComposite", {
	extend: qx.ui.container.Composite,

	implement: [trackr.IDocument],

	properties: {
		model: { nullable: true, event: "changeModel" }
	},

	construct: function (taskId) {
		this.base(arguments);

		this._setLayout(new qx.ui.layout.VBox(10));

		var idField = new qx.ui.form.TextField();

		var numberField = new qx.ui.form.Spinner();

		var titleField = new qx.ui.form.TextField();
		titleField.setRequired(true);

		var descriptionField = new qx.ui.form.TextArea();

		var commentField = new qx.ui.form.TextArea();

		var commentsList = new qx.ui.form.List();
		var commentsController = new qx.data.controller.List(null, commentsList, "text");

		var stateComboBox = new qx.ui.form.SelectBox(); // support qx.ui.core.ISingleSelection
		var statesController = new qx.data.controller.List(null, stateComboBox);
		statesController.setDelegate({
			bindItem: function (controller, item, index) {
				controller.bindProperty("id", "model", null, item, index);
				controller.bindProperty("description", "label", controller.getLabelOptions(), item, index);
			}
		});

		this._toolBarPart = new qx.ui.toolbar.Part();
		var saveButton = new qx.ui.toolbar.Button("Save", "icon/16/actions/help-about.png");
		saveButton.addListener("execute", this.__saveTask, this);
		this._toolBarPart.add(saveButton);

		var controller = new qx.data.controller.Object();
		controller.addTarget(idField, "value", "id", true);
		controller.addTarget(numberField, "value", "number", true);
		controller.addTarget(titleField, "value", "title", true);
		controller.addTarget(descriptionField, "value", "description", true);
		controller.addTarget(commentField, "value", "comment", true);
		controller.addTarget(commentsController, "model", "comments", true);
		controller.addTarget(statesController, "model", "states", true);
		controller.addTarget(statesController, "selection[0]", "stateId", true);

		this.bind("model", controller, "model");

		var headerComposite = new qx.ui.container.Composite(new qx.ui.layout.Grid(10, 10).setColumnFlex(3, 1));
		headerComposite.add(new qx.ui.basic.Label("Number"), { row: 0, column: 0 });
		headerComposite.add(numberField, { row: 0, column: 1 });
		headerComposite.add(new qx.ui.basic.Label("Title"), { row: 0, column: 2 });
		headerComposite.add(titleField, { row: 0, column: 3 });
		headerComposite.add(new qx.ui.basic.Label("State"), { row: 1, column: 0 });
		headerComposite.add(stateComboBox, { row: 1, column: 1 });
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

		this.__loadTask(taskId);
	},

	members: {
		_errorWidget: null,
		_toolBarPart: null,

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

		__loadTask: function (taskId) {
			var req = new trackr.data.Request("Trackr.TaskRepository", "Load").set({
				requestConverter: trackr.data.Request.TO_NATIVE_CONVERTER,
				responseConverter: trackr.data.Request.TO_MODEL_CONVERTER
			});
			req.send({ taskId: taskId }, function (response) {
				this.setModel(response);
			}, this);
		},

		__saveTask: function () {
			var req = new trackr.data.Request("Trackr.TaskRepository", "Save").set({
				requestConverter: trackr.data.Request.TO_NATIVE_CONVERTER,
				responseConverter: trackr.data.Request.TO_MODEL_CONVERTER
			});
			req.send({ task: this.getModel() }, function (response) {
				this.__setErrors(response.getErrors());
			}, this);
		},

		// override trackr.IDocument
		getDocumentToolBarPart: function () {
			return this._toolBarPart;
		},

		// override trackr.IDocument
		getDocumentTitle: function () {
			return "Task #";
		},

		// override trackr.IDocument
		getDocumentIcon: function () {
			return "icon/16/actions/help-about.png";
		}
	}
});