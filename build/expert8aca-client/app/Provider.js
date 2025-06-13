"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Providers = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const store_1 = require("../redux/features/store");
function Providers({ children }) {
    return <react_redux_1.Provider store={store_1.store}>{children}</react_redux_1.Provider>;
}
exports.Providers = Providers;
