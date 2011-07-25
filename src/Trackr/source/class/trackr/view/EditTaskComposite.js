qx.Class.define("trackr.view.EditTaskComposite", {
	extend: qx.ui.container.Composite,

	construct: function (taskId) {
		this.base(arguments);

		this._taskId = taskId;

		this._setLayout(new qx.ui.layout.VBox());
		this._add(new qx.ui.basic.Label("Edit task #" + taskId));
	},

	members: {
		_taskId: null
	}
});