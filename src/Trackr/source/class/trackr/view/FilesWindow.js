/*
   #asset(qx/icon/Tango/22/actions/list-add.png)
   #asset(qx/icon/Tango/22/actions/list-remove.png)
   #asset(qx/icon/Tango/22/actions/document-open.png)
*/
qx.Class.define("trackr.view.FilesWindow", {
	extend: qx.ui.window.Window,

	construct: function (files) {
		this.base(arguments, "File selector", "icon/22/actions/system-search.png");
		this.setModal(true);
		this.setShowMaximize(false);
		this.setShowMinimize(false);
		this.setWidth(250);
		this.setHeight(300);
		this.setLayout(new qx.ui.layout.HBox(10));

		this.__blocker = new qx.ui.core.Blocker(this);
		this.__blocker.setColor("#D5D5D5");
		this.__blocker.setOpacity(0.5);

		var fileList = new qx.ui.form.List();
		this.__fileListController = new qx.data.controller.List(files, fileList, "name");
		this.add(fileList, { flex: 1 });

		var actionsComposite = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
		var openButton = new qx.ui.form.Button("Open", 'icon/22/actions/document-open.png');
		openButton.addListener("execute", this.__openFile, this);
		actionsComposite.add(openButton);
		actionsComposite.add(this.__buildFileUploadWidget());
		var removeButton = new qx.ui.form.Button("Remove", 'icon/22/actions/list-remove.png');
		actionsComposite.add(removeButton);
		this.add(actionsComposite);
	},

	members: {
		__fileListController: null,
		__blocker: null,
		__openFile: function () {
			if (!this.__fileListController.getSelection().getLength()) {
				return;
			}
			var file = this.__fileListController.getSelection().getItem(0);
			var url = qx.util.Uri.appendParamsToUrl("/file", {
				id: file.getId(),
				name: file.getName(), 
				type: file.getMimeType()
			});
			window.open(url, "_blank");
		},
		__buildFileUploadWidget: function () {
			var uploadForm = new uploadwidget.UploadForm('uploadFrm', qx.core.Environment.get("trackr.serverrootpath") + 'file');
			uploadForm.setLayout(new qx.ui.layout.Canvas());

			var uploadButton = new uploadwidget.UploadButton('file', 'Upload', 'icon/22/actions/list-add.png');
			uploadForm.add(uploadButton, { edge: 0 });

			uploadForm.addListener('completed', function (e) {
				this.__blocker.unblock();
				uploadForm.clear();
				var metadata = qx.lang.Json.parse(uploadForm.getIframeTextContent());
				this.debug(metadata);
			}, this);

			uploadForm.addListener('sending', function (e) {
				this.__blocker.block();
				this.debug('start uploading file "' + uploadButton.getFileName() + '" (' + uploadButton.getFileSize() + ' Bytes)');
			}, this);

			uploadButton.addListener('changeFileName', function (e) {
				if (e.getData() != '') {
					uploadForm.send();
				}
			}, this);

			return uploadForm;
		}
	}
});