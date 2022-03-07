import { APIGatewayProxyResult } from 'aws-lambda';

const Response = (statusCode: StatusCode, data?: any): APIGatewayProxyResult => {
	return {
		statusCode,
		body: (data && JSON.stringify(data)) || '',
	}
}

export const Ok = (data?: any): APIGatewayProxyResult => Response(StatusCode.Ok, data);
export const Accepted = (data?: any): APIGatewayProxyResult => Response(StatusCode.Accepted, data);
export const BadRequest = (data?: string): APIGatewayProxyResult => Response(StatusCode.BadRequest, data);
export const Unauthorized = (data?: string): APIGatewayProxyResult => Response(StatusCode.Unauthorized, data);
export const NotFound = (data?: any): APIGatewayProxyResult => Response(StatusCode.NotFound, data);
export const InternalServerError = (data?: string): APIGatewayProxyResult => Response(StatusCode.InternalServerError, data);

enum StatusCode {
	Ok = 200,
	Accepted = 202,
	BadRequest = 400,
	Unauthorized = 401,
	NotFound = 404,
	InternalServerError = 500,
}
