qx.Class.define("trackr.simulation.DemoSimulation", {
	extend : simulator.unit.TestCase,

	members : {
		testButtonPresent : function() {
			this.assertNotNull(this.getSimulation().getWidgetOrNull("qxh=qx.ui.form.Button"), "Button widget not present!");
		},

		testButtonClick : function() {
			this.getQxSelenium().qxClick("qxh=qx.ui.form.Button");
			this.assertEquals("true", String(this.getQxSelenium().isAlertPresent()));
		}
	}
});