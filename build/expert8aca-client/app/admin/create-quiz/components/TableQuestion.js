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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_sortable_hoc_1 = require("react-sortable-hoc");
const array_move_1 = require("array-move");
const md_1 = require("react-icons/md");
const ci_1 = require("react-icons/ci");
// Drag handle component
const DragHandle = (0, react_sortable_hoc_1.SortableHandle)(() => (<span className='prevent-select' style={{ cursor: 'grab', marginRight: '8px' }}>
    <md_1.MdDragHandle size={24}/>
  </span>));
const SortableItem = (0, react_sortable_hoc_1.SortableElement)(({ value, handleEdit, onDelete }) => {
    return (<div style={{
            padding: '16px',
            margin: '0 0 8px 0',
            minHeight: '50px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
        }}>
      <DragHandle />
      <div className='flex justify-between w-full'>
        <div>
          <div className='text-[16px]'>{value.no}. {value.question}</div>
          <div className='text-[12px]'>Ans. {value.answer}{" )"} {(value?.choices?.find(ele => ele.choice === value.answer))?.answer}</div>
        </div>
        <div className='flex gap-2'>
        <button onClick={() => handleEdit(value.idx)}><ci_1.CiEdit className=' hover:scale-110' size={22}/></button>
        <button onClick={() => onDelete(value.idx)}><ci_1.CiTrash className=' hover:scale-110' size={22}/></button>
        </div>
      </div>
    </div>);
});
const SortableList = (0, react_sortable_hoc_1.SortableContainer)(({ items, onEdit, onDelete }) => {
    return (<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      {items.map((value, index) => (<SortableItem key={`item-${index}`} index={index} value={{ ...value, no: index + 1, idx: index }} handleEdit={onEdit} onDelete={onDelete}/>))}
    </div>);
});
const ReorderableList = ({ onEdit, onDelete, items: initialItems, callBack }) => {
    const [items, setItems] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (initialItems?.length > 0) {
            setItems([...initialItems]);
        }
        else {
            setItems([]);
        }
    }, [initialItems]);
    const onSortEnd = ({ oldIndex, newIndex }) => {
        const newArrayMove = (0, array_move_1.arrayMoveImmutable)(items, oldIndex, newIndex);
        setItems(newArrayMove);
        callBack(newArrayMove);
    };
    const defaultProps = {
        items,
        onSortEnd,
        onEdit,
        onDelete,
    };
    return <SortableList {...defaultProps} useDragHandle/>;
};
exports.default = ReorderableList;
