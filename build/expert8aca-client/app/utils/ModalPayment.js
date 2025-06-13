"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const material_1 = require("@mui/material");
const md_1 = require("react-icons/md");
const ModalPayment = ({ open, setOpen, children }) => {
    return (<material_1.Modal open={open} 
    // onClose={() => setOpen(false)}
    aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" sx={{
            '&.MuiModal-root': {
                zIndex: '800 !important'
            }
        }}>
      <material_1.Box className=" max-h-[100vh] overflow-auto absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 m-auto  bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
        <div className='w-full relative mb-2'>
          <md_1.MdClose onClick={() => setOpen(false)} className='text-black text-right absolute right-0 top-0 text-2xl'/>
        </div>
        {children}
      </material_1.Box>
    </material_1.Modal>);
};
exports.default = ModalPayment;
