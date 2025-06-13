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
const AdminSidebar_1 = __importDefault(require("../../../components/Admin/sidebar/AdminSidebar"));
const Heading_1 = __importDefault(require("../../../utils/Heading"));
const DashboardHeader_1 = __importDefault(require("../../../components/Admin/DashboardHeader"));
const material_1 = require("@mui/material");
const style_1 = require("@/app/styles/style");
const Image_1 = __importDefault(require("@mui/icons-material/Image"));
const PictureAsPdf_1 = __importDefault(require("@mui/icons-material/PictureAsPdf"));
const ebookApi_1 = require("@/redux/features/ebooks/ebookApi");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const navigation_1 = require("next/navigation");
const SimpleBackdrop_1 = __importDefault(require("@/app/components/Loading/SimpleBackdrop"));
const page = ({ params }) => {
    const id = params?.id;
    const { data, error: errorDetail, isLoading: isLoadingDetail, isSuccess: isSuccessDetail, refetch } = (0, ebookApi_1.useGetEbookDetailAdminQuery)(id, { refetchOnMountOrArgChange: true });
    const [editEbook, { isSuccess, error, isLoading }] = (0, ebookApi_1.useEditEbookMutation)({});
    const [ebookInfo, setEbookInfo] = (0, react_1.useState)({});
    const [dragging, setDragging] = (0, react_1.useState)(false);
    const [filePdf, setFilePdf] = (0, react_1.useState)(null);
    const [filePdfInfo, setFilePdfInfo] = (0, react_1.useState)(null);
    const [fileImg, setFileImg] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (isSuccessDetail) {
            setEbookInfo(data.ebook);
            refetch();
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error;
                react_hot_toast_1.default.error(errorMessage.data.message);
            }
        }
    }, [data, errorDetail, isSuccessDetail]);
    const resetState = () => {
        setEbookInfo({});
        setFilePdf(null);
        setFilePdfInfo(null);
        setFileImg(null);
    };
    (0, react_1.useEffect)(() => {
        if (isSuccess) {
            react_hot_toast_1.default.success("Edit ebook successfully");
            resetState();
            (0, navigation_1.redirect)("/admin/ebook");
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error;
                react_hot_toast_1.default.error(errorMessage.data.message);
            }
        }
    }, [isSuccess, error]);
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            name: ebookInfo.name,
            filename: filePdfInfo ? filePdfInfo.name : ebookInfo.filename,
            description: ebookInfo.description,
            price: +ebookInfo.price,
            totalPage: +ebookInfo.totalPage,
            estimatedPrice: +ebookInfo.estimatedPrice,
            filePdfSize: filePdfInfo ? +(filePdfInfo.size / (1024 * 1024)).toFixed(2) : ebookInfo.totalSizeMB,
            filePdf,
            fileImg,
        };
        editEbook({ id, data });
    };
    const handleFilePDFChange = (e) => {
        const file = e.target.files?.[0];
        console.log("🚀 ~ file: page.tsx:28 ~ handleFilePDFChange ~ file:", file);
        if (file) {
            setFilePdfInfo(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                if (reader.readyState === 2) {
                    // setEbookInfo({ ...ebookInfo, pdfFile: reader.result });
                    setFilePdf(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    const handleFileImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (reader.readyState === 2) {
                    // setEbookInfo({ ...ebookInfo, thumbnail: reader.result });
                    setFileImg(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                // setEbookInfo({ ...ebookInfo, thumbnail: reader.result });
                setFileImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return (<div>
      <Heading_1.default title="Elearning - Admin" description="ELearning is a platform for students to learn and get help from teachers" keywords="Prograaming,MERN,Redux,Machine Learning"/>
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar_1.default />
        </div>
        <div className="w-[85%]">
          <DashboardHeader_1.default />
          <div className="w-full flex min-h-screen">
            <material_1.Box className="w-[80%]">
              <div className="w-[80%] m-auto mt-24">
                <form onSubmit={handleSubmit} className={`${style_1.styles.label}`}>
                  <div>
                    <label htmlFor="">Name</label>
                    <input type="name" name="" required value={ebookInfo.name} onChange={(e) => setEbookInfo({ ...ebookInfo, name: e.target.value })} id="name" placeholder="MERN stack LMS platform with next 13" className={`
            ${style_1.styles.input}`}/>
                  </div>
                  <br />
                  <div className="mb-5">
                    <label className={`${style_1.styles.label}`}>Description</label>
                    <textarea name="" id="" cols={30} rows={8} placeholder="Write something amazing..." className={`${style_1.styles.input} !h-min !py-2`} value={ebookInfo.description} onChange={(e) => setEbookInfo({
            ...ebookInfo,
            description: e.target.value,
        })}></textarea>
                  </div>
                  <br />
                  <div className="w-full flex justify-between">
                    <div className="w-[45%]">
                      <label className={`${style_1.styles.label}`}>Price</label>
                      <input type="number" name="" required value={ebookInfo.price} onChange={(e) => setEbookInfo({ ...ebookInfo, price: e.target.value })} id="price" placeholder="29" className={`${style_1.styles.input}`}/>
                    </div>
                    <div className="w-[50%]">
                      <label className={`${style_1.styles.label} w-[50%]`}>
                        Estimated Price (optional)
                      </label>
                      <input type="number" name="" value={ebookInfo.estimatedPrice} onChange={(e) => setEbookInfo({
            ...ebookInfo,
            estimatedPrice: e.target.value,
        })} id="price" placeholder="79" className={` ${style_1.styles.input}`}/>
                    </div>
                  </div>
                  <br />
                  <div className="w-full flex justify-between">
                    <div className="w-[45%]">
                      <label className={`${style_1.styles.label}`}>Total Page</label>
                      <input type="number" name="" required value={ebookInfo.totalPage} onChange={(e) => setEbookInfo({
            ...ebookInfo,
            totalPage: e.target.value,
        })} id="totalPage" placeholder="29" className={`${style_1.styles.input}`}/>
                    </div>
                    <div className="w-[50%]">
                      {/* <label className={`${styles.label}`}></label> */}

                      {/* <input
          type="file"
          name=""
          required
          value={ebookInfo.price}
          onChange={handleFilePDFChange}
          id="price"
          placeholder=".pdf"
          className={`${styles.input}`}
        /> */}
                    </div>
                  </div>
                  <br />
                  <div className="w-full flex justify-between">
                    <input type="file" accept="application/pdf" id="pdfFile" className="hidden" onChange={handleFilePDFChange}/>
                    <label htmlFor="pdfFile" 
    // className={`${styles.input}`}
    className={` w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${dragging ? "bg-blue-500" : "bg-transparent"}`}>
                      {(filePdfInfo || ebookInfo?.filename) ? (<div>
                          <div>{filePdfInfo?.name || ebookInfo?.filename}</div>
                          <div>
                            file size:{" "}
                            {((filePdfInfo?.size / (1024 * 1024)) || ebookInfo?.totalSizeMB).toFixed(2)} MB
                          </div>
                        </div>) : (<span className="text-black dark:text-white">
                          <PictureAsPdf_1.default /> Drag and drop PDF File here or
                          click to browse
                        </span>)}
                    </label>
                  </div>
                  <br />
                  <div className="w-full">
                    <input type="file" accept="image/*" id="file" className="hidden" onChange={handleFileImageChange}/>
                    <label htmlFor="file" className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${dragging ? "bg-blue-500" : "bg-transparent"}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                      {ebookInfo?.thumbnail?.url || fileImg ? (<img src={fileImg || ebookInfo?.thumbnail?.url} alt="" className="max-h-full w-full object-cover"/>) : (<span className="text-black dark:text-white">
                          <Image_1.default /> Drag and drop your thumbnail here or
                          click to browse
                        </span>)}
                    </label>
                  </div>
                  <br />
                  {/* <div className="w-full">
                              <input
                                  type="file"
                                  accept="image/*"
                                  id="file"
                                  className="hidden"
                                  onChange={handleFileImageChange}
                              />
                              <label
                                  htmlFor="file"
                                  className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${dragging ? "bg-blue-500" : "bg-transparent"
                                      }`}
                                  onDragOver={handleDragOver}
                                  onDragLeave={handleDragLeave}
                                  onDrop={handleDrop}
                              >
                                  {ebookInfo.thumbnail ? (
                                      <img
                                          src={ebookInfo.thumbnail}
                                          alt=""
                                          className="max-h-full w-full object-cover"
                                      />
                                  ) : (
                                      <span className="text-black dark:text-white">
                                          Drag and drop your thumbnail here or click to browse
                                      </span>
                                  )}
                              </label>
                          </div> */}
                  <br />
                  <div className="w-full flex items-center justify-end">
                    <input type="submit" value="Save" className="w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"/>
                  </div>
                  <br />
                  <br />
                </form>
              </div>
            </material_1.Box>
          </div>
        </div>
      </div>
      <SimpleBackdrop_1.default open={isLoading} setOpen={() => { }}/>
    </div>);
};
exports.default = page;
