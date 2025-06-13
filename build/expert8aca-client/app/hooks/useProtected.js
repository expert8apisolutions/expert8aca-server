"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const navigation_1 = require("next/navigation");
const userAuth_1 = __importDefault(require("./userAuth"));
function Protected({ children }) {
    const isAuthenticated = (0, userAuth_1.default)();
    return isAuthenticated ? children : (0, navigation_1.redirect)("/");
}
exports.default = Protected;
