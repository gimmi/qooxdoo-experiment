/* ************************************************************************
 #asset(trackr/*)
 ************************************************************************ */

qx.Class.define("trackr.Application", {
	extend : qx.application.Standalone,

	members : {
		__commands: {},

		main : function() {
			this.base(arguments);

			if (qx.core.Environment.get("qx.debug")) {
				qx.log.appender.Native;
				qx.log.appender.Console;
			}

			this._createCommands();
			this._createLayout();
		},

		_createLayout : function() {
			var dockLayoutComposite = new qx.ui.container.Composite(new qx.ui.layout.Dock());
			dockLayoutComposite.add(new trackr.view.Header(), { edge : "north" });
			dockLayoutComposite.add(new trackr.view.MainToolBar(this), { edge : "north" });
			dockLayoutComposite.add(this._buildSampleWidget("blue"), { edge : "south" });
			dockLayoutComposite.add(this._buildSampleWidget("green"), { edge : "east" });
			dockLayoutComposite.add(this._buildSampleWidget("yellow"), { edge : "west" });
			dockLayoutComposite.add(this._buildSampleWidget("orange"), { edge : "center" });

			this.getRoot().add(dockLayoutComposite, { edge : 0 });
		},

		_createCommands: function () {
			this.__commands.searchTasks = new qx.ui.core.Command("Control+F");
			this.__commands.searchTasks.addListener("execute", function () {
				this.debug('click');
			}, this);
		},

		getCommand : function(commandId) {
			return this.__commands[commandId];
		},

		_buildSampleWidget : function(color) {
			return new qx.ui.core.Widget().set({
				backgroundColor : color,
				decorator       : new qx.ui.decoration.Single(3, "solid", "black")
			});
		}
	}
});