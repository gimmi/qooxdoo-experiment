qx.Class.define("trackr.view.SearchTaskComposite", {
	extend: qx.ui.container.Composite,

	construct: function() {
		this.base(arguments);

		this._setLayout(new qx.ui.layout.Dock());

		this._add(new qx.ui.table.Table(new trackr.data.TaskInfoDataModel()), { edge: "center" });
	},

	members: {
		
	}
});