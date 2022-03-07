import { AppError, Try, TryAsync } from './error';

describe('AppError', () => {
	it('has error from constructor', () => {
		const errorValue: string = 'Test Error Value';
		const error = new AppError(errorValue);
		const errorField: string = error.error;

		expect(errorField).toBe(errorValue);
	});

	it('prints error on toString', () => {
		const errorValue: string = 'Test Error Value';
		const error = new AppError(errorValue);
		const errorToString: string = error.toString();

		expect(errorToString).toBe(errorValue);
	});
});

describe('Try', () => {
	it('returns right on success', () => {
		const result = Try(() => 'Hello World!');

		const expectedValue = 'Hello World!';

		expect(result.isRight()).toBe(true);
		expect(result.isLeft()).toBe(false);
		expect(result.getRight()).toEqual(expectedValue);
	});

	it('returns left with message on throw with message', () => {
		const errorMessage = 'I am an error.';
		const error = new Error(errorMessage);

		const result = Try(() => {
			throw error;
		});

		const expectedValue = new AppError(errorMessage);

		expect(result.isRight()).toBe(false);
		expect(result.isLeft()).toBe(true);
		expect(result.getLeft()).toEqual(expectedValue);
	});

	it('returns left with error on throw no message', () => {
		const error = new Error();

		const result = Try(() => {
			throw error;
		});

		const expectedValue = new AppError('Error');

		expect(result.isRight()).toBe(false);
		expect(result.isLeft()).toBe(true);
		expect(result.getLeft()).toEqual(expectedValue);
	});

	it('returns left with empty message on throw unknown', () => {
		const error = undefined;

		const result = Try(() => {
			throw error;
		});

		const expectedValue = new AppError('');

		expect(result.isRight()).toBe(false);
		expect(result.isLeft()).toBe(true);
		expect(result.getLeft()).toEqual(expectedValue);
	});
});

describe('TryAsync', () => {
	it('returns right on success', async () => {
		const result = await TryAsync(async () => 'Hello World!');

		const expectedValue = 'Hello World!';

		expect(result.isRight()).toBe(true);
		expect(result.isLeft()).toBe(false);
		expect(result.getRight()).toEqual(expectedValue);
	});

	it('returns left with message on throw with message', async () => {
		const errorMessage = 'I am an error.';
		const error = new Error(errorMessage);

		const result = await TryAsync(async () => {
			throw error;
		});

		const expectedValue = new AppError(errorMessage);

		expect(result.isRight()).toBe(false);
		expect(result.isLeft()).toBe(true);
		expect(result.getLeft()).toEqual(expectedValue);
	});

	it('returns left with error on throw no message', async () => {
		const error = new Error();

		const result = await TryAsync(async () => {
			throw error;
		});

		const expectedValue = new AppError('Error');

		expect(result.isRight()).toBe(false);
		expect(result.isLeft()).toBe(true);
		expect(result.getLeft()).toEqual(expectedValue);
	});

	it('returns left with empty message on throw unknown', async () => {
		const error = undefined;

		const result = await TryAsync(async () => {
			throw error;
		});

		const expectedValue = new AppError('');

		expect(result.isRight()).toBe(false);
		expect(result.isLeft()).toBe(true);
		expect(result.getLeft()).toEqual(expectedValue);
	});
});
