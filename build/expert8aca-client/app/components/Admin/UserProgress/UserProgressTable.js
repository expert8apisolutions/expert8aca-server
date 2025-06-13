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
const x_data_grid_1 = require("@mui/x-data-grid");
const axios_1 = __importDefault(require("axios"));
const coursesApi_1 = require("@/redux/features/courses/coursesApi");
const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 150 },
    {
        field: 'progress',
        headerName: 'Progress',
        width: 140,
        sortable: false
    },
    {
        field: 'watch_time',
        headerName: 'Watched Time',
        width: 140,
        sortable: false
    },
];
const UserProgressTable = () => {
    const { isLoading, data: allCourse, refetch } = (0, coursesApi_1.useGetAllCoursesQuery)({}, { refetchOnMountOrArgChange: true });
    const [userProgressList, setUserProgressList] = react_1.default.useState([]);
    const [selectedCourseId, setSelectedCourseId] = react_1.default.useState('');
    const [courseOptions, setCourseOptions] = react_1.default.useState([]);
    const [dataTable, setDataTable] = react_1.default.useState([]);
    const [loadingTable, setLoadingTable] = react_1.default.useState(false);
    (0, react_1.useEffect)(() => {
        if (allCourse?.courses?.length > 0) {
            setSelectedCourseId(allCourse.courses[0]._id);
            const options = allCourse.courses.map((course) => {
                return {
                    value: course._id,
                    label: course.name,
                    total_video: course?.courseData?.length
                };
            });
            setCourseOptions(options);
            fetchUserProgress(allCourse.courses[0]._id);
        }
    }, [allCourse]);
    const getCurrentCourse = (courseId) => {
        return courseOptions.find((course) => course.value === courseId);
    };
    console.log("🚀 ~ UserProgressTable ~ allCourse:", allCourse);
    (0, react_1.useEffect)(() => {
        console.log('UserProgressTable');
    }, []);
    const convertSecToMinOrHour = (sec) => {
        const hours = Math.floor(sec / 3600);
        const minutes = Math.floor((sec - (hours * 3600)) / 60);
        const seconds = sec - (hours * 3600) - (minutes * 60);
        let time = '';
        if (hours > 0) {
            time += hours + ' ชั่วโมง ';
        }
        if (minutes > 0) {
            time += minutes + ' นาที ';
        }
        // if (seconds > 0) {
        //     time += seconds + ' วินาที ';
        // }
        return time;
    };
    const fetchUserProgress = async (courseId) => {
        setLoadingTable(true);
        try {
            const result = await axios_1.default.get(`/api/v1/user-progress-report/${courseId}`, {
                withCredentials: true
            });
            if (result.data.results.length) {
                const currentCourse = getCurrentCourse(courseId);
                const data = result.data.results.map((item, idx) => {
                    const progress = ((item.video_compleated_id.length || 0) / (currentCourse?.total_video || 1) * 100);
                    return {
                        id: +idx,
                        name: item.user_id?.name,
                        email: item.user_id?.email,
                        progress: progress?.toFixed(2) + '%',
                        watch_time: convertSecToMinOrHour(item.total_watch_time)
                    };
                });
                setDataTable(data);
            }
            else {
                setDataTable([]);
            }
        }
        catch (err) {
            console.log(err);
        }
        setLoadingTable(false);
    };
    const handleChangeCourse = (e) => {
        const value = e.target.value;
        setSelectedCourseId(value);
        fetchUserProgress(value);
    };
    return (<div>
            <div>
                <select value={selectedCourseId} onChange={handleChangeCourse}>
                    {courseOptions.map((option) => (<option key={option.value} value={option.value}>
                            {option.label}
                        </option>))}
                </select>
            </div>
            <div className="overflow-x-auto mt-5 pr-10">
                <div style={{ height: 400, width: '100%' }}>
                    <x_data_grid_1.DataGrid loading={loadingTable} rows={dataTable} columns={columns} initialState={{
            pagination: {
                paginationModel: { page: 0, pageSize: 5 },
            },
        }} pageSizeOptions={[5, 10]} checkboxSelection={false} disableRowSelectionOnClick/>
                </div>
            </div>
        </div>);
};
exports.default = UserProgressTable;
