FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateType
);

FilePond.create(document.querySelector("#cover"), {
  acceptedFileTypes: ["image/png"],
  fileValidateTypeDetectType: (source, type) =>
    new Promise((resolve, reject) => {
      // Do custom type detection here and return with promise

      resolve(type);
    }),
});

FilePond.create(document.querySelector("#bookPdf"), {
  acceptedFileTypes: ["application/pdf"],
  fileValidateTypeDetectType: (source, type) =>
    new Promise((resolve, reject) => {
      resolve(type);
    }),
});

FilePond.setOptions({
  stylePanelAspectRatio: 150 / 100,
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150,
});

FilePond.parse(document.body);
