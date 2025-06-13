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
const next_themes_1 = require("next-themes");
const coursesApi_1 = require("@/redux/features/courses/coursesApi");
const Loader_1 = __importDefault(require("../../Loader/Loader"));
const timeago_js_1 = require("timeago.js");
const ordersApi_1 = require("@/redux/features/orders/ordersApi");
const userApi_1 = require("@/redux/features/user/userApi");
const ai_1 = require("react-icons/ai");
const AllInvoices = ({ isDashboard }) => {
    const { theme, setTheme } = (0, next_themes_1.useTheme)();
    const { isLoading, data } = (0, ordersApi_1.useGetAllOrdersQuery)({});
    const { data: usersData } = (0, userApi_1.useGetAllUsersQuery)({});
    const { data: coursesData } = (0, coursesApi_1.useGetAllCoursesQuery)({});
    const [orderData, setOrderData] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (data) {
            const temp = data.orders.map((item) => {
                const user = usersData?.users.find((user) => user._id === item.userId);
                const course = coursesData?.courses.find((course) => course._id === item.courseId);
                return {
                    ...item,
                    userName: user?.name,
                    userEmail: user?.email,
                    title: course?.name,
                    price: "$" + course?.price,
                };
            });
            setOrderData(temp);
        }
    }, [data, usersData, coursesData]);
    const columns = [
        { field: "id", headerName: "ID", flex: 0.3 },
        { field: "userName", headerName: "Name", flex: isDashboard ? 0.6 : 0.5 },
        ...(isDashboard
            ? []
            : [
                { field: "userEmail", headerName: "Email", flex: 1 },
                { field: "title", headerName: "Course Title", flex: 1 },
            ]),
        { field: "price", headerName: "Price", flex: 0.5 },
        ...(isDashboard
            ? [{ field: "created_at", headerName: "Created At", flex: 0.5 }]
            : [
                {
                    field: " ",
                    headerName: "Email",
                    flex: 0.2,
                    renderCell: (params) => {
                        return (<a href={`mailto:${params.row.userEmail}`}>
                  <ai_1.AiOutlineMail className="dark:text-white text-black" size={20}/>
                </a>);
                    },
                },
            ]),
    ];
    const rows = [];
    orderData &&
        orderData.forEach((item) => {
            rows.push({
                id: item._id,
                userName: item.userName,
                userEmail: item.userEmail,
                title: item.title,
                price: item.price,
                created_at: (0, timeago_js_1.format)(item.createdAt),
            });
        });
    return (<div className={!isDashboard ? "mt-[120px]" : "mt-[0px]"}>
      {isLoading ? (<Loader_1.default />) : (<material_1.Box m={isDashboard ? "0" : "40px"}>
          <material_1.Box m={isDashboard ? "0" : "40px 0 0 0"} height={isDashboard ? "35vh" : "90vh"} overflow={"hidden"} sx={{
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
            <x_data_grid_1.DataGrid checkboxSelection={isDashboard ? false : true} rows={rows} columns={columns} components={isDashboard ? {} : { Toolbar: x_data_grid_1.GridToolbar }}/>
          </material_1.Box>
        </material_1.Box>)}
    </div>);
};
exports.default = AllInvoices;
