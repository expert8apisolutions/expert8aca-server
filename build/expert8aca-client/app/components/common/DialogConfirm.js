"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flowbite_react_1 = require("flowbite-react");
const react_1 = __importDefault(require("react"));
const hi_1 = require("react-icons/hi");
const DialogConfirm = ({ openModal, title = "Are you sure you want to delete ?", okTitle = "Yes, I'm sure", cancelTitle = "No, cancel", onClose, onConfirm }) => {
    return (<div>
            <flowbite_react_1.Modal show={openModal} size="md" onClose={onClose} popup>
                <flowbite_react_1.Modal.Header />
                <flowbite_react_1.Modal.Body>
                    <div className="text-center">
                        <hi_1.HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            {title}
                        </h3>
                        <div className="flex justify-center gap-4">
                            <flowbite_react_1.Button color="gray" onClick={onClose}>
                                {cancelTitle}
                            </flowbite_react_1.Button>
                            <flowbite_react_1.Button onClick={onConfirm}>
                                {okTitle}
                            </flowbite_react_1.Button>

                        </div>
                    </div>
                </flowbite_react_1.Modal.Body>
            </flowbite_react_1.Modal>
        </div>);
};
exports.default = DialogConfirm;
