import { OverrideProvider, Res, Req, GlobalErrorHandlerMiddleware, Err } from '@tsed/common';
import { ResponseError } from '../models/ResponseError';

@OverrideProvider(GlobalErrorHandlerMiddleware)
export class CustomGlobalErrorHandlerMiddleware extends GlobalErrorHandlerMiddleware {
    public use(@Err() error: any, @Req() request: Req, @Res() response: Res): any {

        const responseError: ResponseError = new ResponseError();

        responseError.status = error.status;
        responseError.message = error.message;
        responseError.stack = error.stack;
        responseError.origin = error.origin;

        response.status(error.status).json(responseError);

        return super.use(error, request, response);
    }
}
