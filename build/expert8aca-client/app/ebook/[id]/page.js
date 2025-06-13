"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EbookDetailsPage_1 = __importDefault(require("@/app/components/Ebook/EbookDetailsPage"));
const react_1 = __importDefault(require("react"));
const page = ({ params }) => {
    return (<div><EbookDetailsPage_1.default id={params.id}/></div>);
};
exports.default = page;
