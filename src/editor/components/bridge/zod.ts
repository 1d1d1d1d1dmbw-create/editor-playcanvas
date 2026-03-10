type ParseSuccess<T> = { success: true; data: T };
type ParseFailure = { success: false; error: Error };
type ParseResult<T> = ParseSuccess<T> | ParseFailure;

class Schema<T> {
    constructor(protected readonly parser: (value: unknown) => T) {}

    parse(value: unknown): T {
        return this.parser(value);
    }

    safeParse(value: unknown): ParseResult<T> {
        try {
            return { success: true, data: this.parse(value) };
        } catch (error) {
            return { success: false, error: error as Error };
        }
    }

    transform<U>(transformer: (value: T) => U): Schema<U> {
        return new Schema(value => transformer(this.parse(value)));
    }

    optional(): Schema<T | undefined> {
        return new Schema((value) => {
            return value === undefined ? undefined : this.parse(value);
        });
    }

    default(defaultValue: T): Schema<T> {
        return new Schema((value) => {
            return value === undefined ? defaultValue : this.parse(value);
        });
    }
}

class StringSchema extends Schema<string> {
    min(length: number): StringSchema {
        return new StringSchema((value) => {
            const parsed = this.parse(value);
            if (parsed.length < length) {
                throw new Error('String too short');
            }
            return parsed;
        });
    }
}

const object = <T extends Record<string, Schema<any>>>(shape: T): Schema<{ [K in keyof T]: ReturnType<T[K]['parse']> }> => new Schema((value: unknown) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('Expected object');
    }

    const input = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};

    for (const key of Object.keys(shape)) {
        output[key] = shape[key].parse(input[key]);
    }

    return output as { [K in keyof T]: ReturnType<T[K]['parse']> };
});

const literal = <T extends string>(expected: T): Schema<T> => new Schema((value) => {
    if (value !== expected) {
        throw new Error(`Expected literal ${expected}`);
    }
    return expected;
});

const string = (): StringSchema => new StringSchema((value) => {
    if (typeof value !== 'string') {
        throw new Error('Expected string');
    }
    return value;
});

const number = (): Schema<number> => new Schema((value) => {
    if (typeof value !== 'number') {
        throw new Error('Expected number');
    }
    return value;
});

const union = <T extends Schema<any>[]>(schemas: T): Schema<ReturnType<T[number]['parse']>> => new Schema((value) => {
    for (const schema of schemas) {
        const parsed = schema.safeParse(value);
        if (parsed.success) {
            return parsed.data;
        }
    }

    throw new Error('No union branch matched');
});

const discriminatedUnion = <T extends string, U extends Schema<any>[]>(discriminator: T, schemas: U): Schema<ReturnType<U[number]['parse']>> => new Schema((value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('Expected object');
    }

    const input = value as Record<string, unknown>;

    for (const schema of schemas) {
        const parsed = schema.safeParse(input);
        if (parsed.success && (parsed.data as Record<string, unknown>)[discriminator] === input[discriminator]) {
            return parsed.data;
        }
    }

    throw new Error('No discriminated union branch matched');
});

export const z = {
    object,
    literal,
    string,
    number,
    union,
    discriminatedUnion
};
