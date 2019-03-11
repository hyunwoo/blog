export default {
  readInputFile(accept?: string): Promise<File> {
    return new Promise<File>((resolve, reject) => {
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
        resolve(file);
        document.body.removeChild(input);
      };
    });
  },
  readFileAsDataURL(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = (evt) => {
        if (reader.result === null) {
          reject();
          return;
        }
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  },
  readInputFileAsString(accept?: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
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
            reject();
            return;
          }
          const html: string = reader.result.toString();
          resolve(html);
        };
        reader.readAsText(file);
        document.body.removeChild(input);
      };
    });
  }
};
