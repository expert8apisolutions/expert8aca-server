"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.converTimeHrToSec = exports.ConvertSecondToLabel = exports.DiffBetweenDateWithLabel = exports.DiffBetweenDateInSecond = exports.DiffBetweenDateInMinutes = exports.DateShortEN = exports.DateLongEN = exports.DateShortTHAndTime = exports.DateShortTH = exports.DateLongTH = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/th");
const buddhistEra_1 = __importDefault(require("dayjs/plugin/buddhistEra"));
dayjs_1.default.extend(buddhistEra_1.default);
/* 07 กุมภาพันธ์ 2566 */
const DateLongTH = (date) => {
    dayjs_1.default.locale("th");
    return (0, dayjs_1.default)(date).format("DD MMMM BBBB");
};
exports.DateLongTH = DateLongTH;
/* 07 ก.พ. 2566 */
const DateShortTH = (date) => {
    dayjs_1.default.locale("th");
    return (0, dayjs_1.default)(date).format("DD MMM BB");
};
exports.DateShortTH = DateShortTH;
const DateShortTHAndTime = (date) => {
    dayjs_1.default.locale("th");
    return (0, dayjs_1.default)(date).format("DD MMM BB HH:mm");
};
exports.DateShortTHAndTime = DateShortTHAndTime;
/* 07 February 2023 */
const DateLongEN = (date) => {
    dayjs_1.default.locale("en");
    return (0, dayjs_1.default)(date).format("DD MMMM YYYY");
};
exports.DateLongEN = DateLongEN;
/* 07 Feb 23 */
const DateShortEN = (date) => {
    dayjs_1.default.locale("en");
    return (0, dayjs_1.default)(date).format("DD MMM YY");
};
exports.DateShortEN = DateShortEN;
const DiffBetweenDateInMinutes = (date1, date2) => {
    const diffDateInSecond = (0, dayjs_1.default)(date1).diff((0, dayjs_1.default)(date2), "second");
    if (diffDateInSecond < 60) {
        return diffDateInSecond;
    }
    return Math.floor(diffDateInSecond / 60);
};
exports.DiffBetweenDateInMinutes = DiffBetweenDateInMinutes;
const DiffBetweenDateInSecond = (date1, date2) => {
    return (0, dayjs_1.default)(date1).diff((0, dayjs_1.default)(date2), "second");
};
exports.DiffBetweenDateInSecond = DiffBetweenDateInSecond;
const DiffBetweenDateWithLabel = (date1, date2) => {
    const diffDateInSecond = (0, dayjs_1.default)(date1).diff((0, dayjs_1.default)(date2), "second");
    if (diffDateInSecond < 60) {
        return `${diffDateInSecond} วินาที`;
    }
    const diffDateInMinute = Math.floor(diffDateInSecond / 60);
    if (diffDateInMinute < 60) {
        return `${diffDateInMinute} นาที`;
    }
    const diffDateInHour = Math.floor(diffDateInMinute / 60);
    if (diffDateInHour < 24) {
        return `${diffDateInHour} ชั่วโมง`;
    }
    const diffDateInDay = Math.floor(diffDateInHour / 24);
    return `${diffDateInDay} วัน`;
};
exports.DiffBetweenDateWithLabel = DiffBetweenDateWithLabel;
const ConvertSecondToLabel = (second) => {
    // if (second < 60) {
    //   return `${second} วินาที`;
    // }
    const minute = Math.floor(second / 60);
    if (minute < 60) {
        return `${minute} นาที`;
    }
    const hour = Math.floor(minute / 60);
    if (hour < 24) {
        return `${hour} ชั่วโมง`;
    }
    const day = Math.floor(hour / 24);
    return `${day} วัน`;
};
exports.ConvertSecondToLabel = ConvertSecondToLabel;
const converTimeHrToSec = (time) => {
    return time * 60 * 60;
};
exports.converTimeHrToSec = converTimeHrToSec;
