import DynamoDB from 'aws-sdk/clients/dynamodb';
import { none, Option } from './option';

const PostIdKey: string = 'postId';
const TitleKey: string = 'title';
const DescriptionKey: string = 'description';
const IconUrlKey: string = 'iconUrl';
const PostedOnKey: string = 'postedOn';
const ContentKey: string = 'content';
const TagsKey: string = 'tags';
const ArchivedKey: string = 'archived';

export class PostIndex {
	postId: string;
	title: string;
	description: string;
	iconUrl: string;
	postedOn: Date;

	static fields: () => string[] = () => [
		PostIdKey,
		TitleKey,
		DescriptionKey,
		IconUrlKey,
		PostedOnKey,
	];

	static projection: () => string = () => PostIndex.fields().join(', ');

	static fromMap = (maybeMap: Option<DynamoDB.DocumentClient.AttributeMap>): Option<PostIndex> => {
		if (maybeMap.isNone()) return none();

		const map = maybeMap.get();
		const maybePostId = Option.of(map[PostIdKey]);
		const maybeTitle = Option.of(map[TitleKey]);
		const maybeDescription = Option.of(map[DescriptionKey]);
		const maybeIconUrl = Option.of(map[IconUrlKey]);
		const maybePostedOn = Option.of(map[PostedOnKey]);

		const maybePost = maybePostId
			.flatMap(postId => maybeTitle
				.flatMap(title => maybeDescription
					.flatMap(description => maybeIconUrl
						.flatMap(iconUrl => maybePostedOn
							.map(postedOn => ({
								postId,
								title,
								description,
								iconUrl,
								postedOn,
							}))
						)
					)
				)
			);

		return maybePost;
	}
}

export class NewPost {
	title: string;
	description: string;
	iconUrl: string;
	postedOn: Date;
	content: string;
	tags: string[];
	archived: boolean;

	static fromObject = (object: any): Option<NewPost> => {
		if (!object) return none();

		const maybeTitle = Option.of(object[TitleKey]);
		const maybeDescription = Option.of(object[DescriptionKey]);
		const maybeIconUrl = Option.of(object[IconUrlKey]);
		const maybePostedOn = Option.of(object[PostedOnKey]);
		const maybeContent = Option.of(object[ContentKey]);
		const maybeTags = Option.of(object[TagsKey]);
		const maybeArchived = Option.of(object[ArchivedKey]);

		const maybePost = maybeTitle
			.flatMap(title => maybeDescription
				.flatMap(description => maybeIconUrl
					.flatMap(iconUrl => maybePostedOn
						.flatMap(postedOn => maybeContent
							.flatMap(content => maybeTags
								.flatMap(tags => maybeArchived
									.map(archived => ({
										title,
										description,
										iconUrl,
										postedOn,
										content,
										tags,
										archived,
									}))
								)
							)
						)
					)
				)
			);

		return maybePost;
	}
}

export class Post {
	postId: string;
	title: string;
	description: string;
	iconUrl: string;
	postedOn: Date;
	content: string;
	tags: string[];
	archived: boolean;

	static fields: () => string[] = () => [
		...PostIndex.fields(),
		ContentKey,
		TagsKey,
		ArchivedKey,
	];

	static projection: () => string = () => Post.fields().join(', ');

	static fromMap = (maybeMap: Option<DynamoDB.DocumentClient.AttributeMap>): Option<Post> => {
		if (maybeMap.isNone()) return none();

		const map = maybeMap.get();
		const maybePostId = Option.of(map[PostIdKey]);
		const maybeTitle = Option.of(map[TitleKey]);
		const maybeDescription = Option.of(map[DescriptionKey]);
		const maybeIconUrl = Option.of(map[IconUrlKey]);
		const maybePostedOn = Option.of(map[PostedOnKey]);
		const maybeContent = Option.of(map[ContentKey]);
		const maybeTags = Option.of(map[TagsKey]);
		const maybeArchived = Option.of(map[ArchivedKey]);

		const maybePost = maybePostId
			.flatMap(postId => maybeTitle
				.flatMap(title => maybeDescription
					.flatMap(description => maybeIconUrl
						.flatMap(iconUrl => maybePostedOn
							.flatMap(postedOn => maybeContent
								.flatMap(content => maybeTags
									.flatMap(tags => maybeArchived
										.map(archived => ({
											postId,
											title,
											description,
											iconUrl,
											postedOn,
											content,
											tags,
											archived,
										}))
									)
								)
							)
						)
					)
				)
			);

		return maybePost;
	}
}
