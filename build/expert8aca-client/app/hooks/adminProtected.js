"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const navigation_1 = require("next/navigation");
const react_redux_1 = require("react-redux");
function AdminProtected({ children }) {
    const { user } = (0, react_redux_1.useSelector)((state) => state.auth);
    if (user) {
        const isAdmin = user?.role === "admin";
        return isAdmin ? children : (0, navigation_1.redirect)("/");
    }
}
exports.default = AdminProtected;
