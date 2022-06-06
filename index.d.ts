declare module 'mongoose-nanoid'

import { Schema } from 'mongoose'

interface Options {
    field?: String;
    length?: number;
    alphabets?: boolean;
}

export default function nanoidPlugin(schema: Schema, options?: Options | number): void
