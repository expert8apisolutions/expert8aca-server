"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = void 0;
const FileLayout_1 = __importDefault(require("./FileLayout"));
exports.dynamic = "force-dynamic";
async function Page() {
    return (<div className="text-black w-[80%] m-auto mt-24">
      <FileLayout_1.default />
    </div>);
}
exports.default = Page;
