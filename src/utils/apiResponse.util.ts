class ApiReponse {
  statusCode: number;
  message: string;
  data: unknown;
  success: boolean;

  constructor(statusCode: number, message: string, data: unknown) {
    this.success = statusCode > 199 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export default ApiReponse;
