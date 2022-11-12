import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationException } from './validation.exception';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {

	catch(exception: ValidationException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const baseException = new BadRequestException();

        let message = "Bad request";

        // Custom exception handling, to provide rich error message
        if (exception.errors.length == 2 && exception.errors.filter(e => !!e.constraints['isNotEmpty']).length == 2) {
            message = exception.errors.map(e => e.property).join(' and ') + ' should not be empty'
        } 
        else if (exception.errors.length > 0) {
            const erList = Object.values(exception.errors[0].constraints)
            if (erList.length > 0) {
                message = erList[0]
            }
        }

		response.status(baseException.getStatus()).json({
			statusCode: baseException.getStatus(),
			message: message,
			errors: exception.errors.map((error) => ({
                [error.property]: Object.values(error.constraints),
            })),
		});
	}
}