"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Paper_1 = __importDefault(require("@mui/material/Paper"));
const InputBase_1 = __importDefault(require("@mui/material/InputBase"));
const IconButton_1 = __importDefault(require("@mui/material/IconButton"));
const Search_1 = __importDefault(require("@mui/icons-material/Search"));
const SearchInput = ({ value, onChange }) => {
    return (<Paper_1.default component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}>
            <InputBase_1.default value={value} onChange={onChange} sx={{ ml: 1, flex: 1 }} placeholder="Search name or email" inputProps={{ 'aria-label': 'Search name or email' }}/>
            <IconButton_1.default disabled type="button" sx={{ p: '10px' }} aria-label="search">
                <Search_1.default />
            </IconButton_1.default>
        </Paper_1.default>);
};
exports.default = SearchInput;
