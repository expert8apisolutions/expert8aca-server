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
const Header_1 = __importDefault(require("../../components/Header"));
const Footer_1 = __importDefault(require("../../components/Footer"));
const core_1 = require("@react-pdf-viewer/core");
const default_layout_1 = require("@react-pdf-viewer/default-layout");
require("@react-pdf-viewer/core/lib/styles/index.css");
require("@react-pdf-viewer/default-layout/lib/styles/index.css");
const navigation_1 = require("next/navigation");
const axios_1 = __importDefault(require("axios"));
const Loader_1 = __importDefault(require("@/app/components/Loader/Loader"));
const page = ({ params }) => {
    const [open, setOpen] = (0, react_1.useState)(false);
    // const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [activeItem, setActiveItem] = (0, react_1.useState)(2);
    const [route, setRoute] = (0, react_1.useState)("Login");
    const searchParams = (0, navigation_1.useSearchParams)();
    const paymentToken = searchParams?.get("ptoken");
    (0, react_1.useEffect)(() => {
        // if(paymentToken){
        //     checkPaymentToken()
        // }
    }, []);
    const checkPaymentToken = async () => {
        try {
            const result = await axios_1.default.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/create-order-ebook-postback?payment_token=${paymentToken}`);
        }
        catch (err) {
        }
        window.location.href = `/view-pdf/${params.id}`;
    };
    (0, react_1.useEffect)(() => {
        if (!paymentToken) {
            function handleContextMenu(e) {
                e.preventDefault(); // prevents the default right-click menu from appearing
            }
            // add the event listener to the component's root element
            const rootElement = document.getElementById('my-component');
            rootElement.addEventListener('contextmenu', handleContextMenu);
            // remove the event listener when the component is unmounted
            return () => {
                rootElement.removeEventListener('contextmenu', handleContextMenu);
            };
        }
    }, []);
    const transform = (slot) => ({
        ...slot,
        Download: () => <></>,
        DownloadMenuItem: () => <></>,
        EnterFullScreen: () => <></>,
        EnterFullScreenMenuItem: () => <></>,
        SwitchTheme: () => <></>,
        SwitchThemeMenuItem: () => <></>,
        Print: () => <></>,
        PrintMenuItem: () => <></>,
    });
    const renderToolbar = (Toolbar) => (<Toolbar>{renderDefaultToolbar(transform)}</Toolbar>);
    const defaultLayoutPluginInstance = (0, default_layout_1.defaultLayoutPlugin)({
        renderToolbar,
    });
    const { renderDefaultToolbar } = defaultLayoutPluginInstance.toolbarPluginInstance;
    if (paymentToken) {
        return <Loader_1.default />;
    }
    return (<>
            <Header_1.default open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} route={route}/>
            <div className='w-full text-center py-10'>
                <core_1.Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                    <div style={{ height: '750px' }} id="my-component">
                        <core_1.Viewer withCredentials={true} fileUrl={`${process.env.NEXT_PUBLIC_ORIGIN_URI}/api/v1/get-ebook/${params.id}/download`} plugins={[
            defaultLayoutPluginInstance,
        ]}/>
                    </div>
                </core_1.Worker>
            </div>
            <Footer_1.default />

        </>);
};
exports.default = page;
