"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
function UserAuth() {
    const { user } = (0, react_redux_1.useSelector)((state) => state.auth);
    if (user) {
        return true;
    }
    else {
        return false;
    }
}
exports.default = UserAuth;
