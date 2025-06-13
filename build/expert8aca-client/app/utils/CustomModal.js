"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const material_1 = require("@mui/material");
const CustomModal = ({ open, setOpen, setRoute, component: Component, refetch }) => {
    return (<material_1.Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <material_1.Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[95%] m-auto  800px:w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
        <Component setOpen={setOpen} setRoute={setRoute} refetch={refetch}/>
      </material_1.Box>
    </material_1.Modal>);
};
exports.default = CustomModal;
