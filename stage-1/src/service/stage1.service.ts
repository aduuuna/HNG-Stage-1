import crypto from 'crypto';
import { AnalyzedString, IAnalyzedString } from "../model/stage1.model";

// CUSTOM ERROR CLASSES

export class ValidationError extends Error {
  statusCode = 422;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends Error {
  statusCode = 409;
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}


// HELPER FUNCTIONS


function palindrome(value: string): boolean {
  const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, '');
  const reversed = cleaned.split('').reverse().join('');
  return cleaned === reversed;
}

function frequencyOfCharacters(value: string): Record<string, number> {
  const frequencyHash: Record<string, number> = {};
  for (const char of value) {
    frequencyHash[char] = (frequencyHash[char] ?? 0) + 1;
  }
  return frequencyHash;
}

function uniqueCharacters(value: string): number {
  return new Set(value).size;
}

function lengthOfCharacters(value: string): number {
  return value.length;
}

function wordCount(value: string): number {
  if (value.trim() === '') return 0;
  const words = value.trim().split(/\s+/);
  return words.length;
}

function generateSha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}


// MAIN SERVICE FUNCTIONS


export async function analyzeAndCreateString(value: string): Promise<IAnalyzedString> {
  if (typeof value !== 'string') {
    throw new ValidationError("Invalid data type for 'value'. Must be a string.");
  }

  if (value.trim() === '') {
    throw new ValidationError("Value cannot be empty.");
  }

  const sha256_hash = generateSha256(value);

  const existing = await AnalyzedString.findOne({ "properties.sha256_hash": sha256_hash });
  if (existing) {
    throw new ConflictError("String already exists.");
  }

  const analyzedData = {
    length: lengthOfCharacters(value),
    is_palindrome: palindrome(value),
    unique_characters: uniqueCharacters(value),
    word_count: wordCount(value),
    sha256_hash,
    character_frequency_map: frequencyOfCharacters(value),
  };

  const newString = new AnalyzedString({
    value,
    properties: analyzedData,
  });

  await newString.save();
  return newString;
}

export async function getStringByValue(value: string): Promise<IAnalyzedString> {
  const sha256_hash = generateSha256(value);
  const result = await AnalyzedString.findOne({ "properties.sha256_hash": sha256_hash });

  if (!result) {
    throw new NotFoundError(`No analyzed string found for value: "${value}"`);
  }

  return result;
}

export async function getAllStringsWithFilters(filters: any): Promise<IAnalyzedString[]> {
  const query: any = {};

  if (filters.is_palindrome !== undefined) {
    query["properties.is_palindrome"] = filters.is_palindrome === "true" || filters.is_palindrome === true;
  }

  if (filters.min_length || filters.max_length) {
    query["properties.length"] = {};
    if (filters.min_length) {
      query["properties.length"].$gte = Number(filters.min_length);
    }
    if (filters.max_length) {
      query["properties.length"].$lte = Number(filters.max_length);
    }
  }

  if (filters.word_count) {
    query["properties.word_count"] = Number(filters.word_count);
  }

  if (filters.contains_character) {
    const char = filters.contains_character;
    query[`properties.character_frequency_map.${char}`] = { $exists: true };
  }

  const results = await AnalyzedString.find(query).sort({ created_at: -1 });
  return results;
}

export async function deleteString(value: string): Promise<boolean> {
  const sha256_hash = generateSha256(value);
  const deleted = await AnalyzedString.findOneAndDelete({ "properties.sha256_hash": sha256_hash });
  
  if (!deleted) {
    throw new NotFoundError("String does not exist in the system");
  }
  
  return true;
}


// NATURAL LANGUAGE QUERY PARSING


export function parseNaturalLanguageQuery(query: string): any {
  const filters: any = {};
  const lowerQuery = query.toLowerCase();

  // Single word
  if (lowerQuery.includes('single word') || lowerQuery.includes('one word')) {
    filters.word_count = 1;
  }

  // Palindrome
  if (lowerQuery.includes('palindrome') || lowerQuery.includes('palindromic')) {
    filters.is_palindrome = true;
  }

  // Length comparisons
  const longerThanMatch = lowerQuery.match(/longer than (\d+)/);
  if (longerThanMatch && longerThanMatch[1]) {
    filters.min_length = parseInt(longerThanMatch[1]) + 1;
  }

  const shorterThanMatch = lowerQuery.match(/shorter than (\d+)/);
  if (shorterThanMatch && shorterThanMatch[1]) {
    filters.max_length = parseInt(shorterThanMatch[1]) - 1;
  }

  // Contains letter
  const containsLetterMatch = lowerQuery.match(/contain(?:s|ing)? (?:the )?letter ([a-z])/);
  if (containsLetterMatch) {
    filters.contains_character = containsLetterMatch[1];
  }

  // First vowel
  if (lowerQuery.includes('first vowel')) {
    filters.contains_character = 'a';
  }

  // Word count patterns
  const wordCountMatch = lowerQuery.match(/(\d+)[- ]word/);
  if (wordCountMatch && wordCountMatch[1]) {
    filters.word_count = parseInt(wordCountMatch[1]);
  }

  if (Object.keys(filters).length === 0) {
    throw new ValidationError('Unable to parse natural language query');
  }

  return filters;
}

export async function getStringsByNaturalLanguage(query: string): Promise<{
  data: IAnalyzedString[];
  interpretedQuery: {
    original: string;
    parsed_filters: any;
  };
}> {
  const parsedFilters = parseNaturalLanguageQuery(query);
  const results = await getAllStringsWithFilters(parsedFilters);

  return {
    data: results,
    interpretedQuery: {
      original: query,
      parsed_filters: parsedFilters
    }
  };
}