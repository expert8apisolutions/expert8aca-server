"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flowbite_react_1 = require("flowbite-react");
const react_1 = require("react");
const flowbite_react_2 = require("flowbite-react");
const action_1 = require("../serverAction/action");
const aws_util_1 = require("../aws.util");
const react_dropzone_1 = require("react-dropzone");
const flowbite_react_3 = require("flowbite-react");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const lib_storage_1 = require("@aws-sdk/lib-storage");
const client_s3_1 = require("@aws-sdk/client-s3");
const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};
const focusedStyle = {
    borderColor: '#2196f3'
};
const acceptStyle = {
    borderColor: '#00e676'
};
const rejectStyle = {
    borderColor: '#ff1744'
};
function ModalUploadAWS({ isOpen, onClose, handleSaveFile, labelId, usedState, }) {
    const [file, setFile] = (0, react_1.useState)(null);
    const [videoPlayback, setVideoPlaybackId] = (0, react_1.useState)("");
    const [isOpenUpload, setIsOpenUpload] = (0, react_1.useState)(true);
    const [assetId, setAssetId] = (0, react_1.useState)("");
    const [videoInfo, setVideoInfo] = (0, react_1.useState)({
        name: "",
        size: "",
        type: "",
    });
    const [processing, setProcessing] = (0, react_1.useState)(false);
    const [prepareUpload, setPrepareUpload] = (0, react_1.useState)(null);
    const { acceptedFiles, getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = (0, react_dropzone_1.useDropzone)({
        maxFiles: 1,
        accept: {
            'video/mp4': ['.mp4', '.MP4'],
        }
    });
    const [uploadProgress, setUploadProgress] = (0, react_1.useState)(0);
    const [isUploaded, setIsUploaded] = (0, react_1.useState)(false);
    const [awsId, setAwsId] = (0, react_1.useState)("");
    const [stremableInfo, setStreamableInfo] = (0, react_1.useState)({
        shortcode: "",
        title: "",
        streamable_url: "",
    });
    const resetState = () => {
        setIsOpenUpload(true);
        setVideoPlaybackId("");
        setFile(null);
        setVideoInfo({
            name: "",
            size: "",
            type: "",
        });
        setAssetId("");
        setPrepareUpload(null);
    };
    const handleClose = () => {
        resetState();
        aws_util_1.s3.deleteObject({
            Bucket: aws_util_1.S3_BUCKET,
            Key: awsId,
        }).promise();
        if (stremableInfo.shortcode) {
            (0, action_1.deleteVideoStreamable)(stremableInfo.shortcode);
        }
        setPrepareUpload(null);
        onClose();
    };
    const handleSave = () => {
        handleSaveFile({
            name: videoInfo.name,
            sizeInMB: videoInfo.size,
            format: videoInfo.type,
            assetId,
            playbackId: assetId || null,
            status: "preparing",
            awsId,
        });
        resetState();
        onClose();
    };
    (0, react_1.useEffect)(() => {
        const file = acceptedFiles[0];
        if (file) {
            const fileSizeInMB = file.size / (1024 * 1024);
            const name = file.name;
            const size = fileSizeInMB.toFixed(2); // Limit to two decimal places
            const type = file.type;
            // You can access other properties likelastModified
            setVideoInfo({
                name,
                size,
                type,
            });
            setFile(file);
            // uploadFile(file)
            uploadFileMultipart(file);
        }
    }, [acceptedFiles]);
    const uploadFile = async (file) => {
        const currentAwsId = await (0, action_1.getAwsVideoId)();
        const params = {
            Bucket: aws_util_1.S3_BUCKET,
            Key: currentAwsId,
            Body: file,
            ContentType: file.type,
        };
        const upload = aws_util_1.s3
            .putObject(params)
            .on("httpUploadProgress", (evt, data) => {
            setUploadProgress(+(((+evt.loaded * 100) / evt.total)).toFixed(1));
        })
            .promise();
        await upload.then(async (err) => {
            setIsUploaded(true);
            setProcessing(true);
            await (0, action_1.uploadToStreamable)({
                awsId: currentAwsId,
                title: file.name,
                labelId: labelId,
            })
                .then((result) => {
                setStreamableInfo(result);
                setAssetId(result.shortcode);
                return result;
            })
                .catch((err) => {
                react_hot_toast_1.default.error("Error get Asset Id.");
            }).finally(() => {
                setProcessing(false);
            });
        });
        setAwsId(currentAwsId);
    };
    const uploadFileMultipart = async (file) => {
        const fileSizeInMB = file.size / (1024 * 1024);
        const fileSizeInGB = fileSizeInMB / 1024;
        const totalUnsed = usedState.used + fileSizeInGB;
        if (totalUnsed > usedState.total) {
            onClose();
            return react_hot_toast_1.default.error("You are out of storage space.");
        }
        const currentAwsId = await (0, action_1.getAwsVideoId)();
        const target = { Bucket: aws_util_1.S3_BUCKET, Key: currentAwsId, Body: file };
        const creds = { accessKeyId: aws_util_1.AWS_ACCESS_KEY_ID, secretAccessKey: aws_util_1.AWS_SECRET_ACCESS_KEY };
        try {
            const parallelUploadS3 = new lib_storage_1.Upload({
                client: new client_s3_1.S3Client({ region: aws_util_1.REGION, credentials: creds }),
                leavePartsOnError: false,
                params: target,
            });
            parallelUploadS3.on("httpUploadProgress", (progress) => {
                const percentage = Math.round((progress.loaded / progress.total) * 100).toFixed(1);
                setUploadProgress(+percentage);
            });
            parallelUploadS3.done().then(async (data) => {
                console.log('upload success', data);
                setIsUploaded(true);
                setProcessing(true);
                await (0, action_1.uploadToStreamable)({
                    awsId: currentAwsId,
                    title: file.name,
                    labelId: labelId,
                })
                    .then((result) => {
                    setStreamableInfo(result);
                    setAssetId(result.shortcode);
                    setAwsId(currentAwsId);
                    return result;
                })
                    .catch((err) => {
                    react_hot_toast_1.default.error("Error get Asset Id.");
                }).finally(() => {
                    setProcessing(false);
                });
            });
        }
        catch (e) {
            console.log(e);
        }
    };
    const style = (0, react_1.useMemo)(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);
    return (<>
            <flowbite_react_1.Modal show={isOpen} onClose={handleClose} className="text-black">
                <flowbite_react_1.Modal.Header>Upload Video</flowbite_react_1.Modal.Header>
                <flowbite_react_1.Modal.Body>                 
                    <div className="mb-5">
                        {uploadProgress > 0 && <flowbite_react_3.Progress progress={uploadProgress} textLabel="Upload" size="lg" labelProgress labelText/>}
                    </div>
                    {!file && <div className="container">
                            <div {...getRootProps({ style })}>
                                <input {...getInputProps()}/>
                                <p>Drag 'n' drop some files here, to upload</p>
                            </div>
                        </div>}
                    <div>
                        <div className="mb-2 block mt-2">
                            <flowbite_react_2.Label htmlFor="small" value="Video Name"/>
                        </div>
                        <flowbite_react_2.TextInput value={videoInfo.name} onChange={(event) => setVideoInfo({ ...videoInfo, name: event.target.value })} id="small" type="text" sizing="sm"/>
                    </div>
                    <div>
                        <div className="mb-2 block mt-2">
                            <flowbite_react_2.Label htmlFor="small" value="Video Size"/>
                        </div>
                        <flowbite_react_2.TextInput disabled value={videoInfo.size + `${videoInfo.size ? " MB" : ""}`} id="small" type="text" sizing="sm"/>
                    </div>
                    <div>
                        <div className="mb-2 block mt-2">
                            <flowbite_react_2.Label htmlFor="small" value="Video Type"/>
                        </div>
                        <flowbite_react_2.TextInput disabled value={videoInfo.type} id="small" type="text" sizing="sm"/>
                    </div>
                    <div>
                        <div className="mb-2 block mt-2">
                            <flowbite_react_2.Label htmlFor="small" value="Video Asset Id"/>
                        </div>
                        <flowbite_react_2.TextInput disabled value={stremableInfo.shortcode} id="small" type="text" sizing="sm"/>
                    </div>
                </flowbite_react_1.Modal.Body>
                <flowbite_react_1.Modal.Footer>
                    <flowbite_react_1.Button isProcessing={processing} disabled={!stremableInfo.shortcode} onClick={handleSave}>
                        {processing ? 'Processing...' : 'Save'}
                    </flowbite_react_1.Button>
                    <flowbite_react_1.Button color="gray" onClick={handleClose}>
                        Cancel
                    </flowbite_react_1.Button>
                </flowbite_react_1.Modal.Footer>
            </flowbite_react_1.Modal>
        </>);
}
exports.default = ModalUploadAWS;
