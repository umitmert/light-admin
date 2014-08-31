var FileUploaderDecorator = (function () {
    return {
        decorate: function (container, file_input_id, attribute_name, browse_button, file_upload_url) {
            var container_selector = '#' + container;

            var uploader = new plupload.Uploader({
                runtimes: 'html5,flash,silverlight,html4',
                url: file_upload_url,
                container: document.getElementById(container),
                browse_button: document.getElementById(browse_button),
                file_data_name: attribute_name,
                unique_names: true,
                flash_swf_url: 'vendor/plugins/plupload/js/Moxie.swf',
                silverlight_xap_url: 'vendor/plugins/plupload/js/Moxie.xap',
                filters: {
                    max_file_size: '10mb',
                    mime_types: [
                        {title: "Image files", extensions: "jpg,jpeg,png"}
                    ]
                },

                init: {
                    FilesAdded: function (up, files) {
                        plupload.each(files, function (file) {
                            var filesContainer = $('span.filename', $(container_selector));
                            filesContainer.html($('<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b>' + '</div>'));
                        });
                        up.refresh();

                        uploader.start();
                    },

                    UploadProgress: function (up, file) {
                        $('#' + file.id + " b").html(file.percent + "%");
                    },

                    Error: function (up, err) {
                        var errorCode = err.code;
                        var errorMessage = err.message + (err.file ? " File: " + err.file.name : "");

                        if (errorCode == -600) {
                            errorMessage = 'Selected file ' + (err.file ? err.file.name + ' ' : "") + 'exceeds file size limit of 10MB';
                        } else if (errorCode == -601 || errorCode == -700) {
                            errorMessage = "Selected file type is not supported (" + (err.file ? err.file.name : "") + "). Please select JPG or PNG file.";
                        }

                        jAlert(errorMessage, 'Upload file operation failure');
                        up.refresh();
                    },

                    FileUploaded: function (uploader, file, response) {
                        $('#' + file.id + " b").html("100%");

                        var result = $.parseJSON(response.response);

                        $(file_input_id).val(result['content']['fileContent']);
                    }
                }
            });

            uploader.init();

            return uploader;
        }
    }
}());