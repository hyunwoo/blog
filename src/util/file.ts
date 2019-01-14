import Response from '@/lib/api/response';
export default {
  readInputFile(accept?: string): Promise<Response<File>> {
    return new Promise<Response<File>>((resolve, reject) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      if (accept !== undefined) {
        input.setAttribute('accept', accept);
      }
      document.body.appendChild(input);
      input.style.display = 'none';
      input.click();
      input.onchange = (evt: Event) => {
        // @ts-ignore
        const file: File = evt.target.files[0];
        resolve(new Response<File>(true).setData(file));
        document.body.removeChild(input);
      };
    });
  },
  readInputFileAsString(accept?: string): Promise<Response<string>> {
    return new Promise<Response<string>>((resolve, reject) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      if (accept !== undefined) {
        input.setAttribute('accept', accept);
      }
      document.body.appendChild(input);
      input.style.display = 'none';
      input.click();
      input.onchange = (evt: Event) => {
        // @ts-ignore
        const file: File = evt.target.files[0];
        const reader: FileReader = new FileReader();
        reader.onload = () => {
          if (reader.result === null) {
            reject(
              new Response<string>(false).setError(
                new Error('file is not exist')
              )
            );
            return;
          }
          const html: string = reader.result.toString();
          resolve(new Response<string>(true).setData(html));
        };
        reader.readAsText(file);
        document.body.removeChild(input);
      };
    });
  }
};
