"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableListFiles = void 0;
const flowbite_react_1 = require("flowbite-react");
const FileFolderItem_1 = require("./FileFolderItem");
const ci_1 = require("react-icons/ci");
const dayjs_1 = __importDefault(require("dayjs"));
const FileManager_1 = require("../FileManager");
const md_1 = require("react-icons/md");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const react_1 = require("react");
const ModalEditFolder_1 = require("./ModalEditFolder");
const DialogDeleteConfirm_1 = require("./DialogDeleteConfirm");
const TableListFiles = ({ listFile, isNotRoot, pushNavigatorStack, popNavigatorStack, handleDelFolder, handleDelFile, handleEditFolder, handleEditFile, onClickVideoPreview, }) => {
    return <>
        <div className="relative w-full overflow-x-auto max-w-[1000px]">
            <table className="table-auto min-w-full ltr:text-left rtl:text-right text-sm">
                <thead className="bg-gray-100 dark:bg-gray-900 dark:bg-opacity-40">
                    <tr>
                        <th className="px-4 py-3 font-normal">File name</th>
                        <th className="px-4 py-3 font-normal">Last modified</th>
                        <th className="px-4 py-3 font-normal">File size</th>
                        <th className="px-4 py-3 font-normal text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isNotRoot && (<tr>
                            <td className="px-4 py-3 font-medium">
                                <FileFolderItem_1.FolderItem name="..." onClick={() => {
                popNavigatorStack();
            }}/>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>)}
                    {listFile.map((item) => {
            const isFolder = item.type === "folder";
            const lastUpdate = (0, dayjs_1.default)(item.updatedAt).format("DD-MM-YYYY hh:mm:ss");
            return (<tr key={"table-" + item._id} className="border-b border-gray-200 dark:border-gray-700">
                                <td className="px-4 py-3 font-medium">
                                    {isFolder ? (<FileFolderItem_1.FolderItem name={item.name} onClick={() => {
                        pushNavigatorStack(item._id, item.name);
                    }}/>) : (<div className="flex items-center">
                                            <FileFolderItem_1.FileItem name={item.name} onClick={() => {
                        onClickVideoPreview(item.playbackId, item.assetId, item.status);
                    }}/>
                                            <div className="ml-5 cursor-pointer hover:scale-105 flex gap-5 items-center">
                                                {item.status === FileManager_1.VideoStatus.PREPARING && <>
                                                        <flowbite_react_1.Tooltip content={`Preparing Video ${item.percent}%`}>
                                                            <SvgInProgress />
                                                        </flowbite_react_1.Tooltip>
                                                    </>}
                                                {item.playbackId && (<md_1.MdCopyAll onClick={() => {
                            navigator.clipboard.writeText(item.playbackId?.replace("https://player.vimeo.com/video/", ''));
                            react_hot_toast_1.default.success("Copied playback id to clipboard");
                        }} size={20} title="copy video ID"/>)}
                                            </div>
                                        </div>)}
                                </td>
                                <td className="px-4 py-3 font-normal text-center text-gray-400">
                                    {lastUpdate}
                                </td>
                                <td className="px-4 py-3 font-normal text-right text-gray-400">
                                    {item.sizeInMB}{" "}
                                    {isFolder ? "" : " MB"}
                                </td>
                                <td className="px-4 py-3 font-medium text-right">
                                    <Action isFolder={isFolder} item={item} onDelete={() => {
                    isFolder
                        ? handleDelFolder(item._id)
                        : handleDelFile(item._id, item.assetId, item.awsId);
                }} onEdit={isFolder
                    ? (name) => handleEditFolder(item._id, name)
                    : (name) => handleEditFile(item._id, name)}/>
                                </td>
                            </tr>);
        })}
                </tbody>
            </table>
        </div>
    </>;
};
exports.TableListFiles = TableListFiles;
const Action = ({ isFolder, onDelete, item, onEdit }) => {
    const [openModal, setOpenModal] = (0, react_1.useState)(false);
    const [openModalEdit, setOpenModalEdit] = (0, react_1.useState)(false);
    const handleDelete = () => {
        onDelete();
        setOpenModal(false);
    };
    const handleEditFolder = (name) => {
        onEdit(name);
        setOpenModalEdit(false);
    };
    return (<div className="flex gap-2 justify-end">
            <ModalEditFolder_1.ModalEditFolder open={openModalEdit} onClose={() => setOpenModalEdit(false)} onEditFolder={handleEditFolder} name={item.name}/>
            <DialogDeleteConfirm_1.DialogDeleteConfirm onConfirm={handleDelete} onClose={() => setOpenModal(false)} openModal={openModal}/>
            <button className="inline-block ltr:mr-2 rtl:ml-2 hover:text-red-500 duration-100 hover:scale-150" title="Delete">
                <ci_1.CiTrash onClick={() => setOpenModal(true)} size={20}/>
            </button>
            <button className="inline-block ltr:mr-2 rtl:ml-2 hover:text-orange-400 duration-100 hover:scale-150" title="Rename">
                <ci_1.CiEdit onClick={() => setOpenModalEdit(true)} size={20} className=" font-extralight"/>
            </button>
        </div>);
};
const SvgInProgress = () => {
    return <svg fill="none" viewBox="0 0 16 16" className="animate-spin overflow-hidden w-[15px]" aria-hidden="true" role="img">
        <path opacity=".5" d="M8 15A7 7 0 108 1a7 7 0 000 14v0z" stroke="#dbab0a" strokeWidth={2}/>
        <path d="M15 8a7 7 0 01-7 7" stroke="#dbab0a" strokeWidth={2}/>
        <path d="M8 12a4 4 0 100-8 4 4 0 000 8z" fill="#dbab0a"/>
    </svg>;
};
