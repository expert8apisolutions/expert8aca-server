"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.navItemsData = void 0;
const link_1 = __importDefault(require("next/link"));
const react_1 = __importDefault(require("react"));
exports.navItemsData = [
    {
        name: "หน้าเเรก",
        url: "/",
    },
    {
        name: "คอร์สเรียน",
        url: "/courses",
    },
    {
        name: "อีบุ๊ค",
        url: "/ebook",
    },
    {
        name: "บล๊อค",
        url: "/blog",
    },
    {
        name: "เกี่ยวกับ",
        url: "/about",
    },
    {
        name: "คำถามที่เจอบ่อย",
        url: "/faq",
    },
];
const NavItems = ({ activeItem, isMobile }) => {
    return (<>
      <div className="hidden 800px:flex">
        {exports.navItemsData &&
            exports.navItemsData.map((i, index) => (<link_1.default href={`${i.url}`} key={index} passHref>
              <span className={`${activeItem === index
                    ? "text-[#008AFC] font-bold"
                    : "dark:text-white text-black"} text-[18px] px-6 font-Poppins font-[400]`}>
                {i.name}
              </span>
            </link_1.default>))}
      </div>
      {isMobile && (<div className="800px:hidden mt-5">
          <div className="w-full text-center py-6">
            <link_1.default href={"/"} passHref>
              <span className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}>ELearning</span>
            </link_1.default>
          </div>
          {exports.navItemsData &&
                exports.navItemsData.map((i, index) => (<link_1.default href={`${i.url}`} passHref key={index}>
                <span className={`${activeItem === index
                        ? "text-[#008AFC] font-bold"
                        : "dark:text-white text-black"} block py-5 text-[18px] px-6 font-Poppins font-[400]`}>
                  {i.name}
                </span>
              </link_1.default>))}
        </div>)}
    </>);
};
exports.default = NavItems;
