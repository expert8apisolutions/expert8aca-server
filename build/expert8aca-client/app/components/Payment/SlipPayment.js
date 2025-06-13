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
const image_1 = __importDefault(require("next/image"));
const react_1 = __importStar(require("react"));
const fa6_1 = require("react-icons/fa6");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const flowbite_react_1 = require("flowbite-react");
const flowbite_react_2 = require("flowbite-react");
const jsqr_1 = __importDefault(require("jsqr"));
const ordersApi_1 = require("@/redux/features/orders/ordersApi");
const navigation_1 = require("next/navigation");
const flowbite_react_3 = require("flowbite-react");
const apiSlice_1 = require("@/redux/features/api/apiSlice");
const constant_1 = require("./constant");
const sweetalert2_1 = __importDefault(require("sweetalert2"));
const sweetalert2_react_content_1 = __importDefault(require("sweetalert2-react-content"));
const MySwal = (0, sweetalert2_react_content_1.default)(sweetalert2_1.default);
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["slip"] = "slip";
    PaymentMethod["visa"] = "visa";
})(PaymentMethod || (PaymentMethod = {}));
const SlipPayment = ({ product, data }) => {
    console.log("🚀 ~ SlipPayment ~ data:", data);
    const { data: userData, refetch } = (0, apiSlice_1.useLoadUserQuery)(undefined, {});
    const [getToken, {}] = (0, ordersApi_1.useGetTokenPaymentMutation)();
    const router = (0, navigation_1.useRouter)();
    const [token, setToken] = (0, react_1.useState)();
    const [resultQr, setResultQr] = (0, react_1.useState)('');
    const [ons, setONS] = (0, react_1.useState)(false);
    const [user, setUser] = (0, react_1.useState)();
    const [refId, setRefId] = (0, react_1.useState)('');
    const [verifySlip, { data: orderData, error, isLoading, isError }] = (0, ordersApi_1.useVerifySlipMutation)();
    const [addressInfo, setAddressInfo] = (0, react_1.useState)({
        fullname: '',
        address: '',
        phone: ''
    });
    const [selectMethod, setSelectMethod] = (0, react_1.useState)('');
    const submitRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        setUser(userData?.user);
    }, [userData]);
    (0, react_1.useEffect)(() => {
        if (user && data._id) {
            getToken(data._id).then((response) => {
                setToken(response?.data?.token || '');
                setRefId(response?.data?.refId || '');
            });
        }
    }, [user, data]);
    const handleCopy = () => {
        navigator.clipboard.writeText(constant_1.BANK_NO_REPLACE);
        react_hot_toast_1.default.success('คัดลอกเลขบัญชีแล้ว');
    };
    const handleImageUpload = (event) => {
        setONS(true);
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = e.target.result;
                const image = new Image;
                image.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx?.drawImage(image, 0, 0, image.width, image.height);
                    const imageData = ctx?.getImageData(0, 0, image.width, image.height);
                    if (!imageData) {
                        return react_hot_toast_1.default.error('ไม่สามารถสแกน QR Code ได้');
                    }
                    const code = (0, jsqr_1.default)(imageData.data, image.width, image.height);
                    console.log("🚀 ~ handleImageUpload ~ code:", code);
                    if (code) {
                        setResultQr(code.data);
                        setONS(false);
                    }
                    else {
                        return react_hot_toast_1.default.error('ไม่สามารถสแกน QR Code ได้');
                    }
                };
                image.src = imageDataUrl;
            };
            reader.readAsDataURL(file);
        }
    };
    (0, react_1.useEffect)(() => {
        if (orderData) {
            if (orderData.success) {
                react_hot_toast_1.default.success('ยืนยันการโอนเงินสำเร็จ');
                const toastId = react_hot_toast_1.default.loading('รอสักครู่ระบบกำลังเข้าสู่บทเรียน');
                refetch().then(() => {
                    router.replace(`/course-access/${orderData.result.courseId}`);
                    react_hot_toast_1.default.dismiss(toastId);
                });
            }
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error;
                react_hot_toast_1.default.error(errorMessage.data.message);
            }
        }
    }, [orderData, error, isLoading, isError]);
    const validateInput = (isCheckQr = true) => {
        if (!addressInfo.fullname) {
            react_hot_toast_1.default.error('กรุณากรอกชื่อ-นามสกุล');
            return true;
        }
        if (!addressInfo.address) {
            react_hot_toast_1.default.error('กรุณากรอกที่อยู่');
            return true;
        }
        if (!addressInfo.phone) {
            react_hot_toast_1.default.error('กรุณากรอกเบอร์โทรศัพท์');
            return true;
        }
        if (addressInfo.phone && addressInfo.phone.length < 10) {
            react_hot_toast_1.default.error('กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก');
            return true;
        }
        if (isCheckQr && !resultQr) {
            react_hot_toast_1.default.error('กรุณาอัพโหลดสลิปโอนเงิน');
            return true;
        }
        return false;
    };
    const handleCheckSlip = async () => {
        if (validateInput()) {
            return;
        }
        MySwal.fire({
            title: "กำลังตรวจสอบสลิป!",
            html: "กรุณารอสักครู่...",
            timerProgressBar: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
                sweetalert2_1.default.showLoading();
            }
        });
        const payload = {
            productType: product,
            productId: data._id,
            qrData: resultQr,
            addressInfo,
        };
        await verifySlip(payload);
        sweetalert2_1.default.close();
    };
    const onPhoneNumberChange = (e) => {
        if (e.target.value.length > 10) {
            return;
        }
        setAddressInfo(prev => ({ ...prev, phone: e.target.value.replace(/[^0-9]/g, "") }));
    };
    const handleOrderPaysolution = (e) => {
        if (validateInput(false)) {
            return;
        }
        if (user) {
            if (!token) {
                return window.alert('token payment notfound!');
            }
            if (!refId) {
                return window.alert('refId payment notfound!');
            }
            submitRef.current?.click();
        }
    };
    const returnUrl = `${window.location.origin}/course-access/${data._id}?ptoken=${token}&addressInfo=${encodeURIComponent(JSON.stringify(addressInfo))}&`;
    const postBackUrl = `${process.env.NEXT_PUBLIC_SERVER_URI}/create-order-postback?payment_token=${token}&`;
    return (<div className='text-black font-Poppins'>
      <form className="hidden" method="post" action="https://payment.paysolutions.asia/epaylink/payment.aspx">
        <input type="hidden" name="customeremail" defaultValue={userData?.user?.email} value={userData?.user?.email}/>
        <input type="hidden" name="productdetail" defaultValue={data.name} value={data.name}/>
        <input type="hidden" name="refno" defaultValue={refId}/>
        <input type="hidden" name="merchantid" defaultValue={process.env.NEXT_PUBLIC_PAYMENT_MERCHANT_ID}/>
        <input type="hidden" name="cc" defaultValue={'00'}/>
        <input type="hidden" name="total" defaultValue={data.price} value={data.price}/>
        <input type="hidden" name="lang" defaultValue="TH"/>
        <input type="hidden" name="returnurl" defaultValue={returnUrl} value={returnUrl}/>
        <input type="hidden" name="postbackurl" defaultValue={postBackUrl} value={postBackUrl}/>
        <button className="hidden" ref={submitRef} type="submit">
        </button>
      </form>

      <div className='w-full'>
        <p className='text-center font-bold text-2xl mb-[30px]'>เลือกช่องทางชำระเงิน</p>
        <MethodSelect selectMethod={selectMethod} setSelectMethod={setSelectMethod}/>
      </div>
      {selectMethod !== '' && <hr className='my-5'/>}
      {selectMethod === PaymentMethod.slip && (<div>
            <div className='flex gap-8 md:flex-row flex-col'>
              <div className='w-[300px]'>
                <p className='text-left text-[18px] font-semibold pb-2'>1. กรอกข้อมูล</p>
                <div>
                  <div className="mb-2 block">
                    <flowbite_react_1.Label htmlFor="fullname" value="ชื่อ - นามสกุล"/>
                  </div>
                  <flowbite_react_1.TextInput id="fullname" type="text" value={addressInfo.fullname} onChange={({ target: { value } }) => { setAddressInfo(prev => ({ ...prev, fullname: value })); }} placeholder="ชาติชาญ นามสมมุติ" required shadow/>
                </div>
                <div className="mb-2 block">
                  <flowbite_react_1.Label htmlFor="address" value="ที่อยู่"/>
                </div>
                <flowbite_react_1.Textarea id="address" placeholder="8/64 ...." value={addressInfo.address} onChange={({ target: { value } }) => { setAddressInfo(prev => ({ ...prev, address: value })); }} required rows={4}/>
                <div>
                  <div className="mb-2 block">
                    <flowbite_react_1.Label htmlFor="phone" value="เบอร์โทรศัพท์"/>
                  </div>
                  <flowbite_react_1.TextInput id="phone" type="text" value={addressInfo.phone} onChange={onPhoneNumberChange} placeholder='089xxxxxxx' required shadow/>
                </div>
              </div>
              <div>
                <p className='text-left text-[18px] font-semibold'>2. ยืนยันการโอนเงิน</p>
                <div className='flex flex-col justify-center items-center gap-4 mt-5'>
                   <image_1.default alt='' src={getBankImagePath('kbank')} width={300} height={300}/>
                  <p className='text-xl text-gray-700'>เลขบัญชี</p>
                  <p onClick={handleCopy} className='text-2xl px-20 py-2 bg-slate-300 flex justify-center items-center relative cursor-pointer'>{constant_1.BANK_NO} <fa6_1.FaRegCopy className=' cursor-pointer absolute right-0 pr-3 text-3xl'/></p>
                  <div className='text-sm mt-[-13px]'>{constant_1.BANK_ACCOUNT_NAME}</div>
                  <div>ยอดรวมราคา <span className=' underline font-semibold'>{data?.price?.toLocaleString() ?? ''}</span> บาท</div>
                  <p>อัพโหลดสลิปโอนเงิน</p>
                  <p className='text-[red] text-[12px] mt-[-20px]'>*โปรดตรวจสอบสลิปก่อนทำรายการ</p>
                  <div>
                    <flowbite_react_1.FileInput name="file" className='w-100' accept="image/*" id="file-upload" onChange={handleImageUpload}/>
                  </div>
                  <div className='text-[12px] text-gray-500 mt-[-10px]'>ไฟล์ที่รองรับ .jpg .png ขนาดไม่เกิน 2MB</div>
                </div>
              </div>

            </div>
            <div className='flex justify-center'>
              <flowbite_react_2.Button onClick={handleCheckSlip} disabled={isLoading} className='bg-[#2688df] text-white rounded-md mt-2 flex justify-center items-center gap-2'>
                {isLoading && <flowbite_react_1.Spinner aria-label="Spinner button example" size="sm" className='mr-2'/>}
                <span>ยืนยันการโอนเงิน</span>
              </flowbite_react_2.Button>
            </div>
          </div>)}
      {selectMethod === PaymentMethod.visa && (<div>
            <div className='flex justify-center items-center'>
              <div className='w-[300px]'>
                <p className='text-left text-[18px] font-semibold pb-2'>1. กรอกข้อมูล</p>
                <div>
                  <div className="mb-2 block">
                    <flowbite_react_1.Label htmlFor="fullname" value="ชื่อ - นามสกุล"/>
                  </div>
                  <flowbite_react_1.TextInput id="fullname" type="text" value={addressInfo.fullname} onChange={({ target: { value } }) => { setAddressInfo(prev => ({ ...prev, fullname: value })); }} placeholder="ชาติชาญ นามสมมุติ" required shadow/>
                </div>
                <div className="mb-2 block">
                  <flowbite_react_1.Label htmlFor="address" value="ที่อยู่"/>
                </div>
                <flowbite_react_1.Textarea id="address" placeholder="8/64 ...." value={addressInfo.address} onChange={({ target: { value } }) => { setAddressInfo(prev => ({ ...prev, address: value })); }} required rows={4}/>
                <div>
                  <div className="mb-2 block">
                    <flowbite_react_1.Label htmlFor="phone" value="เบอร์โทรศัพท์"/>
                  </div>
                  <flowbite_react_1.TextInput id="phone" type="text" value={addressInfo.phone} onChange={onPhoneNumberChange} placeholder='089xxxxxxx' required shadow/>
                </div>
              </div>
            </div>
            <div className='flex justify-center'>
              <flowbite_react_2.Button onClick={handleOrderPaysolution} className='bg-[#2688df] text-white rounded-md mt-2 flex justify-center items-center gap-2'>
                {/* <IoOpenOutline size={20} /> */}
                <span>ดำเนินการผ่อนชำระ</span>
              </flowbite_react_2.Button>
            </div>
          </div>)}
    </div>);
};
const MethodSelect = ({ selectMethod, setSelectMethod }) => {
    return (<div className='flex gap-3 flex-col md:flex-row '>
      <button onClick={() => setSelectMethod(PaymentMethod.slip)} className='bg-white min-w-[300px] px-5 h-[100px] rounded-lg shadow-md flex justify-between items-center cursor-pointer'>
        <div>
          <image_1.default src={'/slip.png'} width={100} height={100} alt=''/>
        </div>
        <p className='min-w-[150px] font-semibold'>ยืนยันสลิปโอนเงิน</p>
        <div>
          <flowbite_react_3.Radio id="slip" name="slip" value="slip" checked={selectMethod === PaymentMethod.slip}/>
        </div>
      </button>
      <button onClick={() => setSelectMethod(PaymentMethod.visa)} className='bg-white min-w-[300px] px-5 h-[100px] rounded-lg shadow-md flex justify-between items-center cursor-pointer'>
        <div>
          <image_1.default src={'/mastercard.jpg'} width={60} height={100} alt=''/>
        </div>
        <p className='min-w-[150px] font-semibold'>ผ่อนชำระ</p>
        <div>
          <flowbite_react_3.Radio id="visa" name="visa" value="visa" checked={selectMethod === PaymentMethod.visa}/>
        </div>
      </button>
    </div>);
};
const getBankImagePath = (bankName) => {
    switch (bankName) {
        case 'scb':
            return '/scb.webp';
        case 'kbank':
            return '/kbank-logo.png';
        case 'ktb':
            return '/ktb.jpg';
        case 'bbl':
            return '/bbl.jpg';
        default:
            return '/kbank-logo.png';
    }
};
exports.default = SlipPayment;
