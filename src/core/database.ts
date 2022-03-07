import DynamoDB from 'aws-sdk/clients/dynamodb';
import { v4 as v4uuid } from 'uuid';
import { left, right } from './either';
import { ErrorOr, TryAsync } from './error';
import { none, Option, some } from './option';
import { Post, NewPost } from './post';

export const FetchPost = async (client: DynamoDB.DocumentClient, dynamoTable: string, postId: string): Promise<ErrorOr<Option<Post>>> => {
	const getParams: DynamoDB.DocumentClient.QueryInput = {
		ExpressionAttributeValues: {
			':i': postId,
		},
		KeyConditionExpression: 'postId = :i',
		ProjectionExpression: Post.projection(),
		TableName: dynamoTable,
	};

	const errorOrQueryResult = await TryAsync(() => client.query(getParams).promise());

	if(errorOrQueryResult.isLeft()) {
		return left(errorOrQueryResult.getLeft());
	}

	const maybeQueryResults = Option.of(errorOrQueryResult.getRight().Items);

	const maybeObjectMap = maybeQueryResults
		.flatMap(
			items => items.length !== 0
				? some(items[0])
				: none<DynamoDB.DocumentClient.AttributeMap>()
		);

	return right(Post.fromMap(maybeObjectMap));
}

export const UpsertPost = async (client: DynamoDB.DocumentClient, dynamoTable: string, newPost: NewPost, maybePostId: Option<string> = none()): Promise<ErrorOr<string>> => {
	const postId = maybePostId.getOrElse(v4uuid())
	const { title, description, iconUrl, postedOn, content, tags, archived } = newPost;

	const updateParams: DynamoDB.DocumentClient.UpdateItemInput = {
		ExpressionAttributeValues: {
			':t': title,
			':d': description,
			':i': iconUrl,
			':p': postedOn,
			':c': content,
			':g': tags,
			':a': archived,
		},
		Key: {
			'postId': postId,
		},
		TableName: dynamoTable,
		UpdateExpression: 'set title = :t, description = :d, iconUrl = :i, postedOn = :p, content = :c, tags = :g, archived = :a',
	};

	const errorOrUpsertResult = await TryAsync(() => client.update(updateParams).promise());

	if(errorOrUpsertResult.isLeft()) {
		return left(errorOrUpsertResult.getLeft());
	}

	return right(postId);
}
