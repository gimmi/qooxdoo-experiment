qx.Class.define("trackr.data.TaskInfoDataModel", {
	extend: qx.ui.table.model.Remote,

	construct: function () {
		this.base(arguments);

		this.setColumnIds(["id", "number", "title"]);
		this.setColumns(["Id", "Number", "Title"]);
	},

	members: {
		// override
		_loadRowCount: function () {
			var req = new qx.io.request.Xhr("/rpc?class=Trackr.TicketInfoRepository&method=GetRowCount", "PUT");
			req.setRequestHeaders({ "Content-Type": "application/json" });
			req.setRequestData(qx.lang.Json.stringify({}));

			req.addListener("success", function (e) {
				var rowCount = e.getTarget().getResponse();
				this._onRowCountLoaded(rowCount);
			}, this);

			req.send();
		},

		// override
		_loadRowData: function (firstRow, lastRow) {
			var req = new qx.io.request.Xhr("/rpc?class=Trackr.TicketInfoRepository&method=GetRowData", "PUT");
			req.setRequestHeaders({ "Content-Type": "application/json" });
			req.setRequestData(qx.lang.Json.stringify({
				firstRow: firstRow,
				lastRow: lastRow
			}));

			req.addListener("success", function (e) {
				var rowData = e.getTarget().getResponse();
				this._onRowDataLoaded(rowData);
			}, this);

			req.send();
		}
	}
});