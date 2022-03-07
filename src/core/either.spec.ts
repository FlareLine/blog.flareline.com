import { left, right } from './either';

describe('left', () => {
	it('is left', () => {
		const either = left(undefined);

		expect(either.isLeft()).toBe(true);
	});

	it('is not right', () => {
		const either = left(undefined);

		expect(either.isRight()).toBe(false);
	});

	it('returns a value on getLeft', () => {
		const value = { meaningOfLife: 42 };
		const either = left(value);

		expect(either.getLeft()).toBe(value);
	});

	it('throws on getRight', () => {
		const value = { meaningOfLife: 42 };
		const either = left(value);

		expect(() => either.getRight()).toThrow();
	});

	it('returns the inner value on getLeftOrElse', () => {
		const inner = { meaningOfLife: 42 };
		const other = { meaningOfLife: 24 };
		const either = left(inner);

		expect(either.getLeftOrElse(other)).toBe(inner);
	});

	it('returns the default value on getRightOrElse', () => {
		const inner = { meaningOfLife: 42 };
		const other = { meaningOfLife: 24 };
		const either = left(inner);

		expect(either.getRightOrElse(other)).toBe(other);
	});

	it('calls the function argument on leftMap', () => {
		const fn = jest.fn();
		const value = { meaningOfLife: 42 };
		const either = left(value);

		either.leftMap(fn);

		expect(fn).toBeCalledTimes(1);
		expect(fn).toBeCalledWith(value);
	});

	it('does not call the function argument on rightMap', () => {
		const fn = jest.fn();
		const either = left(undefined);

		either.rightMap(fn);

		expect(fn).not.toBeCalled();
	});

	it('returns a Left with the result of the function argument on leftMap', () => {
		const next = { meaningOfLife: 42 };
		const either = left(undefined);

		const result = either.leftMap(() => next);

		expect(result.getLeft()).toBe(next);
	});

	it('returns itself on rightMap', () => {
		const inner = { meaningOfLife: 42 };
		const other = { meaningOfLife: 24 };
		const either = left(inner);

		expect(either.rightMap(() => other)).toBe(either);
	});
});

describe('right', () => {
	it('is right', () => {
		const either = right(undefined);

		expect(either.isRight()).toBe(true);
	});

	it('is not left', () => {
		const either = right(undefined);

		expect(either.isLeft()).toBe(false);
	});

	it('returns a value on getRight', () => {
		const value = { meaningOfLife: 42 };
		const either = right(value);

		expect(either.getRight()).toBe(value);
	});

	it('throws on getLeft', () => {
		const value = { meaningOfLife: 42 };
		const either = right(value);

		expect(() => either.getLeft()).toThrow();
	});

	it('returns the inner value on getRightOrElse', () => {
		const inner = { meaningOfLife: 42 };
		const other = { meaningOfLife: 24 };
		const either = right(inner);

		expect(either.getRightOrElse(other)).toBe(inner);
	});

	it('returns the default value on getLeftOrElse', () => {
		const inner = { meaningOfLife: 42 };
		const other = { meaningOfLife: 24 };
		const either = right(inner);

		expect(either.getLeftOrElse(other)).toBe(other);
	});

	it('calls the function argument on rightMap', () => {
		const fn = jest.fn();
		const value = { meaningOfLife: 42 };
		const either = right(value);

		either.rightMap(fn);

		expect(fn).toBeCalledTimes(1);
		expect(fn).toBeCalledWith(value);
	});

	it('does not call the function argument on leftMap', () => {
		const fn = jest.fn();
		const either = right(undefined);

		either.leftMap(fn);

		expect(fn).not.toBeCalled();
	});

	it('returns a Right with the result of the function argument on rightMap', () => {
		const next = { meaningOfLife: 42 };
		const either = right(undefined);

		const result = either.rightMap(() => next);

		expect(result.getRight()).toBe(next);
	});

	it('returns itself on leftMap', () => {
		const inner = { meaningOfLife: 42 };
		const other = { meaningOfLife: 24 };
		const either = right(inner);

		expect(either.leftMap(() => other)).toBe(either);
	});
});
