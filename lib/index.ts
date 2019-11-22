const some = <T>(value?: T): T | undefined => value;

const none = <T>(value?: T): boolean => value === undefined;

export class Result<T, E> {
    is_ok: boolean;
    ok_val?: T;
    err_val?: E;
    constructor(is_ok: boolean, val: T | E) {
        this.is_ok = is_ok;
        if (is_ok) {
            this.ok_val = val as T;
        } else {
            this.err_val = val as E;
        }
    }
    ok(): T | undefined {
        return this.is_ok ? this.ok_val : undefined;
    }
    err(): E | undefined {
        return this.is_ok ? undefined : this.err_val;
    }
    ok_or(fallback: T): T {
        return this.is_ok && this.ok_val !== undefined ? this.ok_val : fallback;
    }
    map<V>(fn: (v: T) => V): Result<V, E> {
        if (this.is_ok && this.ok_val !== undefined) {
            return new Result<V, E>(true, fn(this.ok_val));
        } else {
            return new Result<V, E>(false, this.err_val as E);
        }
    }
}

const result = <T, E>() => ({
    ok: (v: T) => ok<T, E>(v),
    err: (e: E) => err<T, E>(e),
});

const ok = <T, E>(v: T): Result<T, E> => new Result<T, E>(true, v);
const err = <T, E>(e: E): Result<T, E> => new Result<T, E>(false, e);

const is_ok = <T, E>(result: Result<T, E>): T | undefined => result.ok();
const is_err = <T, E>(result: Result<T, E>): E | undefined => result.err();

const arr = (a: any[]) => obj(a);

const obj = (o: any) => <T>(v: T): T | undefined => {
    for (let i in o) {
        if (o[i] === m._) continue;
        if (o[i] !== (v as any)[i]) return undefined;
    }
    return v;
};

export const m = {
    some,
    none,
    ok,
    err,
    is_ok,
    is_err,
    result,
    arr,
    obj,
    _: Symbol("pattern any"),
};

export default <T, R>(value: T) => (...branches: [any, (v: any) => R][]): R => {
    if (!branches) throw "there are no branches to match";
    const found = branches.find((branch: [any, (v: T) => R]) => {
        if (branch[0] === value) return true;
        if (branch[0] === true) return true;
        if (typeof branch[0] === "function") {
            const result = branch[0](value);
            return result !== undefined && result !== false;
        }
    });
    if (!found) return branches.slice(-1)[0][1](value);
    const fun = found[1];
    if (typeof found[0] === "function") {
        return fun(found[1](value));
    } else {
        return fun(value);
    }
};
