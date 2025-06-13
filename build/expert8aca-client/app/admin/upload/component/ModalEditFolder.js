"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalEditFolder = void 0;
const flowbite_react_1 = require("flowbite-react");
const react_1 = require("react");
const ModalEditFolder = ({ open, onClose, onEditFolder, name }) => {
    const [folderName, setFolderName] = (0, react_1.useState)(name);
    return (<flowbite_react_1.Modal show={open} onClose={onClose} size={"sm"}>
            <flowbite_react_1.Modal.Header>Edit</flowbite_react_1.Modal.Header>
            <div className="flex flex-col items-center">
                <div className="py-[20px] pb-10">
                    <div className="mb-2 block mt-2">
                        <flowbite_react_1.Label htmlFor="small" value="Name"/>
                    </div>
                    <flowbite_react_1.TextInput className="min-w-[240px]" value={folderName} onChange={(event) => setFolderName(event.target.value)} id="small" type="text" sizing="md"/>
                </div>
                <div className="mb-5">
                    <flowbite_react_1.Button className="min-w-[100px]" color="success" onClick={() => {
            onEditFolder(folderName);
        }}>
                        Update
                    </flowbite_react_1.Button>
                </div>
            </div>
        </flowbite_react_1.Modal>);
};
exports.ModalEditFolder = ModalEditFolder;
