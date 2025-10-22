import { Request, Response } from "express";
import { IAnalyzedString } from "../model/stage1.model";
import { 
  analyzeAndCreateString, 
  getStringByValue,
  getAllStringsWithFilters,
  deleteString,
  getStringsByNaturalLanguage,
  ValidationError,
  ConflictError,
  NotFoundError
} from "../service/stage1.service";
import { create } from "ts-node";
import { error } from "console";


function formatAnalyzedString(doc: IAnalyzedString) {
return {
  id: doc.properties.sha256_hash,
  value: doc.value,
  properties: {
    length: doc.properties.length,
    is_palindrome: doc.properties.is_palindrome,
    unique_characters: doc.properties.unique_characters,
    word_count: doc.properties.word_count,
    sha256_hash: doc.properties.sha256_hash,
    character_frequency_map: doc.properties.character_frequency_map,
  },
  created_at: doc.created_at,
};
}

// POST - Create or analyze a string

export async function createString(req: Request, res: Response): Promise<void> {
  try {
    const {value} = req.body;

    if (value === undefined) {
      res.status(400).json({error: "Missing required field: 'value'"});
      return;
    }

    const created = await analyzeAndCreateString(String(value));
    res.status(201).json(formatAnalyzedString(created));
    
  } catch(error:any) {
    if (error instanceof ValidationError) {
      res.status(error.statusCode).json({error: error.message});
      return;
    }

    if (error instanceof ConflictError) {
      res.status(error.statusCode).json({error: error.message});
      return;
    }

    res.status(500).json({error: error?.message?? "Internal Server Error"});
  }
}

// GET - Get all strings (with optional filetrs)

export async function getALlStrings(req: Request, res: Response): Promise<void> {
  try {
    const filters = req.query;
    const results = await getAllStringsWithFilters(filters);

    const data = results.map(formatAnalyzedString);

    res.status(200).json({
      data,
      count:data.length,
      filters_applied: filters,
    });
  } catch (error:any) {
    if (error instanceof ValidationError){
      res.status(error.statusCode).json({error: error.message});
      return;
    }
    res.status(500).json({error:error?.message ?? "Internal Server Error"});
  }
}

// GET - '/strings/:value'

export async function getString(req: Request, res: Response): Promise<void> {
  try {
    const {value} = req.params;
    if (!value){
      res.status(400).json({error: "Missing path parameter: value"});
      return;
    }

    const result = await getStringByValue(value);
    res.status(200).json(formatAnalyzedString(result));
  } catch (error:any) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({error: error.message});
      return;
    }
    if (error instanceof ValidationError) {
      res.status(error.statusCode).json({error: error.message});
      return;
    }
    res.status(500).json({error: error?.message ?? "Internal Server Error"});
  }
}

//DELETE - '/strings/:value'

export async function deleteStringController(req:Request, res:Response) : Promise<void> {
  try {
    const {value} = req.params;

    if (!value) {
      res.status(400).json({error: "Missing path parameter: value"});
      return;
    }

    await deleteString(value);
    res.status(204).send();
  } catch(error: any){
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({error: error.message});
      return;
    }
    if (error instanceof ValidationError) {
      res.status(error.statusCode).json({error:error.message});
      return;
    }
    res.status(500).json({error: error?.message ?? "Internal Server Error"});
  }
}


// GET - 'strings/filter-by-natural-language?query=..'

export async function filterByNaturalLanguage(req: Request, res:Response): Promise<void> {
  try {
    const {query} = req.query;
    if (!query || typeof query !== 'string') {
      res.status(400).json({error: "Missing or invalid 'query' parameter"});
      return;
    }

    const {data, interpretedQuery} = await getStringsByNaturalLanguage(query);

    res.status(200).json({
      data: data.map(formatAnalyzedString),
      count: data.length,
      interpreted_query: interpretedQuery,
    });
  } catch (error:any) {
    if (error instanceof ValidationError) {
      res.status(error.statusCode).json({error: error.message});
      return;
    }
    res.status(500).json({error: error?.message ?? "Internal Server Error"});
    
  }
}
