"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const style_1 = require("@/app/styles/style");
const analyticsApi_1 = require("@/redux/features/analytics/analyticsApi");
const react_1 = __importDefault(require("react"));
const recharts_1 = require("recharts");
const Loader_1 = __importDefault(require("../../Loader/Loader"));
// const analyticsData = [
//     { name: "January 2023", count: 440 },
//     { name: "February 2023", count: 8200 },
//     { name: "March 2023", count: 4033 },
//     { name: "April 2023", count: 4502 },
//     { name: "May 2023", count: 2042 },
//     { name: "Jun 2023", count: 3454 },
//     { name: "July 2023", count: 356 },
//     { name: "Aug 2023", count: 5667 },
//     { name: "Sept 2023", count: 1320 },
//     { name: "Oct 2023", count: 6526 },
//     { name: "Nov 2023", count: 5480 },
//     { name: "December 2023", count: 485 },
//   ];
const UserAnalytics = ({ isDashboard }) => {
    const { data, isLoading } = (0, analyticsApi_1.useGetUsersAnalyticsQuery)({});
    const analyticsData = [];
    data &&
        data.users.last12Months.forEach((item) => {
            analyticsData.push({ name: item.month, count: item.count });
        });
    return (<>
      {isLoading ? (<Loader_1.default />) : (<div className={`${!isDashboard ? "mt-[50px]" : "mt-[50px] dark:bg-[#111C43] shadow-sm pb-5 rounded-sm"}`}>
            <div className={`${isDashboard ? "!ml-8 mb-5" : ''}`}>
            <h1 className={`${style_1.styles.title} ${isDashboard && '!text-[20px]'} px-5 !text-start`}>
               Users Analytics
             </h1>
             {!isDashboard && (<p className={`${style_1.styles.label} px-5`}>
                 Last 12 months analytics data{" "}
               </p>)}
            </div>

         <div className={`w-full ${isDashboard ? 'h-[30vh]' : 'h-screen'} flex items-center justify-center`}>
           <recharts_1.ResponsiveContainer width={isDashboard ? '100%' : '90%'} height={!isDashboard ? "50%" : '100%'}>
             <recharts_1.AreaChart data={analyticsData} margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0,
            }}>
               <recharts_1.XAxis dataKey="name"/>
               <recharts_1.YAxis />
               <recharts_1.Tooltip />
               <recharts_1.Area type="monotone" dataKey="count" stroke="#4d62d9" fill="#4d62d9"/>
             </recharts_1.AreaChart>
           </recharts_1.ResponsiveContainer>
         </div>
       </div>)}
    </>);
};
exports.default = UserAnalytics;
