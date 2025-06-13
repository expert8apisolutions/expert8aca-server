"use strict";
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
const Loader_1 = __importDefault(require("../Loader/Loader"));
const ebookApi_1 = require("@/redux/features/ebooks/ebookApi");
const style_1 = require("@/app/styles/style");
const bs_1 = require("react-icons/bs");
const image_1 = __importDefault(require("next/image"));
const EbookContent = ({ id, user }) => {
    const { data: contentData, isLoading, refetch } = (0, ebookApi_1.useGetEbookDetailQuery)(id, { refetchOnMountOrArgChange: true });
    const [open, setOpen] = (0, react_1.useState)(false);
    const [route, setRoute] = (0, react_1.useState)('Login');
    const data = contentData?.ebook;
    const [activeVideo, setActiveVideo] = (0, react_1.useState)(0);
    return (<>
      {isLoading ? (<Loader_1.default />) : (<>
          <div>
            <div className="w-[90%] 800px:w-[90%] m-auto py-5">
              <div className="w-full flex flex-col-reverse 800px:flex-row">
                <div className="w-full 800px:w-[65%] 800px:pr-5 relative">
                  <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                    {data.name}
                  </h1>
                  <div className="dark:text-white mt-10 w-[90%]">
                    &nbsp;{data.description}

                  </div>

                  <div className=" overflow-x-auto mt-10 bottom-0 w-[90%]">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-center text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            จำนวนหน้า
                          </th>
                          <th scope="col" className="px-6 py-3">
                            ขนาดไฟล์
                          </th>
                          <th scope="col" className="px-6 py-3">
                            ประเภทไฟล์
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className=" border-b dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-6 py-4">
                            <div className="flex items-center flex-col gap-3">
                              <bs_1.BsBook className="text-xl"/>
                              <p>{data?.totalPage} หน้า</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center flex-col gap-3">
                              <bs_1.BsFileEarmarkMinus className="text-xl"/>
                              <p> {data?.totalSizeMB} MB</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center flex-col gap-3">
                              <bs_1.BsFilePdf className="text-xl"/>
                              <p> {data.fileType}</p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="w-full 800px:w-[35%] relative">
                  <div className="sticky top-[100px] left-0 z-50 w-full">
                    <image_1.default src={data.thumbnail.url} width={400} height={350} alt=""/>
                    <div className="flex items-center">
                  
                        <div className={`${style_1.styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}>
                          Download Now
                        </div>
                    </div>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>)}
    </>);
};
exports.default = EbookContent;
