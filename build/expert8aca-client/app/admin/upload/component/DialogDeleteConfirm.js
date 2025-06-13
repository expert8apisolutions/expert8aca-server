"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogDeleteConfirm = void 0;
const flowbite_react_1 = require("flowbite-react");
const hi_1 = require("react-icons/hi");
const DialogDeleteConfirm = ({ openModal, onClose, onConfirm }) => {
    return (<flowbite_react_1.Modal show={openModal} size="md" onClose={onClose} popup>
            <flowbite_react_1.Modal.Header />
            <flowbite_react_1.Modal.Body>
                <div className="text-center">
                    <hi_1.HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete ?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <flowbite_react_1.Button color="failure" onClick={onConfirm}>
                            {"Yes, I'm sure"}
                        </flowbite_react_1.Button>
                        <flowbite_react_1.Button color="gray" onClick={onClose}>
                            No, cancel
                        </flowbite_react_1.Button>
                    </div>
                </div>
            </flowbite_react_1.Modal.Body>
        </flowbite_react_1.Modal>);
};
exports.DialogDeleteConfirm = DialogDeleteConfirm;
