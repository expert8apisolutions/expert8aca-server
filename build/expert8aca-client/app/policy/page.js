"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Heading_1 = __importDefault(require("../utils/Heading"));
const Header_1 = __importDefault(require("../components/Header"));
const Footer_1 = __importDefault(require("../components/Footer"));
const Policy_1 = __importDefault(require("./Policy"));
const Page = (props) => {
    const [open, setOpen] = (0, react_1.useState)(false);
    const [activeItem, setActiveItem] = (0, react_1.useState)(5);
    const [route, setRoute] = (0, react_1.useState)("Login");
    return (<div>
      <Heading_1.default title="Policy - Elearning" description="Elearning is a learning management system for helping programmers." keywords="programming,mern"/>
      <Header_1.default open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} route={route}/>
      <Policy_1.default />
      <Footer_1.default />
    </div>);
};
exports.default = Page;
