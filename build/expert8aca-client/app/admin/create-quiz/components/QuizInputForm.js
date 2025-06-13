"use strict";
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
const react_1 = __importStar(require("react"));
const flowbite_react_1 = require("flowbite-react");
const TableQuestion_1 = __importDefault(require("./TableQuestion"));
const TIME_MINUTE_DEFULT = 120;
const AddQuiz = ({ items, callBack, onEdit, onDelete, state, setState, }) => {
    const [isCheckTotalTime, setIsCheckTotalTime] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setIsCheckTotalTime(state.isCheckTotalTime);
    }, [state.isCheckTotalTime]);
    const handleEdit = (value) => { };
    const handleDelete = () => { };
    const handleChangeInput = (event) => {
        const { name, value } = event.target;
        if (["maxSubmissionPreTest", "maxSubmissionPostTest"].includes(name)) {
            setState((prev) => ({
                ...prev,
                [name]: validateNumber(+value),
            }));
            return;
        }
        setState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const validatePercentage = (event) => {
        const { value } = event.target;
        let newVal = value;
        if (value < 1) {
            newVal = 1;
        }
        if (value > 100) {
            newVal = 100;
        }
        setState((prev) => ({
            ...prev,
            passPercentage: newVal,
        }));
    };
    const validateNumber = (value) => {
        if (value < 1) {
            return 1;
        }
        if (value > 10) {
            return 10;
        }
        return value;
    };
    const totalQuestion = items?.length ?? 0;
    const amountItemPassFromPercent = Math.floor((state.passPercentage * totalQuestion) / 100);
    return (<div>
            <div className="flex flex-col  ">
                <div className="grid grid-cols-2 gap-10">
                    <div>
                        <div>
                            <div className="mt-2 block">
                                <flowbite_react_1.Label htmlFor="small" value="Name"/>
                            </div>
                            <flowbite_react_1.TextInput value={state.name} onChange={handleChangeInput} name="name" id="small" type="text" sizing="sm"/>
                        </div>
                        <div>
                            <div className="mt-2 block">
                                <flowbite_react_1.Label htmlFor="comment" value="Description"/>
                            </div>
                            <flowbite_react_1.Textarea name="description" id="description" placeholder="Leave a comment..." required rows={4}/>
                        </div>
                    </div>

                    <div>
                        <div>
                            <div className="mt-2 block space-x-2">
                                <flowbite_react_1.Label htmlFor="small" value="Pass Percentage"/>
                                <span className="text-gray-400 text-sm">
                                    ({`${amountItemPassFromPercent}/${totalQuestion}`} questions)
                                </span>
                            </div>
                            <flowbite_react_1.TextInput onBlur={validatePercentage} value={state.passPercentage} onChange={handleChangeInput} name="passPercentage" id="small" type="number" sizing="sm"/>
                        </div>
                        <div>
                            <div className="mt-2 block">
                                <flowbite_react_1.Label htmlFor="small" value="Max Submission pre test"/>
                            </div>
                            <flowbite_react_1.TextInput value={state.maxSubmissionPreTest} onChange={handleChangeInput} name="maxSubmissionPreTest" id="small" type="number" sizing="sm"/>
                        </div>
                        <div>
                            <div className="mt-2 block">
                                <flowbite_react_1.Label htmlFor="small" value="Max Submission post test"/>
                            </div>
                            <flowbite_react_1.TextInput value={state.maxSubmissionPostTest} onChange={handleChangeInput} name="maxSubmissionPostTest" id="small" type="number" sizing="sm"/>
                        </div>
                        <div>
                            <div className="mt-2 block">
                                <flowbite_react_1.Label htmlFor="small" value="Limit Time"/>
                            </div>
                            <div className="flex items-center gap-4">
                                <flowbite_react_1.Checkbox className={`${isCheckTotalTime ? "" : "mt-2"}`} id="accept" checked={isCheckTotalTime} onChange={({ target }) => {
            setIsCheckTotalTime(target.checked);
            if (target.checked && state.timeLimitMinutes === 0) {
                setState((prev) => ({
                    ...prev,
                    timeLimitMinutes: TIME_MINUTE_DEFULT,
                }));
            }
        }}/>
                                <div className="flex gap-2 items-center">
                                    {isCheckTotalTime && (<>
                                            <flowbite_react_1.TextInput value={state.timeLimitMinutes} onChange={handleChangeInput} name="timeLimitMinutes" id="timeLimitMinutes" type="number" sizing="sm"/>
                                            <span className="text-gray-400">minutes</span>
                                        </>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-[50px]">
                    <TableQuestion_1.default callBack={callBack} items={items} onEdit={onEdit} onDelete={onDelete}/>
                </div>
            </div>
        </div>);
};
exports.default = AddQuiz;
