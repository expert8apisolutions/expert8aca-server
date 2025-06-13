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
const ThemeSwitcher_1 = require("@/app/utils/ThemeSwitcher");
const notificationsApi_1 = require("@/redux/features/notifications/notificationsApi");
const react_1 = __importStar(require("react"));
const io_1 = require("react-icons/io");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const timeago_js_1 = require("timeago.js");
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = (0, socket_io_client_1.default)(ENDPOINT, { transports: ["websocket"] });
const DashboardHeader = ({ open, setOpen }) => {
    const { data, refetch } = (0, notificationsApi_1.useGetAllNotificationsQuery)(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [updateNotificationStatus, { isSuccess }] = (0, notificationsApi_1.useUpdateNotificationStatusMutation)();
    const [notifications, setNotifications] = (0, react_1.useState)([]);
    const [audio] = (0, react_1.useState)(typeof window !== "undefined" &&
        new Audio("https://res.cloudinary.com/damk25wo5/video/upload/v1693465789/notification_vcetjn.mp3"));
    const playNotificationSound = () => {
        audio.play();
    };
    (0, react_1.useEffect)(() => {
        if (data) {
            setNotifications(data.notifications.filter((item) => item.status === "unread"));
        }
        if (isSuccess) {
            refetch();
        }
        audio.load();
    }, [data, isSuccess, audio]);
    (0, react_1.useEffect)(() => {
        socketId.on("newNotification", (data) => {
            refetch();
            playNotificationSound();
        });
    }, []);
    const handleNotificationStatusChange = async (id) => {
        await updateNotificationStatus(id);
    };
    return (<div className="w-full flex items-center justify-end p-6 fixed top-5 right-0 z-[9999999]">
      <ThemeSwitcher_1.ThemeSwitcher />
      <div className="relative cursor-pointer m-2" onClick={() => setOpen(!open)}>
        <io_1.IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black"/>
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
          {notifications && notifications.length}
        </span>
      </div>
      {open && (<div className="w-[350px] h-[60vh] overflow-y-scroll py-3 px-2 border border-[#ffffff0c] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 z-[1000000000] rounded">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Notifications
          </h5>
          {notifications &&
                notifications.map((item, index) => (<div className="dark:bg-[#2d3a4e] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f]" key={index}>
                <div className="w-full flex items-center justify-between p-2">
                  <p className="text-black dark:text-white">{item.title}</p>
                  <p className="text-black dark:text-white cursor-pointer" onClick={() => handleNotificationStatusChange(item._id)}>
                    Mark as read
                  </p>
                </div>
                <p className="px-2 text-black dark:text-white">
                  {item.message}
                </p>
                <p className="p-2 text-black dark:text-white text-[14px]">
                  {(0, timeago_js_1.format)(item.createdAt)}
                </p>
              </div>))}
        </div>)}
    </div>);
};
exports.default = DashboardHeader;
