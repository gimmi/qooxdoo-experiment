qx.Class.define("trackr.view.SearchTaskWidget", {
	extend: qx.ui.core.Widget,

	construct: function () {
		this.base(arguments);

		this._setLayout(new qx.ui.layout.Dock());

		this._add(new qx.ui.table.Table(), { edge : "north" });
		this._createChildControl("table");
	},

	members: {
		// overridden
		_createChildControlImpl : function(id) {
			var control;

			switch (id) {
				case "table":
					control = new qx.ui.table.Table();
					this._add(control, { edge : "center" });
					break;
			}

			return control || this.base(arguments, id);
		}
	}
});