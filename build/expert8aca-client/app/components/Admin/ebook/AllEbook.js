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
const x_data_grid_1 = require("@mui/x-data-grid");
const material_1 = require("@mui/material");
const ai_1 = require("react-icons/ai");
const next_themes_1 = require("next-themes");
const fi_1 = require("react-icons/fi");
const Loader_1 = __importDefault(require("../../Loader/Loader"));
const timeago_js_1 = require("timeago.js");
const style_1 = require("@/app/styles/style");
const react_hot_toast_1 = require("react-hot-toast");
const link_1 = __importDefault(require("next/link"));
const ebookApi_1 = require("@/redux/features/ebooks/ebookApi");
const Dialog_1 = __importDefault(require("@mui/material/Dialog"));
const DialogContent_1 = __importDefault(require("@mui/material/DialogContent"));
const Slide_1 = __importDefault(require("@mui/material/Slide"));
const SimpleBackdrop_1 = __importDefault(require("../../Loading/SimpleBackdrop"));
const Transition = react_1.default.forwardRef(function Transition(props, ref) {
    return <Slide_1.default direction="up" ref={ref} {...props}/>;
});
const AllEbook = (props) => {
    const { theme, setTheme } = (0, next_themes_1.useTheme)();
    const [open, setOpen] = (0, react_1.useState)(false);
    const [openModalAdd, setOpenModalAdd] = (0, react_1.useState)(false);
    const [ebookId, setEbookId] = (0, react_1.useState)("");
    const { isLoading, data, refetch } = (0, ebookApi_1.useGetAllEbookQuery)({}, { refetchOnMountOrArgChange: true });
    const [deleteEbook, { isSuccess, error, isLoading: isLoadingDel }] = (0, ebookApi_1.useDeleteEbookMutation)({});
    const [courseInfo, setCourseInfo] = (0, react_1.useState)({});
    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "ebook name", flex: 1 },
        { field: "purchased", headerName: "Purchased", flex: 0.5 },
        { field: "created_at", headerName: "Created At", flex: 0.5 },
        {
            field: "  ",
            headerName: "Edit",
            flex: 0.2,
            renderCell: (params) => {
                return (<>
                        <link_1.default href={`/admin/edit-ebook/${params.row.id}`}>
                            <fi_1.FiEdit2 className="dark:text-white text-black" size={20}/>
                        </link_1.default>
                    </>);
            },
        },
        {
            field: " ",
            headerName: "Delete",
            flex: 0.2,
            renderCell: (params) => {
                return (<>
                        <material_1.Button onClick={() => {
                        setOpen(!open);
                        setEbookId(params.row.id);
                    }}>
                            <ai_1.AiOutlineDelete className="dark:text-white text-black" size={20}/>
                        </material_1.Button>
                    </>);
            },
        },
    ];
    const rows = [];
    {
        data &&
            data.ebooks.forEach((item) => {
                rows.push({
                    id: item._id,
                    name: item.name,
                    purchased: item.purchased,
                    created_at: (0, timeago_js_1.format)(item.createdAt),
                });
            });
    }
    (0, react_1.useEffect)(() => {
        if (isSuccess) {
            setOpen(false);
            refetch();
            react_hot_toast_1.toast.success("Course Deleted Successfully");
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error;
                react_hot_toast_1.toast.error(errorMessage.data.message);
            }
        }
    }, [isSuccess, error, refetch]);
    const handleDelete = async () => {
        const id = ebookId;
        await deleteEbook(id);
    };
    const handleCloseModalAdd = () => {
        setOpenModalAdd(false);
    };
    const handleSubmit = () => {
    };
    return (<div className="mt-[120px]">
            {isLoading ? (<Loader_1.default />) : (<material_1.Box m="20px">
                    <material_1.Box m="40px 0 0 0" height="80vh" sx={{
                "& .MuiDataGrid-root": {
                    border: "none",
                    outline: "none",
                },
                "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                    color: theme === "dark" ? "#fff" : "#000",
                },
                "& .MuiDataGrid-sortIcon": {
                    color: theme === "dark" ? "#fff" : "#000",
                },
                "& .MuiDataGrid-row": {
                    color: theme === "dark" ? "#fff" : "#000",
                    borderBottom: theme === "dark"
                        ? "1px solid #ffffff30!important"
                        : "1px solid #ccc!important",
                },
                "& .MuiTablePagination-root": {
                    color: theme === "dark" ? "#fff" : "#000",
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none!important",
                },
                "& .name-column--cell": {
                    color: theme === "dark" ? "#fff" : "#000",
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                    borderBottom: "none",
                    color: theme === "dark" ? "#fff" : "#000",
                },
                "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
                },
                "& .MuiDataGrid-footerContainer": {
                    color: theme === "dark" ? "#fff" : "#000",
                    borderTop: "none",
                    backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                },
                "& .MuiCheckbox-root": {
                    color: theme === "dark" ? `#b7ebde !important` : `#000 !important`,
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `#fff !important`,
                },
            }}>
                        <x_data_grid_1.DataGrid checkboxSelection rows={rows} columns={columns}/>
                    </material_1.Box>
                    {open && (<material_1.Modal open={open} onClose={() => setOpen(!open)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                            <material_1.Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                                <h1 className={`${style_1.styles.title}`}>
                                    Are you sure you want to delete this course?
                                </h1>
                                <div className="flex w-full items-center justify-between mb-6 mt-4">
                                    <div className={`${style_1.styles.button} !w-[120px] h-[30px] bg-[#47d097]`} onClick={() => setOpen(!open)}>
                                        Cancel
                                    </div>
                                    <div className={`${style_1.styles.button} !w-[120px] h-[30px] bg-[#d63f3f]`} onClick={handleDelete}>
                                        Delete
                                    </div>
                                </div>
                            </material_1.Box>
                        </material_1.Modal>)}

                    {openModalAdd && <Dialog_1.default className="z-999" open={openModalAdd} TransitionComponent={Transition} keepMounted onClose={handleCloseModalAdd} aria-describedby="alert-dialog-slide-description">
                            {/* <DialogTitle>Add Ebook</DialogTitle> */}
                            <DialogContent_1.default className=" bg-white dark:bg-slate-900  shadow p-4 ">
                                <form onSubmit={handleSubmit} className={`${style_1.styles.label}`}>
                                    <div>
                                        <label htmlFor="">Ebook Name</label>
                                        <input type="name" name="" required value={courseInfo.name} onChange={(e) => setCourseInfo({ ...courseInfo, name: e.target.value })} id="name" placeholder="MERN stack LMS platform with next 13" className={`
            ${style_1.styles.input}`}/>
                                    </div>
                                    <br />
                                    <div className="mb-5">
                                        <label className={`${style_1.styles.label}`}>Ebook Description</label>
                                        <textarea name="" id="" cols={30} rows={8} placeholder="Write something amazing..." className={`${style_1.styles.input} !h-min !py-2`} value={courseInfo.description} onChange={(e) => setCourseInfo({ ...courseInfo, description: e.target.value })}></textarea>
                                    </div>
                                    <br />
                                    <div className="w-full flex justify-between">
                                        <div className="w-[45%]">
                                            <label className={`${style_1.styles.label}`}>Ebook Price</label>
                                            <input type="number" name="" required value={courseInfo.price} onChange={(e) => setCourseInfo({ ...courseInfo, price: e.target.value })} id="price" placeholder="29" className={`
            ${style_1.styles.input}`}/>
                                        </div>
                                        <div className="w-[50%]">
                                            <label className={`${style_1.styles.label} w-[50%]`}>
                                                Estimated Price (optional)
                                            </label>
                                            <input type="number" name="" value={courseInfo.estimatedPrice} onChange={(e) => setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })} id="price" placeholder="79" className={`
            ${style_1.styles.input}`}/>
                                        </div>
                                    </div>
                                    <br />
                                    <br />
                                    {/* <div className="w-full">
                    <input
                        type="file"
                        accept="image/*"
                        id="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="file"
                        className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${dragging ? "bg-blue-500" : "bg-transparent"
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {courseInfo.thumbnail ? (
                            <img
                                src={courseInfo.thumbnail}
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
                            </DialogContent_1.default>
                            {/* <DialogActions>
                    <Button onClick={handleCloseModalAdd}>Close</Button>
                    <Button variant="contained" onClick={handleCloseModalAdd}>Save</Button>
                </DialogActions> */}
                        </Dialog_1.default>}
                </material_1.Box>)}
            <SimpleBackdrop_1.default open={isLoadingDel}/>
        </div>);
};
exports.default = AllEbook;
