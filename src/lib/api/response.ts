export default class Response<T> {
  public success: boolean;
  public data: T;
  public error: Error | null;

  constructor(success: boolean) {
    this.success = success;
    // @ts-ignore
    this.data = undefined;
    this.error = null;
  }
  public setData(data: T): Response<T> {
    this.data = data;
    return this;
  }
  public setError(error: Error): Response<T> {
    this.error = error;
    return this;
  }
}
