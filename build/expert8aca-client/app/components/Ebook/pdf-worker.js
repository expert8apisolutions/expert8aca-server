"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_worker_min_js_1 = __importDefault(require("pdfjs-dist/build/pdf.worker.min.js"));
// import pdfWorkerMinDev from "pdfjs-dist/build/pdf.worker.js";
exports.default = pdf_worker_min_js_1.default;
// if (process.env.NODE_ENV === "production") {
//     // use minified verion for production
// } else {
//     module.exports = require("pdfjs-dist/build/pdf.worker.js");
// }
