"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revalidate = exports.metadata = void 0;
const Home_1 = __importDefault(require("./components/HomeNew/Home"));
exports.metadata = {
    title: "Expert8 Academy พัฒนาซอฟเเวร์โดย ai ครบวงจร",
    description: "สอนการเขียนซอฟเเวร์โดยใช้เเค่ ai",
    keywords: "ONLINE,course,study,ระบบเรียนออนไลน์,ทำคอร์สเรียนออนไลน์ ทำระบบการเรียนออนไลน์ ทำกราฟฟิก ตัดต่อวีดีโอ เเละดูเเลการยิงโฆษณา ",
    openGraph: {
        title: "Expert8 Academy พัฒนาซอฟเเวร์โดย ai ครบวงจร",
        description: "สอนการเขียนซอฟเเวร์โดยใช้เเค่ ai",
        url: "https://www.expert8academy.com",
        siteName: "Expert8 academy",
        images: [
            {
                url: "https://res.cloudinary.com/dzq52nvuo/image/upload/v1710772494/qxjhq8ix68pj3irar9x7.jpg",
                width: 800,
                height: 600,
            },
        ],
        locale: "th-TH",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "Expert8 Academy พัฒนาซอฟเเวร์โดย ai ครบวงจร",
        description: "สอนการเขียนซอฟเเวร์โดยใช้เเค่ ai",
        images: [
            "https://res.cloudinary.com/dzq52nvuo/image/upload/v1710772494/qxjhq8ix68pj3irar9x7.jpg",
        ],
    },
};
exports.revalidate = 180;
// http://localhost:8000/api/v1/get-layout/Banner
const Page = async () => {
    console.log("porcess env =>", process.env.NEXT_PUBLIC_SERVER_URI);
    const pmBanner = fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/get-layout/Banner`, {});
    const pmCategory = fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/get-layout/Categories`, {});
    const [resBanner, resCategory] = await Promise.all([pmBanner, pmCategory]);
    const banner = await resBanner.json();
    const category = await resCategory.json();
    const webInfo = {
        banner: banner?.layout?.banner || {},
        category: category?.layout?.categories || [],
    };
    return <Home_1.default webInfo={webInfo}/>;
};
exports.default = Page;
