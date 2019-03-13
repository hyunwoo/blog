export default {
  plugins: 'wordcount codesample advlist autoresize image',
  toolbar: 'codesample forecolor backcolor image',
  images_upload_handler: (
    info: any,
    success: (result: string) => {},
    failure: (result: string) => {}
  ) => {
    // todo
  },
  automatic_uploads: false,
  file_picker_types: 'image'
};
