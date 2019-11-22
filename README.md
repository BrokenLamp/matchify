# Matchify

Pattern matching syntax for TypeScript and JavaScript

## Matching

### Strings

```ts
import match, { m } from "matchify";

let result = match("jenny")(
    ["bob", () => "cool"],
    ["walter", () => "less cool"],
    ["jenny", () => "super cool"],
    ["samantha", () => "very uncool"],
    [[], () => "I don't know"],
);

result === "super cool";
```

### Arrays

```ts
let result = match(anArray)(
    [["yellow"], () => "first element is yellow"],
    [[m._, "green"], () => "second element is green"],
    [["blue", "orange"], () => "starts with blue and orange"],
    [[(c) => c.startsWith("b")], () => "first element starts with a b"],
    [[], () => "could be anything"],
);
```

### Objects

```ts
let result = match(anObject)(
    [{ yellow: true }, () => "It's yellow"],
    [{ weight: 6 }, () => "It's exactly 6"],
    [
        { weight: (w) => w > 50 },
        ({ weight }) => `It's heavy, weiging ${weight}`,
    ],
    [[], () => "I don't know what it is"],
);
```

### Optionals

```ts
let value?: string = maybeGetAString();

let result = match(value)(
    [m.some, (val) => "It's a something"],
    [m.none, () => "It's a nothing"],
);
```

### Results

Matchify also adds a Rust-like Result type.

```ts
import match, { m, Result } from "matchify";

function maybeItWorked(didItWork: boolean): Result<number, string> {
    const r = m.result<number, string>();

    if (didItWork) {
        return r.ok(72);
    } else {
        return r.err("Didn't work");
    }
}

let maybe = maybeItWorked(whoKnows);

let result: string = match(maybe)(
    [m.is_ok, (ok) => `It worked! val: ${ok}`],
    [m.is_err, (err) => `It din't work. error: ${err}`],
);

let result: string = maybe.ok_or(38);
// result equals 72 or 38
```
