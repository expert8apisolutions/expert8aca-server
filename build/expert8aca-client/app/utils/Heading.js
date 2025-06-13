"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Heading = ({ title, description, keywords }) => {
    return (<>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta name="description" content={description}/>
      <meta name="keywords" content={keywords}/>
    </>);
};
exports.default = Heading;
