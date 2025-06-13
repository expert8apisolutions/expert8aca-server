"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bs_1 = require("react-icons/bs");
const CallToAction = () => {
    return (<div className="w-full h-[74px] fixed bottom-[24px] px-[30px] z-[999] md:hidden">
            <div className="w-[100%] h-[100%] rounded-full">
                <div className="grid grid-cols-3 h-[100%]">
                    <a href="tel://0994569591" target="_blank" className="flex items-center justify-center bg-slate-400 rounded-l-full">
                        <bs_1.BsFillTelephoneFill style={{ fontSize: 30, color: 'white' }}/>
                    </a>
                    <a href="https://line.me/ti/p/5N4dECXfqL" target="_blank" className="flex items-center justify-center  bg-[#00b900]">
                        <bs_1.BsLine style={{ fontSize: 35, color: 'white' }}/>
                    </a>
                    <a href="https://www.facebook.com/experts8academy" target="_blank" className="flex items-center justify-center  bg-[#3c5a99] rounded-r-full">
                        <bs_1.BsFacebook style={{ fontSize: 35, color: 'white' }}/>
                    </a>
                </div>
            </div>
        </div>);
};
exports.default = CallToAction;
