"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileItem = exports.FolderItem = void 0;
const fc_1 = require("react-icons/fc");
const FolderItem = ({ name, onClick }) => {
    return (<>
            <div onClick={onClick} className="flex items-center cursor-pointer">
                <fc_1.FcFolder size={25}/>
                <span className="pl-2"> {name}</span>
            </div>
        </>);
};
exports.FolderItem = FolderItem;
const FileItem = ({ name, onClick }) => {
    return (<>
            <div onClick={onClick} className="flex items-center cursor-pointer">
                <fc_1.FcStart size={20}/>
                <span className="pl-2">{name}</span>
            </div>
        </>);
};
exports.FileItem = FileItem;
