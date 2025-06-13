"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_slick_1 = __importDefault(require("react-slick"));
const image_1 = __importDefault(require("next/image"));
const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    // className: 'notes-slider',
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
        {
            breakpoint: 450,
            settings: {
                slidesToShow: 1,
            },
        },
        {
            breakpoint: 700,
            settings: {
                slidesToShow: 2,
            },
        },
        {
            breakpoint: 1300,
            settings: {
                slidesToShow: 3,
            },
        },
    ]
};
const TopCategory = ({ categoty = [] }) => {
    return (<>
            <div className="w-full bg-white ">
                <p data-aos="fade-up" data-aos-delay="300" className="text-[#000000c7] text-center font-bold text-[30px] pb-5 ">Top Categories</p>
            </div>
            <div className="w-full pt-5 pb-20 bg-white ">
                <div className="max-w-[60%] m-auto" data-aos="fade-up" data-aos-delay="400">
                    <react_slick_1.default {...settings}>
                        {categoty.map((ele) => <CategoriesItem key={ele._id} title={ele.title}/>)}
                    </react_slick_1.default>
                </div>

            </div>
        </>);
};
function CategoriesItem({ title = '' }) {
    return (<>
            <div className="w-[180px] h-[231px] max-w-[200px] rounded-md bg-[#EEF2F6] py-[25px] px-[38px] text-center items-center justify-center">
                <div className="bg-white rounded-full h-[100px] w-[100px] flex items-center justify-center text-center p-3">
                    <image_1.default src={'/brand5.png'} width={100} height={30} alt="" className="object-contain "/>
                </div>
                <div className="text-black text-[16px] font-Poppins font-bold mt-[13px]">{title}</div>
                {/* <div className=" text-xs mt-2 text-[#4f547b] font-normal">1 Course</div> */}
            </div>
        </>);
}
exports.default = TopCategory;
