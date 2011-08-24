qx.Class.define("trackr.view.FilesWindow", {
	extend: qx.ui.window.Window,
	construct: function() {
		this.base(arguments, "File selector", "icon/22/actions/system-search.png");
		this.setModal(true);
		this.setShowMaximize(false);
		this.setShowMinimize(false);
		this.setWidth(250);
		this.setHeight(300);
		this.setLayout(new qx.ui.layout.VBox(5));
		this.add(new qx.ui.core.Widget().set({ decorator: "main", backgroundColor: "green" }), { flex: 1 });
		this.add(new qx.ui.core.Widget().set({ decorator: "main", backgroundColor: "red" }));
	}
});