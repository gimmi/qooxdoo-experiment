qx.Class.define("trackr.test.DemoTest", {
	extend : qx.dev.unit.TestCase,

	members : {
		testSimple : function() {
			this.assertEquals(4, 3 + 1, "This should never fail!");
			this.assertFalse(false, "Can false be true?!");
		},

		testAdvanced : function() {
			var a = 3;
			var b = a;
			this.assertIdentical(a, b, "A rose by any other name is still a rose");
			this.assertInRange(3, 1, 10, "You must be kidding, 3 can never be outside [1,10]!");
		}
	}
});