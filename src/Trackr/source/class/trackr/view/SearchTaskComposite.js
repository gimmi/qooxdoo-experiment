qx.Class.define("trackr.view.SearchTaskComposite", {
	extend: qx.ui.container.Composite,

	construct: function () {
		this.base(arguments);

		this._setLayout(new qx.ui.layout.VBox(10));

		var filterComposite = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 0)
				.setColumnAlign(0, "left", "middle")
				.setColumnAlign(1, "left", "middle")
				.setColumnAlign(2, "left", "middle"));
		filterComposite.add(new qx.ui.basic.Label("Filter:"), { row: 0, column: 0 });
		this._filterTextField = new qx.ui.form.TextField();
		this._filterTextField.setWidth(300);
		filterComposite.add(this._filterTextField, { row: 0, column: 1 });
		var filterButton = new qx.ui.form.Button("Apply/refresh");
		filterButton.addListener("execute", this._filterButtonExecute, this);
		filterComposite.add(filterButton, { row: 0, column: 2 });

		this._add(filterComposite, { flex: 0 });
		this._taskInfoDataModel = new trackr.data.TaskInfoDataModel();
		var table = new qx.ui.table.Table(this._taskInfoDataModel);
		table.setStatusBarVisible(false);
		table.setShowCellFocusIndicator(false);
		table.setColumnWidth(2, 300);
		table.addListener("cellDblclick", this._table_cellDblClick, this);
		this._add(table, { flex: 1 });
	},

	events: {
		"taskSelected": "qx.event.type.Data"
	},

	members: {
		_taskInfoDataModel: null,

		_filterTextField: null,

		_filterButtonExecute: function (e) {
			this._taskInfoDataModel.setFilter(this._filterTextField.getValue());
			this._taskInfoDataModel.reloadData();
		},

		_table_cellDblClick: function (e) {
			var rowIndex = e.getRow();
			var taskId = this._taskInfoDataModel.getValueById("id", rowIndex);
			this.fireDataEvent("taskSelected", taskId);
		}
	},

	destruct: function () {
		this._disposeObjects("_taskInfoDataModel");
	}
});