"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoStatus = void 0;
const react_1 = __importStar(require("react"));
const flowbite_react_1 = require("flowbite-react");
const fa6_1 = require("react-icons/fa6");
const ri_1 = require("react-icons/ri");
const ci_1 = require("react-icons/ci");
const fileApi_1 = require("@/redux/features/file/fileApi");
const flowbite_react_2 = require("flowbite-react");
const hi_1 = require("react-icons/hi");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const flowbite_react_3 = require("flowbite-react");
const action_1 = require("./serverAction/action");
const aws_util_1 = require("./aws.util");
const ModalAddFolder_1 = require("./component/ModalAddFolder");
const ModalPlayVideo_1 = require("./component/ModalPlayVideo");
const TableListFiles_1 = require("./component/TableListFiles");
const ModalUploadVimeo_1 = __importDefault(require("./component/ModalUploadVimeo"));
const INTERVAL_CHECK_PREPARE_IN_SEC = 5;
const mockData = [];
let interval = null;
var VideoStatus;
(function (VideoStatus) {
    VideoStatus["PREPARING"] = "preparing";
    VideoStatus["READY"] = "ready";
    VideoStatus["FAILED"] = "failed";
})(VideoStatus || (exports.VideoStatus = VideoStatus = {}));
const FileManager = () => {
    const { data: fileAndFolder, isLoading, isSuccess, error, refetch, } = (0, fileApi_1.useGetAllFileAndFolderQuery)({}, {
        refetchOnMountOrArgChange: true,
    });
    const [addFolder] = (0, fileApi_1.useAddFolderMutation)();
    const [deleteFolder] = (0, fileApi_1.useDeleteFolderMutation)();
    const [getFolder, { isLoading: isLoadingGetFolder, }] = (0, fileApi_1.useGetFolderMutation)();
    const [addFile] = (0, fileApi_1.useAddFileMutation)();
    const [delFile] = (0, fileApi_1.useDelFileMutation)();
    const [editFolder] = (0, fileApi_1.useEditFolderMutation)();
    const [editFile] = (0, fileApi_1.useEditFileMutation)();
    const [listFile, setListFile] = (0, react_1.useState)(mockData);
    const [openModalAddFolder, setOpenModalAddFolder] = (0, react_1.useState)(false);
    const [usedProgress, setUsedProgress] = (0, react_1.useState)(0);
    const [usedState, setUsedState] = (0, react_1.useState)({
        used: 0,
        total: 0,
        percent: 0,
    });
    const [openModalUpload, setOpenModalUpload] = (0, react_1.useState)(false);
    const [navigatorStack, setNavigatorStack] = (0, react_1.useState)([]);
    const [openModalPlayVideo, setOpenModalPlayVideo] = (0, react_1.useState)({
        open: false,
        playbackId: "",
        assetId: "",
        status: "",
    });
    const [labelId, setLabelId] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        pushNavigatorStack("root", "root");
    }, []);
    (0, react_1.useEffect)(() => {
        if (fileAndFolder) {
            const mergeAll = mergeAllFolderFile(fileAndFolder.folders, fileAndFolder.files);
            setListFile([...mergeAll]);
            setProgreesFormat(fileAndFolder.sizeUsedInGB, fileAndFolder.sizeLimitInGB);
            setLabelId(fileAndFolder.labelId);
        }
    }, [fileAndFolder, isSuccess, error, isLoading]);
    const setProgreesFormat = (used, total) => {
        const percent = (used / total) * 100;
        setUsedState({
            used: used,
            total: total,
            percent: +percent?.toFixed(2),
        });
    };
    (0, react_1.useEffect)(() => {
        if (interval)
            clearInterval(interval);
        interval = setInterval(() => {
            checkStatusFilePrepare();
        }, INTERVAL_CHECK_PREPARE_IN_SEC * 1000);
        return () => clearInterval(interval);
    }, [navigatorStack, listFile]);
    const checkStatusFilePrepare = () => {
        const allFileList = listFile.filter((item) => item.type === 'file');
        const someFileIsPreparing = allFileList.some((item) => item.status === VideoStatus.PREPARING);
        if (someFileIsPreparing) {
            refreshCurrentFolder();
        }
        else {
            clearInterval(interval);
        }
    };
    const handleAddFolder = (name) => {
        const currentFolderId = getCurrentFolder().id;
        react_hot_toast_1.default.promise(addFolder({
            name,
            parentId: currentFolderId === "root" ? null : currentFolderId,
            childFolders: [],
            childFiles: [],
        })
            .unwrap()
            .then((res) => {
            handleGetFolder(currentFolderId);
        }), {
            loading: "Adding...",
            success: "Add success",
            error: "Add failed",
        });
    };
    const handleDelFolder = (id) => {
        react_hot_toast_1.default.promise(deleteFolder(id)
            .unwrap()
            .then((res) => {
            refreshCurrentFolder();
        }), {
            loading: "Deleting...",
            success: "Delete success",
            error: "Delete failed",
        });
    };
    const pushNavigatorStack = async (id, name) => {
        await handleGetFolder(id);
        setNavigatorStack((prev) => [...prev, { id, name }]);
    };
    const popNavigatorStack = async () => {
        const newStack = [...navigatorStack];
        newStack.pop();
        await handleGetFolder(getBackFolder()?.id || "root");
        setNavigatorStack(newStack);
    };
    const refreshCurrentFolder = () => {
        const currentFolderId = getCurrentFolder().id;
        handleGetFolder(currentFolderId);
    };
    const mergeAllFolderFile = (folders = [], files = []) => {
        const allFolder = folders.map((item) => ({ ...item, type: "folder" }));
        const allFile = files.map((item) => ({ ...item, type: "file" }));
        const mergeAll = [...allFolder, ...allFile];
        return mergeAll;
    };
    const handleGetFolder = async (id) => {
        if (id === "root") {
            await refetch()
                .unwrap()
                .then((res) => {
                const mergeAll = mergeAllFolderFile(res.folders, res.files);
                setListFile(mergeAll);
            });
            return;
        }
        await getFolder(id)
            .unwrap()
            .then((result) => {
            const mergeAll = mergeAllFolderFile(result.folder.childFolders, result.folder.childFiles);
            setListFile(mergeAll);
            setProgreesFormat(result.sizeUsedInGB, result.sizeLimitInGB);
        });
    };
    const clickNavigatorStack = (id) => {
        const index = navigatorStack.findIndex((item) => item.id === id);
        const newStack = navigatorStack.slice(0, index + 1);
        setNavigatorStack(newStack);
        handleGetFolder(id);
    };
    const getCurrentFolder = () => {
        return navigatorStack[navigatorStack.length - 1];
    };
    const getBackFolder = () => {
        return navigatorStack[navigatorStack.length - 2];
    };
    const handleSaveFile = (file) => {
        react_hot_toast_1.default.promise(addFile({
            ...file,
            parentId: getCurrentFolder().id === "root" ? null : getCurrentFolder().id,
        })
            .unwrap()
            .then((res) => {
            refreshCurrentFolder();
        }), {
            loading: "Uploading...",
            success: "Upload success",
            error: (error) => (error.data.message || "Upload failed"),
        });
    };
    const isNotRoot = getCurrentFolder()?.id !== "root";
    const onClickVideoPreview = (playbackId, assetId, status) => {
        setOpenModalPlayVideo({
            open: true,
            playbackId,
            assetId,
            status
        });
    };
    const handleDelFile = async (id, assetId, awsId) => {
        react_hot_toast_1.default.promise(delFile(id)
            .unwrap()
            .then((res) => {
            refreshCurrentFolder();
            aws_util_1.s3.deleteObject({
                Bucket: aws_util_1.S3_BUCKET,
                Key: awsId,
            }).promise();
            if (assetId) {
                (0, action_1.deleteVideoStreamable)(assetId);
            }
        }), {
            loading: "Deleting...",
            success: "Delete success",
            error: "Delete failed",
        });
    };
    const handleEditFolder = (id, name) => {
        react_hot_toast_1.default.promise(editFolder({
            id,
            name,
        })
            .unwrap()
            .then((res) => {
            refreshCurrentFolder();
        }), {
            loading: "Editing...",
            success: "Edit success",
            error: "Edit failed",
        });
    };
    const handleEditFile = (id, name) => {
        react_hot_toast_1.default.promise(editFile({
            id,
            name,
        })
            .unwrap()
            .then((res) => {
            refreshCurrentFolder();
        }), {
            loading: "Editing...",
            success: "Edit success",
            error: "Edit failed",
        });
    };
    return (<div>
            {openModalPlayVideo.open && (<ModalPlayVideo_1.ModalPlayVideo open={openModalPlayVideo.open} onClose={() => setOpenModalPlayVideo({
                open: false,
                playbackId: "",
                assetId: "",
                status: "",
            })} assetId={openModalPlayVideo.assetId} playbackId={openModalPlayVideo.playbackId} status={openModalPlayVideo.status} refresh={refreshCurrentFolder}/>)}
            {openModalAddFolder && (<ModalAddFolder_1.ModalAddFolder onAddFolder={(name) => {
                handleAddFolder(name);
                setOpenModalAddFolder(false);
            }} open={openModalAddFolder} onClose={() => setOpenModalAddFolder(false)}/>)}
            <div className="flex justify-center">
                <div className="w-full max-w-[1000px]">
                    <div className="flex justify-between mb-6">
                        <flowbite_react_1.Button color="light" onClick={() => setOpenModalAddFolder(true)}>
                            <fa6_1.FaFolderPlus className="mr-2 h-5 w-5"/>
                            New Folder
                        </flowbite_react_1.Button>
                        <flowbite_react_1.Button color="failure" onClick={() => {
            if ((usedState.percent >= 100)) {
                react_hot_toast_1.default.error(`Storage limit exceeded. Limit is ${usedState.total} GB`);
                return;
            }
            setOpenModalUpload(true);
        }}>
                            <ri_1.RiVideoUploadLine className="mr-2 h-5 w-5"/>
                            Upload video
                        </flowbite_react_1.Button>
                        {/* {
            openModalUpload && <ModalUploadAWS
                {...{
                    isOpen: openModalUpload,
                    onClose: () => setOpenModalUpload(false),
                    handleSaveFile,
                    labelId,
                    usedState
                }}
            />
        } */}
                        {openModalUpload && <ModalUploadVimeo_1.default {...{
            isOpen: openModalUpload,
            onClose: () => setOpenModalUpload(false),
            handleSaveFile,
            labelId,
            usedState
        }}/>}

                    </div>
                    <DataSizeUsed usedState={usedState}/>
                    <NavigatorStack navigatorStack={navigatorStack} onClick={clickNavigatorStack}/>
                    <TableListFiles_1.TableListFiles {...({
        listFile,
        isNotRoot,
        pushNavigatorStack,
        popNavigatorStack,
        handleDelFolder,
        handleDelFile,
        handleEditFolder,
        handleEditFile,
        onClickVideoPreview,
    })}/>
                </div>
            </div>
        </div>);
};
const NavigatorStack = ({ navigatorStack, onClick }) => {
    return (<div className="flex gap-2">
            <flowbite_react_2.Breadcrumb aria-label="Solid background breadcrumb example" className="mb-2">
                {navigatorStack.map((item, idx) => {
            const isLast = idx === navigatorStack.length - 1;
            if (idx === 0)
                return (<flowbite_react_2.Breadcrumb.Item key={"stack-0"} onClick={() => onClick(item.id)} href="#" icon={hi_1.HiHome}>
                                Home
                            </flowbite_react_2.Breadcrumb.Item>);
            return (<flowbite_react_2.Breadcrumb.Item key={'navigate-' + item.id} href={isLast ? undefined : "#"} onClick={() => !isLast && onClick(item.id)} className={isLast ? "text-gray-100" : "text-indigo-500"}>
                            {item.name}
                        </flowbite_react_2.Breadcrumb.Item>);
        })}
            </flowbite_react_2.Breadcrumb>
        </div>);
};
const DataSizeUsed = ({ usedState }) => {
    return (<>
            <div className="bg-gray-100 dark:bg-gray-700 shadow block p-6 font-semibold rounded max-lg:mb-4 mb-7">
                <div className="flex gap-1 items-center">
                    <ci_1.CiFolderOn size={30}/> <span>Quota</span>
                </div>
                <div className="w-full h-2 bg-indigo-200 rounded-full my-2" title="36%">
                    <flowbite_react_3.Progress progress={usedState.percent} progressLabelPosition="inside" textLabel="" textLabelPosition="outside" size="lg"/>
                </div>
                <div className="text-sm inline-block text-gray-500 dark:text-gray-100">
                    <span className="text-gray-700 dark:text-white font-bold">{usedState.used?.toFixed(2)} Gb</span>
                    /{usedState.total} Gb <span className="text-[10px] text-gray-400">({usedState.percent})%</span>
                </div>
            </div>
        </>);
};
exports.default = FileManager;
