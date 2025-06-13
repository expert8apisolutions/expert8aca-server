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
const style_1 = require("@/app/styles/style");
const react_1 = __importStar(require("react"));
const Editor_1 = __importDefault(require("../../Editor"));
const blogsApi_1 = require("@/redux/features/blog/blogsApi");
const Image_1 = __importDefault(require("@mui/icons-material/Image"));
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const SimpleBackdrop_1 = __importDefault(require("../../Loading/SimpleBackdrop"));
const BlogInformation = ({ blogData, refetch, }) => {
    const [dragging, setDragging] = (0, react_1.useState)(false);
    const [blogInfo, setBlogInfo] = (0, react_1.useState)({});
    const [createBlog, { isLoading, isSuccess, error }] = (0, blogsApi_1.useCreateBlogMutation)();
    const [editBlog, { isLoading: isLoadingEdit, isSuccess: successEdit, error: errorEdit }] = (0, blogsApi_1.useEditBlogMutation)({});
    const [fileImg, setFileImg] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (isSuccess) {
            react_hot_toast_1.default.success('create blog success');
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error;
                react_hot_toast_1.default.error(errorMessage.data.message);
            }
        }
    }, [isSuccess]);
    (0, react_1.useEffect)(() => {
        if (successEdit) {
            react_hot_toast_1.default.success('update blog success');
        }
        if (error) {
            if ("data" in errorEdit) {
                const errorMessage = error;
                react_hot_toast_1.default.error(errorMessage.data.message);
            }
        }
    }, [successEdit]);
    (0, react_1.useEffect)(() => {
        if (blogData) {
            const { result } = blogData;
            const newState = {
                content: result.content,
                description: result.description,
                keyword: result.keyword,
                slug: result.slug,
                thumbnail: result.thumbnail,
                title: result.title
            };
            setBlogInfo(newState);
        }
    }, [blogData]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (blogData) {
            await editBlog({ id: blogData.result._id, data: { ...blogInfo, fileImg } });
            //  await refetch()
        }
        else {
            createBlog({ ...blogInfo, fileImg });
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (reader.readyState === 2) {
                    // setBlogInfo({ ...blogInfo, fileImg: reader.result });
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
                // setBlogInfo({ ...blogInfo, fileImg: reader.result });
                setFileImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return (<div className="w-[80%] m-auto mt-24">
      <form onSubmit={handleSubmit} className={`${style_1.styles.label}`}>
        <div>
          <label htmlFor="">Title</label>
          <input type="title" name="" required value={blogInfo.title} onChange={(e) => setBlogInfo({ ...blogInfo, title: e.target.value })} onBlur={(e) => {
            setBlogInfo({ ...blogInfo, slug: blogInfo.title?.replace(/ /gi, '-') });
        }} id="title" placeholder="MERN stack LMS platform with next 13" className={`
            ${style_1.styles.input}`}/>
        </div>
        <br />
        <div>
          <label htmlFor="">Slug</label>
          <input type="slug" name="" required value={blogInfo.slug} onChange={(e) => setBlogInfo({ ...blogInfo, slug: e.target.value?.replace(' ', '-') })} id="slug" placeholder="lms-platform-with-next-13" className={`
            ${style_1.styles.input}`}/>
        </div>
        <br />
        <div>
          <label htmlFor="">Keyword</label>
          <input type="keyword" name="" required value={blogInfo.keyword} onChange={(e) => setBlogInfo({ ...blogInfo, keyword: e.target.value })} id="keyword" placeholder="MERN, stack LMS, platform , next 13" className={`
            ${style_1.styles.input}`}/>
        </div>
        <br />
        <div className="mb-5">
          <label className={`${style_1.styles.label}`}>Description</label>
          <textarea name="" id="" cols={30} rows={2} placeholder="Write something amazing..." className={`${style_1.styles.input} !h-min !py-2`} value={blogInfo.description} onChange={(e) => setBlogInfo({ ...blogInfo, description: e.target.value })}></textarea>
        </div>
        <div className="w-full">
          <input type="file" accept="image/*" id="file" className="hidden" onChange={handleFileChange}/>
          <label htmlFor="file" className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${dragging ? "bg-blue-500" : "bg-transparent"}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            {/* {blogInfo.fileImg ? (
          <img
            src={blogInfo.fileImg}
            alt=""
            className="max-h-full w-full object-cover"
          />
        ) : (
          <span className="text-black dark:text-white">
            Drag and drop your OG image here or click to browse
          </span>
        )} */}
            {blogInfo?.thumbnail?.url || fileImg ? (<img src={fileImg || blogInfo?.thumbnail?.url} alt="" className="max-h-full w-full object-cover"/>) : (<span className="text-black dark:text-white">
                <Image_1.default /> Drag and drop your thumbnail here or
                click to browse
              </span>)}
          </label>
        </div>
        <br />
        <div className="mb-5">
          <label className={`${style_1.styles.label} mb-2`}>Content </label>
          <Editor_1.default setPropsContent={(data) => setBlogInfo(prev => ({ ...prev, content: data }))} defaultContent={blogData?.result?.content}/>
        </div>
        <br />
        <div className="w-full flex items-center justify-end">
          <input type="submit" value="Save" className="w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"/>
        </div>
        <br />
        <br />
      </form>
      <SimpleBackdrop_1.default open={isLoading || isLoadingEdit} setOpen={() => { }}/>
    </div>);
};
exports.default = BlogInformation;
