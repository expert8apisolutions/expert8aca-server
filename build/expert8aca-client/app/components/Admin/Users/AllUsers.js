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
const Loader_1 = __importDefault(require("../../Loader/Loader"));
const timeago_js_1 = require("timeago.js");
const userApi_1 = require("@/redux/features/user/userApi");
const style_1 = require("@/app/styles/style");
const react_hot_toast_1 = require("react-hot-toast");
const coursesApi_1 = require("@/redux/features/courses/coursesApi");
const LoadingBackDrop_1 = __importDefault(require("../../Loader/LoadingBackDrop"));
const ebookApi_1 = require("@/redux/features/ebooks/ebookApi");
const SearchInput_1 = __importDefault(require("../Widgets/SearchInput"));
const react_datepicker_1 = __importDefault(require("react-datepicker"));
require("react-datepicker/dist/react-datepicker.css");
const dayjs_1 = __importDefault(require("dayjs"));
const DEFAULT_EXPIRE_DATE_IN_DAY = process.env.NEXT_PUBLIC_DEFAULT_EXPIRE_DATE_IN_DAY || 90;
const AllCourses = ({ isTeam }) => {
    const { theme, setTheme } = (0, next_themes_1.useTheme)();
    const [active, setActive] = (0, react_1.useState)(false);
    const [email, setEmail] = (0, react_1.useState)("");
    const [role, setRole] = (0, react_1.useState)("admin");
    const [open, setOpen] = (0, react_1.useState)(false);
    const [openModalAddCourse, setOpenModalAddCourse] = (0, react_1.useState)(false);
    const [openModalAddEbook, setOpenModalAddEbook] = (0, react_1.useState)(false);
    const [openModalAddUser, setOpenModalAddUser] = (0, react_1.useState)(false);
    const [userId, setUserId] = (0, react_1.useState)("");
    const [textSearch, setTexSearch] = (0, react_1.useState)("");
    const [userInfo, setUserInfo] = (0, react_1.useState)({
        name: "",
    });
    const [updateUserRole, { error: updateError, isSuccess }] = (0, userApi_1.useUpdateUserRoleMutation)();
    const [userState, setUserState] = (0, react_1.useState)({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [startDate, setStartDate] = (0, react_1.useState)();
    const [addUser, { isLoading: isLoadingAddUser, error: AddUserError, isSuccess: AddUserSuccess }] = (0, userApi_1.useAddUserMutation)();
    const [addCourse, { isLoading: isLoadingAddCourse, error: AddCourseError, isSuccess: AddCourseSuccess }] = (0, userApi_1.useAddCourseToUserMutation)();
    const [updateCourse, { isLoading: isLoadingUpdateCourse, error: updateCourseError, isSuccess: updateCourseSuccess }] = (0, userApi_1.useUpdateCourseToUserMutation)();
    const [addEbook, { isLoading: isLoadingAddEbook, error: AddEbookError, isSuccess: AddEbookSuccess }] = (0, ebookApi_1.useAddEbookUserMutation)();
    const { isLoading, data, refetch } = (0, userApi_1.useGetAllUsersQuery)({}, { refetchOnMountOrArgChange: true });
    const { isLoading: isLoadingCourse, data: courseList, refetch: refetchCourse, } = (0, coursesApi_1.useGetAllCoursesQuery)({}, { refetchOnMountOrArgChange: true });
    const { isLoading: isLoadingEbook, data: ebookList, refetch: refetchEbook, } = (0, ebookApi_1.useGetAllEbookQuery)({}, { refetchOnMountOrArgChange: true });
    const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] = (0, userApi_1.useDeleteUserMutation)({});
    const [selectCourse, setSelectCourse] = (0, react_1.useState)("");
    const [selectEbook, setSelectEbook] = (0, react_1.useState)("");
    const [rowData, setRowData] = (0, react_1.useState)([]);
    const [originalRowData, setOriginalRowData] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (updateError) {
            if ("data" in updateError) {
                const errorMessage = updateError;
                react_hot_toast_1.toast.error(errorMessage.data.message);
            }
        }
        if (isSuccess) {
            refetch();
            react_hot_toast_1.toast.success("User role updated successfully");
            setActive(false);
        }
        if (AddCourseSuccess) {
            refetch();
            react_hot_toast_1.toast.success("Add Course successfully");
            setOpenModalAddCourse(false);
            setSelectCourse('');
        }
        if (AddEbookSuccess) {
            refetch();
            react_hot_toast_1.toast.success("Add Ebook successfully");
            setOpenModalAddEbook(false);
            setSelectEbook('');
        }
        if (deleteSuccess) {
            refetch();
            react_hot_toast_1.toast.success("Delete user successfully!");
            setOpen(false);
        }
        if (AddUserSuccess) {
            refetch();
            react_hot_toast_1.toast.success("Add User successfully");
            setOpenModalAddUser(false);
        }
        if (deleteError) {
            if ("data" in deleteError) {
                const errorMessage = deleteError;
                react_hot_toast_1.toast.error(errorMessage.data.message);
            }
        }
        if (AddCourseError) {
            if ("data" in AddCourseError) {
                const errorMessage = AddCourseError;
                react_hot_toast_1.toast.error(errorMessage.data.message);
            }
        }
        if (AddEbookError) {
            if ("data" in AddEbookError) {
                const errorMessage = AddEbookError;
                react_hot_toast_1.toast.error(errorMessage.data.message);
            }
        }
        if (AddUserError) {
            if ("data" in AddUserError) {
                const errorMessage = AddUserError;
                react_hot_toast_1.toast.error(errorMessage?.data?.message);
            }
        }
    }, [updateError, isSuccess, deleteSuccess, deleteError, AddCourseError, AddCourseSuccess, AddEbookError, AddEbookSuccess, AddUserError, AddUserSuccess]);
    (0, react_1.useEffect)(() => {
        if (updateCourseSuccess) {
            refetch();
            react_hot_toast_1.toast.success("Update user course successfully!");
            setOpen(false);
        }
        if (updateCourseError) {
            if ("data" in updateCourseError) {
                const errorMessage = updateCourseError;
                react_hot_toast_1.toast.error(errorMessage.data.message);
            }
        }
    }, [updateCourseError, updateCourseSuccess]);
    const columns = [
        { field: "id", headerName: "ID", flex: 0.3 },
        { field: "name", headerName: "Name", flex: 0.5 },
        { field: "email", headerName: "Email", flex: 0.5 },
        { field: "role", headerName: "Role", flex: 0.5 },
        { field: "courses", headerName: "Purchased Courses", flex: 0.5 },
        { field: "created_at", headerName: "Joined At", flex: 0.5 },
        {
            field: "     ",
            headerName: "Add Ebook",
            flex: 0.25,
            renderCell: (params) => {
                return (<>
            <material_1.Button onClick={() => {
                        setOpenModalAddEbook(true);
                        setUserId(params.row.id);
                        const userObj = data.users.find((ele) => ele._id === params.row.id);
                        setUserInfo(userObj);
                    }}>
              <ai_1.AiOutlineFileAdd className="dark:text-white text-black" size={20}/>
            </material_1.Button>
          </>);
            },
        },
        {
            field: "    ",
            headerName: "Add Course",
            flex: 0.25,
            renderCell: (params) => {
                return (<>
            <material_1.Button onClick={() => {
                        setOpenModalAddCourse((prev) => !prev);
                        setUserId(params.row.id);
                        const userObj = data.users.find((ele) => ele._id === params.row.id);
                        setUserInfo(userObj);
                    }}>
              <ai_1.AiOutlineVideoCameraAdd className="dark:text-white text-black" size={20}/>
            </material_1.Button>
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
                        setUserId(params.row.id);
                    }}>
              <ai_1.AiOutlineDelete className="dark:text-white text-black" size={20}/>
            </material_1.Button>
          </>);
            },
        },
        {
            field: "  ",
            headerName: "Email",
            flex: 0.2,
            renderCell: (params) => {
                return (<>
            <a href={`mailto:${params.row.email}`}>
              <ai_1.AiOutlineMail className="dark:text-white text-black" size={20}/>
            </a>
          </>);
            },
        },
    ];
    const handleSubmit = async () => {
        await updateUserRole({ email, role });
    };
    const handleDelete = async () => {
        const id = userId;
        await deleteUser(id);
    };
    const handleAddCourse = (isUpdate = false) => {
        const body = { user_id: userId, course_id: selectCourse, expireDate: startDate };
        if (isUpdate) {
            updateCourse(body);
        }
        else {
            addCourse(body);
        }
    };
    const handleAddEbook = () => {
        const body = { user_id: userId, ebook_id: selectEbook };
        addEbook(body);
    };
    const handleAddUser = () => {
        addUser(userState);
    };
    (0, react_1.useEffect)(() => {
        const rows = [];
        if (isTeam) {
            const newData = data && data.users.filter((item) => item.role === "admin");
            newData &&
                newData.forEach((item) => {
                    rows.push({
                        id: item._id,
                        name: item.name,
                        email: item.email,
                        role: item.role,
                        courses: item.courses.length,
                        created_at: (0, timeago_js_1.format)(item.createdAt),
                    });
                });
        }
        else {
            data &&
                data.users.forEach((item) => {
                    rows.push({
                        id: item._id,
                        name: item.name,
                        email: item.email,
                        role: item.role,
                        courses: item.courses.length,
                        created_at: (0, timeago_js_1.format)(item.createdAt),
                    });
                });
        }
        setRowData(rows);
        setOriginalRowData(rows);
    }, [data?.users]);
    (0, react_1.useEffect)(() => {
        handleSearchUser();
    }, [textSearch, originalRowData]);
    const handleSearchUser = () => {
        const newRowData = originalRowData?.filter((eachUser) => {
            const nameSearch = (eachUser.name.toLowerCase()).includes(textSearch.toLowerCase());
            const emailSearch = (eachUser.email.toLowerCase()).includes(textSearch.toLowerCase());
            if (nameSearch || emailSearch) {
                return eachUser;
            }
        });
        setRowData(newRowData);
    };
    return (<div className="mt-[120px]">
      {isLoading ? (<Loader_1.default />) : (<material_1.Box m="20px">
          {(isLoadingAddCourse || isLoadingUpdateCourse) && <LoadingBackDrop_1.default />}
          <div className="flex">
            <SearchInput_1.default value={textSearch} onChange={(e) => setTexSearch(e.target.value)}/>
            {isTeam ? (<div className="w-full flex justify-end">
                <div className={`${style_1.styles.button} !w-[200px] !rounded-[10px] dark:bg-[#57c7a3] !h-[35px] dark:border dark:border-[#ffffff6c]`} onClick={() => setActive(!active)}>
                  Add New Member
                </div>
              </div>)
                :
                    (<div className="w-full flex justify-end">
                  <div className={`${style_1.styles.button} !w-[200px] !rounded-[10px] dark:bg-[#57c7a3] !h-[35px] dark:border dark:border-[#ffffff6c]`} onClick={() => setOpenModalAddUser(prev => !prev)}>
                    + Add New User
                  </div>
                </div>)}
          </div>

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
            <x_data_grid_1.DataGrid checkboxSelection rows={rowData} columns={columns}/>
          </material_1.Box>
          {active && (<material_1.Modal open={active} onClose={() => setActive(!active)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
              <material_1.Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${style_1.styles.title}`}>Add New Member</h1>
                <div className="mt-4">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email..." className={`${style_1.styles.input}`}/>
                  <select name="" id="" className={`${style_1.styles.input} !mt-6`} onChange={(e) => setRole(e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <br />
                  <div className={`${style_1.styles.button} my-6 !h-[30px]`} onClick={handleSubmit}>
                    Submit
                  </div>
                </div>
              </material_1.Box>
            </material_1.Modal>)}

          {open && (<material_1.Modal open={open} onClose={() => setOpen(!open)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
              <material_1.Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${style_1.styles.title}`}>
                  Are you sure you want to delete this user?
                </h1>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <div className={`${style_1.styles.button} !w-[120px] h-[30px] bg-[#57c7a3]`} onClick={() => setOpen(!open)}>
                    Cancel
                  </div>
                  <div className={`${style_1.styles.button} !w-[120px] h-[30px] bg-[#d63f3f]`} onClick={handleDelete}>
                    Delete
                  </div>
                </div>
              </material_1.Box>
            </material_1.Modal>)}
          {openModalAddCourse && (<ModalAddCourse {...({
                openModalAddCourse,
                setOpenModalAddCourse,
                userInfo,
                courseList,
                setSelectCourse,
                selectCourse,
                handleAddCourse,
                startDate,
                setStartDate
            })}/>)}
          {openModalAddEbook && (<ModalAddEbook {...({
                openModalAddEbook,
                setOpenModalAddEbook,
                userInfo,
                ebookList,
                setSelectEbook,
                selectEbook,
                handleAddEbook
            })}/>)}
          {openModalAddUser && (<ModalAddUser {...({
                openModalAddUser,
                setOpenModalAddUser,
                userState,
                setUserState,
                handleSubmit: handleAddUser,
            })}/>)}
        </material_1.Box>)}
    </div>);
};
const ModalAddCourse = ({ startDate, setStartDate, handleAddCourse, selectCourse, openModalAddCourse, setOpenModalAddCourse, userInfo, courseList, setSelectCourse }) => {
    const [courseOption, setCourseOption] = (0, react_1.useState)([]);
    const [isCourseExit, setCourseExit] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setStartDate((0, dayjs_1.default)().add(+DEFAULT_EXPIRE_DATE_IN_DAY, 'day').toDate());
    }, []);
    (0, react_1.useEffect)(() => {
        if (courseList?.courses.length) {
            const newOption = courseList?.courses.map((ele) => {
                const foundCourse = userInfo.courses.find((course) => course.courseId == ele._id);
                return {
                    ...ele,
                    isExits: !!foundCourse,
                };
            });
            setCourseOption(newOption);
        }
    }, []);
    const date1 = (0, dayjs_1.default)((0, dayjs_1.default)(startDate).format('YYYY-MM-DD'));
    const dateDif = date1.diff((0, dayjs_1.default)().format('YYYY-MM-DD'), 'day');
    return (<material_1.Modal open={openModalAddCourse} onClose={() => setOpenModalAddCourse(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <material_1.Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
        <h1 className={`${style_1.styles.title}`}>
          Add Course To "{userInfo?.name}"
        </h1>
        <div className="w-[100%] mt-4">
          <select name="" id="" className={`${style_1.styles.input}`} value={selectCourse} onChange={(e) => {
            const optionData = courseOption.find((ele) => ele._id == e.target.value);
            const foundCourse = userInfo.courses.find((course) => course.courseId == e.target.value);
            if (optionData) {
                if (optionData?.isExits) {
                    setCourseExit(true);
                    setStartDate(new Date(foundCourse.expireDate));
                }
                else {
                    setCourseExit(false);
                    setStartDate((0, dayjs_1.default)().add(+DEFAULT_EXPIRE_DATE_IN_DAY, 'day').toDate());
                }
                setSelectCourse(optionData._id);
            }
        }}>
            <option value="">Select Course</option>
            {courseOption.map?.((item) => (<option value={item._id} key={item._id} disabled={item.isExits}>
                  {item.name} <span className="text-red">{item.isExits ? ' - x มีครอสนี้เเล้ว' : ''}</span>
                </option>))}
          </select>
          <div />
        </div>
        <div className="mt-4">
          <p className="text-black">Expire Date</p>
          <react_datepicker_1.default selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy"/>
          <span className="ml-4">Expire in {dateDif} day</span>
        </div>
        <div className="flex w-full items-center justify-center mb-6 mt-6">
          <button disabled={!!!selectCourse} className={`${style_1.styles.button}  w-full h-[30px] ${isCourseExit ? 'bg-[#47d097]' : 'bg-[#2190ff]'}  mt-4`} onClick={() => handleAddCourse(isCourseExit)}>
            {isCourseExit ? 'Update' : 'Add'}

          </button>
        </div>
      </material_1.Box>
    </material_1.Modal>);
};
const ModalAddEbook = ({ openModalAddEbook, setOpenModalAddEbook, userInfo, ebookList, setSelectEbook, selectEbook, handleAddEbook }) => {
    const [ebookOption, setEbookOption] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (ebookList?.ebooks.length) {
            const newOption = ebookList?.ebooks.map((ele) => {
                const isExits = userInfo.ebooks.some((item) => item._id === ele._id);
                return {
                    ...ele,
                    isExits,
                };
            });
            setEbookOption(newOption);
        }
    }, []);
    return (<material_1.Modal open={openModalAddEbook} onClose={() => setOpenModalAddEbook(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <material_1.Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
        <h1 className={`${style_1.styles.title}`}>
          Add Ebook To "{userInfo?.name}"
        </h1>
        <div className="w-[100%] mt-4">
          <select name="" id="" className={`${style_1.styles.input}`} value={selectEbook} onChange={(e) => setSelectEbook(e.target.value)}>
            <option value="">Select Course</option>
            {ebookOption.map?.((item) => (<option value={item._id} key={item._id} disabled={item.isExits}>
                  {item.name}
                </option>))}
          </select>
          <div />
        </div>
        <div className="flex w-full items-center justify-center mb-6 mt-6">
          <button disabled={!!!selectEbook} className={`${style_1.styles.button}  w-full h-[30px] bg-[#2190ff] mt-4`} onClick={handleAddEbook}>
            Add
          </button>
        </div>
      </material_1.Box>
    </material_1.Modal>);
};
const ModalAddUser = ({ openModalAddUser, setOpenModalAddUser, userState, setUserState, handleSubmit }) => {
    const validateError = () => {
        let error = '';
        if (!userState.name) {
            error = 'name user is required!';
        }
        else if (!userState.email) {
            error = 'email is required!';
        }
        else if (!userState.password) {
            error = 'password is required!';
        }
        else if (!userState.confirmPassword) {
            error = 'confirm password is required!';
        }
        else if (userState.password !== userState.confirmPassword) {
            error = 'password and confirm password is not match!';
        }
        return error;
    };
    const onSubmit = () => {
        let error = validateError();
        if (error) {
            return alert(error);
        }
        handleSubmit();
    };
    return (<material_1.Modal open={openModalAddUser} onClose={() => setOpenModalAddUser(prev => !prev)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <material_1.Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
        <h1 className={`${style_1.styles.title}`}>Add New User</h1>
        <div className="mt-4 text-black">
          Name:
          <input type="text" value={userState.name} onChange={(e) => setUserState(prev => ({ ...prev, name: e.target.value }))} placeholder="Enter name..." className={`${style_1.styles.input} mb-2`}/>
          Email:
          <input type="email" value={userState.email} onChange={(e) => setUserState(prev => ({ ...prev, email: e.target.value }))} placeholder="Enter email..." className={`${style_1.styles.input} mb-2`}/>
          Password:
          <input type="text" value={userState.password} onChange={(e) => setUserState(prev => ({ ...prev, password: e.target.value }))} placeholder="Enter Password" className={`${style_1.styles.input} mb-2`}/>
          Confirm Password:
          <input type="text" value={userState.confirmPassword} onChange={(e) => setUserState(prev => ({ ...prev, confirmPassword: e.target.value }))} placeholder="Confirm Password" className={`${style_1.styles.input} mb-2`}/>
          <br />
          <div className={`${style_1.styles.button} my-6 !h-[30px]`} onClick={onSubmit}>
            Submit
          </div>
        </div>
      </material_1.Box>
    </material_1.Modal>);
};
exports.default = AllCourses;
