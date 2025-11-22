interface ResponseData {
    statusCode: number;
    data: object;
    message: string;
    success: boolean
}

class ApiResponse implements ResponseData{

    constructor(
        public statusCode: number, 
        public data: object, 
        public message: string = 'Success',
        public success: boolean = statusCode < 400
    ) {}
}

export {ApiResponse}