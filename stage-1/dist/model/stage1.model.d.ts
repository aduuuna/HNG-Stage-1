import mongoose, { Document } from "mongoose";
export interface IAnalyzedString extends Document {
    value: string;
    properties: {
        length: number;
        is_palindrome: boolean;
        unique_characters: number;
        word_count: number;
        sha256_hash: string;
        character_frequency_map: Record<string, number>;
    };
    created_at: Date;
}
export declare const AnalyzedString: mongoose.Model<IAnalyzedString, {}, {}, {}, mongoose.Document<unknown, {}, IAnalyzedString, {}, {}> & IAnalyzedString & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=stage1.model.d.ts.map