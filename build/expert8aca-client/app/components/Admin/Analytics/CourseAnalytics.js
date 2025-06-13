"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const recharts_1 = require("recharts");
const Loader_1 = __importDefault(require("../../Loader/Loader"));
const analyticsApi_1 = require("@/redux/features/analytics/analyticsApi");
const style_1 = require("@/app/styles/style");
const CourseAnalytics = (props) => {
    const { data, isLoading } = (0, analyticsApi_1.useGetCoursesAnalyticsQuery)({});
    // const analyticsData = [
    //     { name: 'Jun 2023', uv: 3 },
    //     { name: 'July 2023', uv: 2 },
    //     { name: 'August 2023', uv: 5 },
    //     { name: 'Sept 2023', uv: 7 },
    //     { name: 'October 2023', uv: 2 },
    //     { name: 'Nov 2023', uv: 5 },
    //     { name: 'December 2023', uv: 7 },
    //   ];
    const analyticsData = [];
    data &&
        data.courses.last12Months.forEach((item) => {
            analyticsData.push({ name: item.month, uv: item.count });
        });
    const minValue = 0;
    return (<>
      {isLoading ? (<Loader_1.default />) : (<div className="h-screen">
          <div className="mt-[50px]">
            <h1 className={`${style_1.styles.title} px-5 !text-start`}>
              Courses Analytics
            </h1>
            <p className={`${style_1.styles.label} px-5`}>
              Last 12 months analytics data{" "}
            </p>
          </div>

          <div className="w-full h-[90%] flex items-center justify-center">
            <recharts_1.ResponsiveContainer width="90%" height="50%">
              <recharts_1.BarChart width={150} height={300} data={analyticsData}>
                <recharts_1.XAxis dataKey="name">
                  <recharts_1.Label offset={0} position="insideBottom"/>
                </recharts_1.XAxis>
                <recharts_1.YAxis domain={[minValue, "auto"]}/>
                <recharts_1.Bar dataKey="uv" fill="#3faf82">
                  <recharts_1.LabelList dataKey="uv" position="top"/>
                </recharts_1.Bar>
              </recharts_1.BarChart>
            </recharts_1.ResponsiveContainer>
          </div>
        </div>)}
    </>);
};
exports.default = CourseAnalytics;
