import { Identity } from './identity';

/**
 * Simple wrapper class for null safety
 */
abstract class Option<T> {
	/**
	 * Map between types A and B
	 * @param functor A map between type A and type B
	 * @returns The converted value wrapped in an Option
	 */
	abstract map<B>(functor: (a: T) => B): Option<B>;

	/**
	 * Map between types A and B before flattening the surrounding Monad
	 * @param functor A map between type A and type B.
	 */
	abstract flatMap<B>(functor: (a: T) => Option<B>): Option<B>;

	/**
	 * If true, this option is a Some (representing a container with a value).
	 */
	abstract isSome(): boolean;

	/**
	 * If true, this option is a None (representing a container without a value).
	 */
	abstract isNone(): boolean;

	/**
	 * Get the underlying value or return the supplied default.
	 * @param defaultVal The default value to return if no value is present.
	 */
	getOrElse(defaultVal: T): T {
		return this.fold(
			() => defaultVal,
			Identity
		);
	};

	/**
	 * Unwrap the value.
	 * @description Ensure you wrap this in an `isSome` guard.
	 * @example
	 * // assume a myOption: Option<T>
	 * if (myOption.isSome()) {
	 * 	 return myOption.get();
	 * }
	 */
	abstract get(): T;

	/**
	 * Safely unwraps this Option by providing functors for both None and Some
	 * branches.
	 * @param ifEmpty The function to apply if this Option is None.
	 * @param ifNonEmpty The function to apply if this Option is Some.
	 */
	abstract fold<A>(ifEmpty: () => A, ifNonEmpty: (value: T) => A): A;

	/**
	 * Wrap a value in an Option type.
	 * @param value Value to wrap.
	 */
	static of<T>(value: T | null | undefined): Option<T> {
		if (value === null || value === undefined) {
			return none();
		}

		return some(value);
	}
}

class Some<T> extends Option<T> {
	value: T

	constructor(value: T) {
		super();
		this.value = value;
	}

	fold<A>(_: () => A, ifNonEmpty: (value: T) => A): A {
		return ifNonEmpty(this.value);
	}

	get(): T {
		return this.value;
	}

	isSome(): boolean {
		return true;
	}

	isNone(): boolean {
		return false;
	}

	flatMap<B>(functor: (a: T) => Option<B>): Option<B> {
		return functor(this.value);
	}

	map<B>(functor: (a: T) => B): Option<B> {
		return Option.of(functor(this.value));
	}

}

class None<T> extends Option<T> {
	fold<A>(ifEmpty: () => A, _: (value: T) => A): A {
		return ifEmpty();
	}

	get(): T {
		throw new Error('No value to retrieve.');
	}

	isSome(): boolean {
		return false;
	}

	isNone(): boolean {
		return true;
	}

	flatMap<B>(_: (a: T) => Option<B>): Option<B> {
		return none<B>();
	}

	map<B>(_: (a: T) => B): Option<B> {
		return none<B>();
	}
}

const some = <T>(value: T): Option<T> => {
	return new Some(value)
};

const none = <T>(): Option<T> => {
	return new None<T>();
};

const somes = <T>(values: Option<T>[]): T[] => {
	return values
		.filter(el => el.isSome())
		.map(el => el.get());
};

export {
	none,
	Option,
	some,
	somes,
}
