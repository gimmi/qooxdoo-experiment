qx.Class.define("trackr.view.SearchTaskWidget", {
	extend: qx.ui.core.Widget,

	construct: function () {
		this.base(arguments);

		this._setLayout(new qx.ui.layout.Dock());

		this._createChildControl("grid");
	},

	members: {
		// overridden
		_createChildControlImpl : function(id) {
			var control;

			switch (id) {
				case "grid":
					control = this._buildSampleWidget("red");
					this._add(control, { edge : "center" });
					break;
			}

			return control || this.base(arguments, id);
		},

		_buildSampleWidget : function(color) {
			return new qx.ui.core.Widget().set({
				backgroundColor : color,
				decorator       : new qx.ui.decoration.Single(3, "solid", "black")
			});
		}
	}
});