"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// import default react-pdf entry
const react_pdf_1 = require("react-pdf");
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`
const pdf_worker_1 = __importDefault(require("./pdf-worker"));
react_pdf_1.pdfjs.GlobalWorkerOptions.workerSrc = pdf_worker_1.default;
function PDFViewer({ link }) {
    const [file, setFile] = (0, react_1.useState)("./sample-file.pdf");
    const [numPages, setNumPages] = (0, react_1.useState)(null);
    function onFileChange(event) {
        setFile(event.target.files[0]);
    }
    function onDocumentLoadSuccess({ numPages: nextNumPages }) {
        setNumPages(nextNumPages);
    }
    return (<div>
            <div className="w-full flex justify-center ">
                <react_pdf_1.Document file={link} onLoadSuccess={onDocumentLoadSuccess}>
                    {Array.from({ length: numPages }, (_, index) => (<react_pdf_1.Page key={`page_${index + 1}`} pageNumber={index + 1} renderAnnotationLayer={false} renderTextLayer={false}/>))}
                </react_pdf_1.Document>
            </div>
        </div>);
}
exports.default = PDFViewer;
