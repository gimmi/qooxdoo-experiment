qx.Class.define("trackr.data.TaskInfoDataModel", {
	extend: qx.ui.table.model.Remote,

	construct: function() {
		this.base(arguments);

		this.setColumnIds(["id", "number", "title"]);
		this.setColumns(["Id", "Number", "Title"]);
	},

	members: {
		__filter: "",

		setFilter: function(value) {
			this.__filter = value || "";
		},
		
		// override
		_loadRowCount: function() {
			var req = new trackr.data.Request("Trackr.TaskRepository", "GetRowCount");
			req.send({ filter: this.__filter }, function(rowCount) {
				this._onRowCountLoaded(rowCount);
			}, this);
		},

		// override
		_loadRowData: function(firstRow, lastRow) {
			var req = new trackr.data.Request("Trackr.TaskRepository", "GetRowData");
			req.send({
				filter: this.__filter,
				firstRow: firstRow,
				lastRow: lastRow
			}, function(rowData) {
				this._onRowDataLoaded(rowData);
			}, this);
		}
	}
});