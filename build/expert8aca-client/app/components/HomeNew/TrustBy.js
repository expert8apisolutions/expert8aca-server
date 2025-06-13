"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = __importDefault(require("next/image"));
const react_1 = __importDefault(require("react"));
const TrustBy = () => {
    return (<>
            <div className="w-full text-center bg-white h-[300px] flex items-center flex-col justify-center">
                <p data-aos="fade-up" data-aos-delay="700" className="text-black text-center text-[12px]  mb-5  dark:text-black">Trusted by the world’s best</p>
                <div data-aos="fade-up" data-aos-delay="800" className="flex gap-6 space-around items-center text-center justify-center">
                    <image_1.default src={'/brand1.png'} width={100} height={30} alt="" className="object-contain"/>
                    <image_1.default src={'/brand2.png'} width={100} height={30} alt="" className="object-contain"/>
                    <image_1.default src={'/brand3.png'} width={100} height={30} alt="" className="object-contain"/>
                    <image_1.default src={'/brand4.png'} width={100} height={30} alt="" className="object-contain"/>
                    <image_1.default src={'/brand5.png'} width={100} height={30} alt="" className="object-contain"/>
                </div>
            </div>
        </>);
};
exports.default = TrustBy;
