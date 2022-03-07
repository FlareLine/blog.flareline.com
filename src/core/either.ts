/**
 * Represents a logical union between two types - a `Left` or bad case, and a `Right` or good case.
 */
 abstract class Either<A, B> {
	/**
	 * Returns true if this is a `Left`, otherwise false.
	 */
	abstract isLeft(): boolean;


	/**
	 * Returns true if this is a `Right`, otherwise false.
	 */
	abstract isRight(): boolean;

	/**
	 * If a `Left`, maps the value to a different type.
	 * @param functor The function to apply to the `Left` value.
	 */
	abstract leftMap<C>(functor: (a: A) => C): Either<C, B>;

	/**
	 * If a `Left`, maps the value to a different type, then flattens the returned
	 * Eithers.
	 * @param functor The function to apply to the `Left` value.
	 */
	abstract leftFlatMap<C>(functor: (a: A) => Either<C, B>): Either<C, B>;

	/**
	 * If a `Right`, maps the value to a different type.
	 * @param functor The function to apply to the `Right` value.
	 */
	abstract rightMap<C>(functor: (a: B) => C): Either<A, C>;

	/**
	 * If a `Right`, maps the value to a different type, then flattens the
	 * returned Eithers.
	 * @param functor The function to apply to the `Right` value.
	 */
	abstract rightFlatMap<C>(functor: (a: B) => Either<A, C>): Either<A, C>;

	/**
	 * If a `Left`, returns the value. Otherwise throws.
	 */
	abstract getLeft(): A;

	/**
	 * If a `Right`, returns the value. Otherwise throws.
	 */
	abstract getRight(): B;

	/**
	 * If a `Left`, returns the value. Otherwise returns the given default value.
	 * @param def The default value.
	 */
	abstract getLeftOrElse(def: A): A;

	/**
	 * If a `Right`, returns the value. Otherwise returns the given default value.
	 * @param def The default value.
	 */
	abstract getRightOrElse(def: B): B;

	abstract fold<C>(ifLeft: (left: A) => C, ifRight: (right: B) => C): C;
}

class Left<A> extends Either<A, any> {
	val: A;

	constructor(val: A) {
		super();
		this.val = val;
	}

	leftFlatMap<C>(functor: (a: A) => Either<C, any>): Either<C, any> {
		return functor(this.val);
	}

	rightFlatMap<C>(_: (a: any) => Either<A, C>): Either<A, C> {
		return this;
	}

	fold<C>(ifLeft: (left: A) => C, _: (right: any) => C): C {
		return ifLeft(this.val);
	}

	isLeft(): boolean {
		return true;
	}

	isRight(): boolean {
		return false;
	}

	leftMap<C>(functor: (a: A) => C): Either<C, any> {
		return new Left(functor(this.val));
	}

	rightMap<C>(_: (a: any) => C): Either<A, C> {
		return this;
	}

	getLeft(): A {
		return this.val;
	}

	getRight(): never {
		throw new Error('No value to retrieve.');
	}

	getLeftOrElse(_: A): A {
		return this.val;
	}

	getRightOrElse(def: any): any {
		return def;
	}
}

class Right<B> extends Either<any, B> {
	val: B;

	constructor(val: B) {
		super();
		this.val = val;
	}

	leftFlatMap<C>(_: (a: any) => Either<C, B>): Either<C, B> {
		return this;
	}

	rightFlatMap<C>(functor: (a: B) => Either<any, C>): Either<any, C> {
		return functor(this.val);
	}

	fold<C>(_: (left: any) => C, ifRight: (right: B) => C): C {
		return ifRight(this.val);
	}

	isLeft(): boolean {
		return false;
	}

	isRight(): boolean {
		return true;
	}

	leftMap<C>(_: (a: any) => C): Either<C, B> {
		return this;
	}

	rightMap<C>(functor: (a: B) => C): Either<any, C> {
		return new Right(functor(this.val));
	}

	getLeft(): never {
		throw new Error('No value to retrieve.');
	}

	getRight(): B {
		return this.val;
	}

	getLeftOrElse(def: any): any {
		return def;
	}

	getRightOrElse(_: B): B {
		return this.val;
	}
}

const left = <A>(val: A): Either<A, any> => new Left(val);
const right = <B>(val: B): Either<any, B> => new Right(val);

export {
	Either,
	left,
	right,
}
