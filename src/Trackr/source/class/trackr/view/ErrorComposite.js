qx.Class.define("trackr.view.ErrorComposite", {
	extend: qx.ui.container.Composite,

	properties: {
		errors: {
			init: [],
			apply: "_applyErrors"
		}
	},

	construct: function () {
		this.base(arguments);

		this._setLayout(new qx.ui.layout.VBox(10));

		this.setBackgroundColor("red");
		this.setPadding(10, 10, 10, 10);
		this.setDecorator(new qx.ui.decoration.Single(3, "solid", "black"));
	},

	members: {
		_applyErrors: function (value, old) {
			this.removeAll();
			value.forEach(function(error) {
				this.add(new qx.ui.basic.Label(error));
			}, this);
		}
	}
});