"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOptions = void 0;
const next_auth_1 = __importDefault(require("next-auth"));
const google_1 = __importDefault(require("next-auth/providers/google"));
const github_1 = __importDefault(require("next-auth/providers/github"));
console.log(process.env.GOOGLE_CLIENT_ID, 'red');
exports.authOptions = {
    providers: [
        (0, google_1.default)({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        (0, github_1.default)({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        })
    ],
    secret: process.env.SECRET,
};
exports.default = (0, next_auth_1.default)(exports.authOptions);
