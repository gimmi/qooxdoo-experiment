/* ************************************************************************
 #asset(trackr/*)
 #asset(qx/icon/Tango/16/actions/help-about.png)
 ************************************************************************ */
qx.Class.define("trackr.Application", {
	extend: qx.application.Standalone,

	members: {
		__commands: {},
		__tabView: null,

		main: function () {
			this.base(arguments);

			if (qx.core.Environment.get("qx.debug")) {
				qx.log.appender.Native;
				qx.log.appender.Console;
			}

			this._createCommands();
			this._createLayout();
		},

		getCommand: function (commandId) {
			return this.__commands[commandId];
		},

		_createLayout: function () {
			var dockLayoutComposite = new qx.ui.container.Composite(new qx.ui.layout.Dock());
			dockLayoutComposite.add(new trackr.view.Header(), { edge: "north" });
			dockLayoutComposite.add(new trackr.view.MainToolBar(this), { edge: "north" });

			this.__tabview = new qx.ui.tabview.TabView();
			var welcomePage = new qx.ui.tabview.Page("Welcome", "icon/16/actions/help-about.png");
			welcomePage.setLayout(new qx.ui.layout.VBox());
			welcomePage.add(new qx.ui.basic.Label("Welcome to Trackr!"));
			this.__tabview.add(welcomePage);
			dockLayoutComposite.add(this.__tabview, { edge: "center" });

			this.getRoot().add(dockLayoutComposite, { edge: 0 });
		},

		_createCommands: function () {
			this.__commands.searchTasks = new qx.ui.core.Command("Control+F");
			this.__commands.searchTasks.addListener("execute", function () {
				var page = new qx.ui.tabview.Page("Search Task", "icon/16/actions/help-about.png");
				page.setShowCloseButton(true);
				page.setLayout(new qx.ui.layout.Canvas());
				var searchTaskComposite = new trackr.view.SearchTaskComposite();
				searchTaskComposite.addListener("taskSelected", this._searchTaskComposite_taskSelected, this);
				page.add(searchTaskComposite, { edge: 0 });
				this.__tabview.add(page);
			}, this);
		},

		_searchTaskComposite_taskSelected: function (e) {
			var taskId = e.getData();
			this.debug("DblCliched ticket #" + taskId);
		}
	}
});