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
require("./globals.css");
const google_1 = require("next/font/google");
const google_2 = require("next/font/google");
const theme_provider_1 = require("./utils/theme-provider");
const react_hot_toast_1 = require("react-hot-toast");
const Provider_1 = require("./Provider");
const react_1 = require("next-auth/react");
const react_2 = __importStar(require("react"));
const apiSlice_1 = require("@/redux/features/api/apiSlice");
const Loader_1 = __importDefault(require("./components/Loader/Loader"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = (0, socket_io_client_1.default)(ENDPOINT, { transports: ["websocket"] });
const poppins = (0, google_1.Anuphan)({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-Poppins",
});
const josefin = (0, google_2.Josefin_Sans)({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-Josefin",
});
function RootLayout({ children, }) {
    (0, react_2.useEffect)(() => {
        window.localStorage.setItem('theme', 'light');
    }, []);
    return (<html lang="en" suppressHydrationWarning={true}>
      <body className={`${poppins.variable} ${josefin.variable} bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}>
        <Provider_1.Providers>
          <react_1.SessionProvider>
            <theme_provider_1.ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Custom>

                <div>{children}</div>
              </Custom>
              <react_hot_toast_1.Toaster position="top-center" reverseOrder={false}/>
            </theme_provider_1.ThemeProvider>
          </react_1.SessionProvider>
        </Provider_1.Providers>
      </body>
    </html>);
}
exports.default = RootLayout;
const Custom = ({ children }) => {
    const { isLoading } = (0, apiSlice_1.useLoadUserQuery)({});
    const { data: session } = (0, react_1.useSession)();
    (0, react_2.useEffect)(() => {
        socketId.on("connection", () => { });
    }, []);
    return <div>{(isLoading && session) ? <Loader_1.default /> : <div className="font-Poppins">{children} </div>}</div>;
    // return <div>{children} </div>
};
