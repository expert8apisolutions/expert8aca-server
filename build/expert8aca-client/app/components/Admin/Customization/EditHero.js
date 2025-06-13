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
Object.defineProperty(exports, "__esModule", { value: true });
const style_1 = require("@/app/styles/style");
const layoutApi_1 = require("@/redux/features/layout/layoutApi");
const react_1 = __importStar(require("react"));
const react_hot_toast_1 = require("react-hot-toast");
const ai_1 = require("react-icons/ai");
const ri_1 = require("react-icons/ri");
const EditHero = (props) => {
    const [image, setImage] = (0, react_1.useState)("");
    const [title, setTitle] = (0, react_1.useState)("");
    const [subTitle, setSubTitle] = (0, react_1.useState)("");
    const { data, refetch } = (0, layoutApi_1.useGetHeroDataQuery)("Banner", {
        refetchOnMountOrArgChange: true
    });
    const inputFileElement = (0, react_1.useRef)(null);
    const [editLayout, { isLoading, isSuccess, error }] = (0, layoutApi_1.useEditLayoutMutation)();
    const [imageList, setImageList] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (data) {
            setTitle(data?.layout?.banner.title);
            setSubTitle(data?.layout?.banner.subTitle);
            setImage(data?.layout?.banner?.image?.url);
            if (data?.layout?.banner?.image?.length) {
                setImageList(data?.layout?.banner?.image || []);
            }
        }
    }, [data]);
    (0, react_1.useEffect)(() => {
        if (isSuccess) {
            react_hot_toast_1.toast.success("Hero updated successfully!");
            refetch();
        }
        if (error) {
            if ("data" in error) {
                const errorData = error;
                react_hot_toast_1.toast.error(errorData?.data?.message);
            }
        }
    }, [isSuccess, error]);
    const handleUpdate = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (reader.readyState === 2) {
                    setImage(e.target.result);
                    const newImageUrls = [];
                    newImageUrls.push(URL.createObjectURL(e.target.result));
                    setImageList(newImageUrls);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    const handleEdit = async () => {
        await editLayout({
            type: "Banner",
            image,
            title,
            subTitle,
            imageList,
        });
    };
    const addImages = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const newImageUrls = [...imageList];
            const reader = new FileReader();
            reader.onload = (e) => {
                if (reader.readyState === 2) {
                    newImageUrls.push({ img_url: URL.createObjectURL(file), file: e.target.result });
                    setImageList(newImageUrls);
                }
                ;
            };
            reader.readAsDataURL(file);
        }
    };
    const handleDelImage = (idx) => {
        let newImageList = [];
        for (let index in imageList) {
            let ele = imageList[index];
            if (idx != index) {
                newImageList.push(ele);
            }
        }
        setImageList(newImageList);
    };
    return (<>
      <div className="w-full flex items-center">
        <div className="1000px:w-[80%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px]">
          <div className="flex gap-2 flex-wrap p-10">
            {imageList.map((ele, idx) => {
            return <div className="flex flex-col">
                  <img src={ele.img_url || ele.url} alt="not fount" width={"250px"}/>
                  <div onClick={() => handleDelImage(idx)} className="w-full text-center text-black bg-gray-200 cursor-pointer flex items-center justify-center py-2 hover:bg-gray-500 hover:text-white"><ri_1.RiDeleteBin5Line />Delete</div>
                </div>;
        })}
          </div>
          <input type="file" name="" id="banner" accept="image/*" ref={inputFileElement} onChange={addImages} className="hidden"/>
          <button onClick={() => inputFileElement.current?.click?.()} className="w-[200px] h-[100px] flex justify-center items-center">
            <ai_1.AiOutlineCamera className="dark:text-white text-black text-[40px] cursor-pointer "/>
            <span className="text-black"> Add Slide Images</span>
          </button>
          <textarea className="dark:text-white resize-none text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[60px] 1500px:text-[70px] font-[600] font-Josefin py-2 1000px:leading-[75px] 1500px:w-[60%] 1100px:w-[78%] outline-none bg-transparent block" placeholder="Improve Your Online Learning Experience Better Instantly" value={title} onChange={(e) => setTitle(e.target.value)} rows={4}/>
          <br />
          <textarea value={subTitle} onChange={(e) => setSubTitle(e.target.value)} placeholder="We have 40k+ Online courses & 500K+ Online registered student. Find your desired Courses from them." className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[74%] bg-transparent outline-none resize-none"></textarea>
          <br />
          <br />
          <br />
          <div className={`${style_1.styles.button} !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] 
              cursor-pointer !bg-[#42d383]
          !rounded  justify-center text-center mb-[50px]`} onClick={handleEdit}>
            Save
          </div>
        </div>
      </div>
    </>);
};
exports.default = EditHero;
