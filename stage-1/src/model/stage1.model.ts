import mongoose, {Schema, Document} from "mongoose";

export interface IAnalyzedString extends Document {
  value : string;
  properties: {
    length: number;
    is_palindrome: boolean;
    unique_characters: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: Record<string,number>;
  };
  created_at: Date;
}

const AnalyzedStringSchema = new Schema<IAnalyzedString> ({
  value: {
    type: String,
    required: true,
  },
  properties : {
    length: {type: Number, required: true},
    is_palindrome: {type: Boolean, required: true},
    unique_characters: {type: Number, required:true},
    word_count: {type:Number, required:true},
    sha256_hash: {type:String, required:true, unique:true},
    character_frequency_map: {type:Object, required: true},
  },
  created_at: {
    type:Date,
    default:Date.now,
  },
});

export const AnalyzedString = mongoose.model<IAnalyzedString>(
  "AnalyzedString",
  AnalyzedStringSchema
);