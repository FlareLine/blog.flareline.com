import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { FetchPost, UpsertPost } from '../core/database';
import { Option } from '../core/option';
import { NewPost } from '../core/post';
import { HttpMethod } from '../core/request';
import { Accepted, BadRequest, InternalServerError, NotFound, Ok } from '../core/response';

const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	switch (event.httpMethod) {
		case HttpMethod.Get: return handleGet(event);
		case HttpMethod.Post: return handleUpsert(event);
		default: return NotFound('Not found.');
	}
}

const handleGet = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const maybeDynamoTable = Option.of(process.env.DYNAMO_TABLE);
	if (maybeDynamoTable.isNone()) {
		console.error('DYNAMO_TABLE is not defined.');
		return InternalServerError('Configuration error.');
	}
	const dynamoTable = maybeDynamoTable.get();

	const maybePathParams = Option.of(event.pathParameters);
	const maybePostId = maybePathParams.flatMap(pathParams => Option.of(pathParams['postId']));
	if (maybePostId.isNone()) {
		return NotFound('Not found.');
	}

	const postId = maybePostId.get();
	const errorOrMaybePost = await FetchPost(client, dynamoTable, postId);

	if (errorOrMaybePost.isLeft()) {
		const error = errorOrMaybePost.getLeft();
		console.error(`An error ocurred while retrieving post '${postId}' - ${error.toString()}`);
		return InternalServerError('An error ocurred.');
	}

	const maybePost = errorOrMaybePost.getRight();
	if (maybePost.isNone()) {
		return NotFound('Not found.');
	}

	return Ok(maybePost.get());
}

const handleUpsert = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const maybeDynamoTable = Option.of(process.env.DYNAMO_TABLE);
	if (maybeDynamoTable.isNone()) {
		console.error('DYNAMO_TABLE is not defined.');
		return InternalServerError('An error ocurred.');
	}
	const dynamoTable = maybeDynamoTable.get();

	const requestBody = event.body || '';
	const bodyMap = JSON.parse(requestBody);
	const maybePathParams = Option.of(event.pathParameters);
	const maybePostId = maybePathParams.flatMap(pathParams => Option.of(pathParams['postId']));

	const maybeNewPost = NewPost.fromObject(bodyMap);
	if (maybeNewPost.isNone()) {
		return BadRequest('Bad request.');
	}
	const newPost = maybeNewPost.get();

	const upsertRequest = await UpsertPost(client, dynamoTable, newPost, maybePostId);
	if (upsertRequest.isLeft()) {
		console.error(`An error ocurred while upserting post - ${upsertRequest.getLeft().toString()}`);
		return InternalServerError('An error ocurred.');
	}

	return Accepted({
		postId: upsertRequest.getRight(),
	});
}
