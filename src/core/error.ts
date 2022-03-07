import { Either, left, right } from './either'

class AppError {
	error: string;
	constructor(error: string) {
		this.error = error;
	}

	toString(): string {
		return this.error;
	}
}

type ErrorOr<T> = Either<AppError, T>;

const TryAsync = async <T>(func: () => Promise<T>): Promise<ErrorOr<T>> => {
	return await func()
		.then(res => right(res))
		.catch(err => left(new AppError(err?.message || err?.toString() || '')));
}

const Try = <T>(func: () => T): ErrorOr<T> => {
	try {
		return right(func());
	} catch (err) {
		return left(new AppError(err?.message || err?.toString() || ''));
	}
}

export {
	ErrorOr,
	TryAsync,
	Try,
	AppError,
}
