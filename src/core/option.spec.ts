import { Option, some, none, somes } from './option';

describe('Option', () => {
	describe('Some', () => {
		it('can be mapped without error', () => {
			const value = 10;
			const someValue = some(value);

			expect(() => someValue.map(item => item + 1)).not.toThrow();
		});

		it('can be flatMapped without error', () => {
			const innerValue = 10;
			const value = some(innerValue);
			const someValue = some(value);

			expect(() => someValue.flatMap(value => value.map(innerValue => innerValue + 1))).not.toThrow();
		});

		it('can be mapped', () => {
			const value = 10;
			const someValue = some(value);

			const result = someValue.map(val => val + 1);

			expect(result.get()).toBe(11);
		});

		it('can be flatMapped', () => {
			const innerValue = 10;
			const value = some(innerValue);
			const someValue = some(value);

			const result = someValue.flatMap(value => value.map(innerValue => innerValue + 1));

			expect(result.get()).toBe(11);
		});

		it('can be flatMapped without error', () => {
			const noneValue = none<Option<number>>();

			expect(() => noneValue.flatMap(value => value.map(innerValue => innerValue + 1))).not.toThrow();
		});

		it('does not throw when get is called', () => {
			const value = 10;
			const someValue = some(value);

			expect(() => someValue.get()).not.toThrow();
		});

		it('returns value in getOrElse', () => {
			const value = 10;
			const someValue = some(value);

			expect(someValue.getOrElse(1)).toBe(value);
		});

		it('is considered some', () => {
			const value = 10;
			const someValue = some(value);

			expect(someValue.isSome()).toBe(true);
			expect(someValue.isNone()).toBe(false);
		});
	});

	describe('None', () => {
		it('can be mapped without error', () => {
			const noneValue = none<number>();

			expect(() => noneValue.map(value => value + 1)).not.toThrow();
		});

		it('can be flatMapped without error', () => {
			const noneValue = none<Option<number>>();

			expect(() => noneValue.flatMap(value => value.map(innerValue => innerValue + 1))).not.toThrow();
		});

		it('does throw when get is called', () => {
			const noneValue = none<number>();

			expect(() => noneValue.get()).toThrow();
		});

		it('returns else in getOrElse', () => {
			const elseValue = 10;
			const noneValue = none<number>();

			expect(noneValue.getOrElse(elseValue)).toBe(elseValue);
		});

		it('is considered none', () => {
			const noneValue = none<number>();

			expect(noneValue.isNone()).toBe(true);
			expect(noneValue.isSome()).toBe(false);
		});
	});

	describe('.of', () => {
		it('will return None when null is passed', () => {
			const optionValue = Option.of<any>(null);

			expect(optionValue.isNone()).toBe(true);
		});

		it('will not return Some when null is passed', () => {
			const optionValue = Option.of<any>(null);

			expect(optionValue.isSome()).toBe(false);
		});

		it('will return None when undefined is passed', () => {
			const optionValue = Option.of<any>(undefined);

			expect(optionValue.isNone()).toBe(true);
		});

		it('will not return Some when undefined is passed', () => {
			const optionValue = Option.of<any>(undefined);

			expect(optionValue.isSome()).toBe(false);
		});
	});

	describe('somes', () => {
		it('returns all values when all are some', () => {
			const someValues: Option<string>[] = [
				some('1'),
				some('2'),
				some('3'),
				some('4'),
				some('5'),
			];

			const expectedValues: string[] = [
				'1',
				'2',
				'3',
				'4',
				'5',
			];

			const result = somes(someValues);

			expect(result).toEqual(expectedValues);
		});

		it('returns some values when some are some', () => {
			const mixedValues: Option<string>[] = [
				some('1'),
				none(),
				some('3'),
				some('4'),
				none(),
			];

			const expectedValues: string[] = [
				'1',
				'3',
				'4',
			];

			const result = somes(mixedValues);

			expect(result).toEqual(expectedValues);
		});

		it('returns no values when all are none', () => {
			const noneValues: Option<string>[] = [
				none(),
				none(),
				none(),
				none(),
				none(),
			];

			const expectedValues: string[] = [];

			const result = somes(noneValues);

			expect(result).toEqual(expectedValues);
		});
	});
});
