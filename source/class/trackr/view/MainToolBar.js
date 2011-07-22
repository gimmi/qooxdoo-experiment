/* ************************************************************************
 #asset(qx/icon/Tango/22/actions/system-search.png)
 ************************************************************************ */
qx.Class.define("trackr.view.MainToolBar", {
	extend : qx.ui.toolbar.ToolBar,

	construct : function(controller) {
		this.base(arguments);
		this.__searchButton = new qx.ui.toolbar.Button("Search Task", "icon/22/actions/system-search.png");
		this.__searchButton.setCommand(controller.getCommand("searchTasks"));
		this.add(this.__searchButton);
	},

	members: {
		__searchButton: null
	}
});