"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createString = createString;
exports.getALlStrings = getALlStrings;
exports.getString = getString;
exports.deleteStringController = deleteStringController;
exports.filterByNaturalLanguage = filterByNaturalLanguage;
const stage1_service_1 = require("../service/stage1.service");
function formatAnalyzedString(doc) {
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
        creates_at: doc.created_at,
    };
}
// POST - Create or analyze a string
async function createString(req, res) {
    try {
        const { value } = req.body;
        if (value === undefined) {
            res.status(400).json({ error: "Missing required field: 'value'" });
            return;
        }
        const created = await (0, stage1_service_1.analyzeAndCreateString)(String(value));
        res.status(201).json(formatAnalyzedString(created));
    }
    catch (error) {
        if (error instanceof stage1_service_1.ValidationError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        if (error instanceof stage1_service_1.ConflictError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
}
// GET - Get all strings (with optional filetrs)
async function getALlStrings(req, res) {
    try {
        const filters = req.query;
        const results = await (0, stage1_service_1.getAllStringsWithFilters)(filters);
        const data = results.map(formatAnalyzedString);
        res.status(200).json({
            data,
            count: data.length,
            filters_applied: filters,
        });
    }
    catch (error) {
        if (error instanceof stage1_service_1.ValidationError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
}
// GET - '/strings/:value'
async function getString(req, res) {
    try {
        const { value } = req.params;
        if (!value) {
            res.status(400).json({ error: "Missing path parameter: value" });
            return;
        }
        const result = await (0, stage1_service_1.getStringByValue)(value);
        res.status(200).json(formatAnalyzedString(result));
    }
    catch (error) {
        if (error instanceof stage1_service_1.NotFoundError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        if (error instanceof stage1_service_1.ValidationError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
}
//DELETE - '/strings/:value'
async function deleteStringController(req, res) {
    try {
        const { value } = req.params;
        if (!value) {
            res.status(400).json({ error: "Missing path parameter: value" });
            return;
        }
        await (0, stage1_service_1.deleteString)(value);
        res.status(204).send();
    }
    catch (error) {
        if (error instanceof stage1_service_1.NotFoundError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        if (error instanceof stage1_service_1.ValidationError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
}
// GET - 'strings/filter-by-natural-language?query=..'
async function filterByNaturalLanguage(req, res) {
    try {
        const q = req.query;
        if (!q || typeof q !== 'string') {
            res.status(400).json({ error: "Missing or invalid 'query' parameter" });
            return;
        }
        const { data, interpretedQuery } = await (0, stage1_service_1.getStringsByNaturalLanguage)(q);
        res.status(200).json({
            data: data.map(formatAnalyzedString),
            count: data.length,
            interpreted_query: interpretedQuery,
        });
    }
    catch (error) {
        if (error instanceof stage1_service_1.ValidationError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: error?.message ?? "Internal Server Error" });
    }
}
//# sourceMappingURL=stage1.controller.js.map