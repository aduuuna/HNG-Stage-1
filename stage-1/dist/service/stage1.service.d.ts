import { IAnalyzedString } from "../model/stage1.model";
export declare class ValidationError extends Error {
    statusCode: number;
    constructor(message: string);
}
export declare class ConflictError extends Error {
    statusCode: number;
    constructor(message: string);
}
export declare class NotFoundError extends Error {
    statusCode: number;
    constructor(message: string);
}
export declare function analyzeAndCreateString(value: string): Promise<IAnalyzedString>;
export declare function getStringByValue(value: string): Promise<IAnalyzedString>;
export declare function getAllStringsWithFilters(filters: any): Promise<IAnalyzedString[]>;
export declare function deleteString(value: string): Promise<boolean>;
export declare function parseNaturalLanguageQuery(query: string): any;
export declare function getStringsByNaturalLanguage(query: string): Promise<{
    data: IAnalyzedString[];
    interpretedQuery: {
        original: string;
        parsed_filters: any;
    };
}>;
//# sourceMappingURL=stage1.service.d.ts.map