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
function OrdersAnalytics({ isDashboard }) {
    const { data, isLoading } = (0, analyticsApi_1.useGetOrdersAnalyticsQuery)({});
    const analyticsData = [];
    data &&
        data.orders.last12Months.forEach((item) => {
            analyticsData.push({ name: item.name, Count: item.count });
        });
    return (<>
      {isLoading ? (<Loader_1.default />) : (<div className={isDashboard ? "h-[30vh]" : "h-screen"}>
          <div className={isDashboard ? "mt-[0px] pl-[40px] mb-2" : "mt-[50px]"}>
            <h1 className={`${style_1.styles.title} ${isDashboard && "!text-[20px]"} px-5 !text-start`}>
              Orders Analytics
            </h1>
            {!isDashboard && (<p className={`${style_1.styles.label} px-5`}>
                Last 12 months analytics data{" "}
              </p>)}
          </div>
          <div className={`w-full ${!isDashboard ? "h-[90%]" : "h-full"} flex items-center justify-center`}>
            <recharts_1.ResponsiveContainer width={isDashboard ? "100%" : "90%"} height={isDashboard ? "100%" : "50%"}>
              <recharts_1.LineChart width={500} height={300} data={analyticsData} margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}>
                <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                <recharts_1.XAxis dataKey="name"/>
                <recharts_1.YAxis />
                <recharts_1.Tooltip />
                {!isDashboard && <recharts_1.Legend />}
                <recharts_1.Line type="monotone" dataKey="Count" stroke="#82ca9d"/>
              </recharts_1.LineChart>
            </recharts_1.ResponsiveContainer>
          </div>
        </div>)}
    </>);
}
exports.default = OrdersAnalytics;
