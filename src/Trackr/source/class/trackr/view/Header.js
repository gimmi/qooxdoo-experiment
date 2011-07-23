qx.Class.define("trackr.view.Header", {
	extend : qx.ui.container.Composite,

	construct : function() {
		this.base(arguments);

		this.setLayout(new qx.ui.layout.HBox);
		this.setAppearance("app-header");

		var title = new qx.ui.basic.Label("Trackr");
		var version = new qx.ui.basic.Label("built with qooxdoo " + qx.core.Environment.get("qx.version"));
		version.setFont("default");

		this.add(title);
		this.add(new qx.ui.core.Spacer(), { flex : 1 });
		this.add(version);
	}
});