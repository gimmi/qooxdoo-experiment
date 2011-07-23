qx.Class.define("trackr.view.SearchTaskComposite", {
	extend: qx.ui.container.Composite,

	construct: function() {
		this.base(arguments);

		this._setLayout(new qx.ui.layout.VBox(10));
		
		var filterTextField = new qx.ui.form.TextField();

		this._add(filterTextField, { flex: 0 });
		this._add(new qx.ui.table.Table(new trackr.data.TaskInfoDataModel()), { flex: 1 });
	},

	members: {
		
	}
});