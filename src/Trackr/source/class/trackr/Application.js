/* ************************************************************************
 #asset(trackr/*)
 #asset(qx/icon/Tango/16/actions/help-about.png)
 #asset(qx/icon/Tango/22/actions/system-search.png)
 ************************************************************************ */
qx.Class.define("trackr.Application", {
	extend: qx.application.Standalone,

	members: {
		__commands: {},
		__tabView: null,
		__toolbar: null,

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

			this.__toolbar = new qx.ui.toolbar.ToolBar();
			this.__toolbar.add(new qx.ui.toolbar.Button("Search Task", "icon/22/actions/system-search.png", this.getCommand("searchTasks")));

			dockLayoutComposite.add(this.__toolbar, { edge: "north" });

			this.__tabView = new qx.ui.tabview.TabView();
			this.__tabView.addListener("changeSelection", function (e) {
				this._switchPage(e.getOldData()[0], e.getData()[0]);
			}, this);
			var welcomePage = new qx.ui.tabview.Page("Welcome", "icon/16/actions/help-about.png");
			welcomePage.setLayout(new qx.ui.layout.VBox());
			welcomePage.add(new qx.ui.basic.Label("Welcome to Trackr!"));
			this.__tabView.add(welcomePage);
			dockLayoutComposite.add(this.__tabView, { edge: "center" });

			this.getRoot().add(dockLayoutComposite, { edge: 0 });
		},

		_switchPage: function (oldPage, newPage) {
			var oldPageToolbarPart = oldPage ? oldPage.getUserData("trackr.IDocument#documentToolBarPart") : null;
			var newPageToolbarPart = newPage ? newPage.getUserData("trackr.IDocument#documentToolBarPart") : null;
			if (oldPageToolbarPart) {
				this.__toolbar.remove(oldPageToolbarPart);
			}
			if (newPageToolbarPart) {
				this.__toolbar.add(newPageToolbarPart);
			}
		},

		_createCommands: function () {
			this.__commands.searchTasks = new qx.ui.core.Command("Control+F");
			this.__commands.searchTasks.addListener("execute", function () {
				var searchTaskComposite = new trackr.view.SearchTaskComposite();
				searchTaskComposite.addListener("taskSelected", this._searchTaskComposite_taskSelected, this);
				this.__addTabviewPage(searchTaskComposite);
			}, this);
		},

		__addTabviewPage: function (layoutItem) {
			var page = new qx.ui.tabview.Page("Unknown", "icon/16/actions/help-about.png");
			page.setShowCloseButton(true);
			page.setLayout(new qx.ui.layout.Canvas());
			page.add(layoutItem, { edge: 0 });
			if (qx.Class.hasInterface(layoutItem.constructor, trackr.IDocument)) {
				page.setLabel(layoutItem.getDocumentTitle());
				page.setIcon(layoutItem.getDocumentIcon());
				page.setUserData("trackr.IDocument#documentToolBarPart", layoutItem.getDocumentToolBarPart());
			}
			this.__tabView.add(page);
			this.__tabView.setSelection([page]);
		},

		_searchTaskComposite_taskSelected: function (e) {
			var taskId = e.getData();
			var etc = new trackr.view.EditTaskComposite(taskId);
			this.__addTabviewPage(etc);
		}
	}
});