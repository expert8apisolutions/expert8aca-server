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
const style_1 = require("@/app/styles/style");
const react_1 = __importStar(require("react"));
const apiSlice_1 = require("@/redux/features/api/apiSlice");
const image_1 = __importDefault(require("next/image"));
const bs_1 = require("react-icons/bs");
const hi_1 = require("react-icons/hi");
const file_saver_1 = require("file-saver");
const material_1 = require("@mui/material");
const SimpleBackdrop_1 = __importDefault(require("../Loading/SimpleBackdrop"));
const ai_1 = require("react-icons/ai");
const navigation_1 = require("next/navigation");
const ModalPayment_1 = __importDefault(require("@/app/utils/ModalPayment"));
const SlipPaymentEbook_1 = __importDefault(require("../Payment/SlipPaymentEbook"));
const ordersApi_1 = require("@/redux/features/orders/ordersApi");
const EbookDetails = ({ data: ebookInfo, stripePromise, clientSecret, setRoute, setOpen: openAuthModal, }) => {
    const { data: userData, refetch } = (0, apiSlice_1.useLoadUserQuery)(undefined, {});
    const router = (0, navigation_1.useRouter)();
    const [user, setUser] = (0, react_1.useState)();
    const [open, setOpen] = (0, react_1.useState)(false);
    const [isLoadingBackDrop, setLoadingBackDrop] = (0, react_1.useState)(false);
    const [openModalDownLoad, setOpenModalDownLoad] = (0, react_1.useState)(false);
    const [createOrderEbook, { data: orderData, error, isLoading, isError }] = (0, ordersApi_1.useCreateOrderEbookMutation)();
    (0, react_1.useEffect)(() => {
        setUser(userData?.user);
    }, [userData]);
    const dicountPercentenge = ((ebookInfo?.estimatedPrice - ebookInfo.price) / ebookInfo?.estimatedPrice) * 100;
    const discountPercentengePrice = dicountPercentenge.toFixed(0);
    const isPurchased = user && user?.ebooks?.find((item) => item._id === ebookInfo._id);
    const isFree = ebookInfo?.price === 0;
    const handleOrder = (e) => {
        if (user) {
            if (isFree) {
                handleCreateOrder();
            }
            else {
                setOpen(true);
            }
        }
        else {
            setRoute("Login");
            openAuthModal(true);
        }
    };
    const saveFile = () => {
        (0, file_saver_1.saveAs)(`${process.env.NEXT_PUBLIC_ORIGIN_URI}/api/v1/get-ebook/${ebookInfo._id}/download`, `${ebookInfo.name}.pdf`);
    };
    const handleCreateOrder = async () => {
        createOrderEbook({ ebookId: ebookInfo._id, isFree: true, payment_info: {} }).unwrap().then((res) => {
            if (res) {
                setOpenModalDownLoad(true);
            }
        });
    };
    const handleClickView = () => {
        router.push(`/view-pdf/${ebookInfo._id}`);
    };
    return (<div>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5">
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          <div className="w-full 800px:w-[65%] 800px:pr-5 relative">
            <h1 className="text-[25px] font-Poppins font-[600]  ">
              {ebookInfo?.name}
            </h1>
            <div className=" mt-10 w-[90%]">
              &nbsp;{ebookInfo?.description}

            </div>

            <div className=" overflow-x-auto mt-10 bottom-0 w-[90%]">
              <table className="w-full text-sm text-left  dark:text-gray-400">
                <thead className="text-center text-xs  uppercase  dark:bg-gray-700 dark:text-gray-400">
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
                        <p>{ebookInfo?.totalPage} หน้า</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center flex-col gap-3">
                        <bs_1.BsFileEarmarkMinus className="text-xl"/>
                        <p> {ebookInfo?.totalSizeMB} MB</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center flex-col gap-3">
                        <bs_1.BsFilePdf className="text-xl"/>
                        <p> {ebookInfo?.fileType || 'PDF'}</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full 800px:w-[35%] relative">
            <div className="sticky top-[100px] left-0 z-50 w-full">
              {!!ebookInfo?.thumbnail?.url && (<image_1.default src={ebookInfo?.thumbnail?.url} width={400} height={350} alt=""/>)}
              <div className="flex items-center">
                <h1 className="pt-5 text-[25px]  ">
                  {isFree ? "Free" : ebookInfo?.price + "฿"}
                </h1>
                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80  ">
                  {ebookInfo?.estimatedPrice}฿
                </h5>

                <h4 className="pl-5 pt-4 text-[22px]  ">
                  {discountPercentengePrice}% Off
                </h4>
              </div>
              <div className="flex items-center gap-1 ">
                {isPurchased ? (<div className="flex gap-2 800px:w-[35%]">
                    <button onClick={handleClickView} className={`${style_1.styles.button} w-full my-3 font-Poppins cursor-pointer bg-[#47d097] hover:bg-[#37a074]`}>
                      <ai_1.AiFillEye style={{ fontSize: 20 }}/>&nbsp;
                      View
                    </button>
                  </div>) : (<div className={`${style_1.styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`} onClick={handleOrder}>
                    Buy Now {ebookInfo?.price}฿
                  </div>)}
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>    
      {ebookInfo ? <ModalPayment_1.default open={open} setOpen={setOpen}>
          <SlipPaymentEbook_1.default product={'ebook'} data={ebookInfo}/>
        </ModalPayment_1.default> : null}
      <>
        {openModalDownLoad && (<material_1.Modal open={openModalDownLoad} onClose={() => setOpenModalDownLoad(false)} aria-labelledby="modal-modal-title2" aria-describedby="modal-modal-description2">
            <material_1.Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
              <h1 className={`${style_1.styles.title}`}>
                EBook Already Download!
              </h1>
              <div className="flex w-full items-center justify-center mb-6 mt-4 text-center">
                <button onClick={saveFile} className={`${style_1.styles.button} !w-[190px] my-3 font-Poppins cursor-pointer bg-[#47d097]`}>
                  <hi_1.HiOutlineDownload style={{ fontSize: 20 }}/>&nbsp;
                  Download Now
                </button>

              </div>
            </material_1.Box>
          </material_1.Modal>)}
      </>
      <SimpleBackdrop_1.default open={isLoadingBackDrop} setOpen={setLoadingBackDrop}/>
    </div>);
};
exports.default = EbookDetails;
