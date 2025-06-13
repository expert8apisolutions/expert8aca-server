"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_pro_sidebar_1 = require("react-pro-sidebar");
const material_1 = require("@mui/material");
require("react-pro-sidebar/dist/css/styles.css");
const Icon_1 = require("./Icon");
const avatar_png_1 = __importDefault(require("../../../../public/assests/avatar.png"));
const react_redux_1 = require("react-redux");
const link_1 = __importDefault(require("next/link"));
const image_1 = __importDefault(require("next/image"));
const next_themes_1 = require("next-themes");
const ArtTrack_1 = __importDefault(require("@mui/icons-material/ArtTrack"));
const Article_1 = __importDefault(require("@mui/icons-material/Article"));
const ri_1 = require("react-icons/ri");
const ri_2 = require("react-icons/ri");
const tb_1 = require("react-icons/tb");
const gi_1 = require("react-icons/gi");
const Item = ({ title, to, icon, selected, setSelected }) => {
    return (<react_pro_sidebar_1.MenuItem active={selected === title} onClick={() => setSelected(title)} icon={icon}>
      <material_1.Typography className="!text-[16px] !font-Poppins">{title}</material_1.Typography>
      <link_1.default href={to}/>
    </react_pro_sidebar_1.MenuItem>);
};
const Sidebar = () => {
    const { user } = (0, react_redux_1.useSelector)((state) => state.auth);
    const [logout, setlogout] = (0, react_1.useState)(false);
    const [isCollapsed, setIsCollapsed] = (0, react_1.useState)(false);
    const [selected, setSelected] = (0, react_1.useState)("Dashboard");
    const [mounted, setMounted] = (0, react_1.useState)(false);
    const { theme, setTheme } = (0, next_themes_1.useTheme)();
    (0, react_1.useEffect)(() => setMounted(true), []);
    if (!mounted) {
        return null;
    }
    const logoutHandler = () => {
        setlogout(true);
    };
    return (<material_1.Box sx={{
            "& .pro-sidebar-inner": {
                background: `${theme === "dark" ? "#111C43 !important" : "#fff !important"}`,
            },
            "& .pro-icon-wrapper": {
                backgroundColor: "transparent !important",
            },
            "& .pro-inner-item:hover": {
                color: "#868dfb !important",
            },
            "& .pro-menu-item.active": {
                color: "#6870fa !important",
            },
            "& .pro-inner-item": {
                padding: "5px 35px 5px 20px !important",
                opacity: 1,
            },
            "& .pro-menu-item": {
                color: `${theme !== "dark" && "#000"}`,
            },
        }} className="!bg-white dark:bg-[#111C43] z-99">
      <react_pro_sidebar_1.ProSidebar collapsed={isCollapsed} style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 99999999999999,
            width: isCollapsed ? "0%" : "16%",
        }}>
        <react_pro_sidebar_1.Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <react_pro_sidebar_1.MenuItem onClick={() => setIsCollapsed(!isCollapsed)} icon={isCollapsed ? <Icon_1.ArrowForwardIosIcon /> : undefined} style={{
            margin: "10px 0 20px 0",
        }}>
            {!isCollapsed && (<material_1.Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                <link_1.default href="/" className="block">
                  <h3 className="text-[25px] font-Poppins uppercase dark:text-white text-black">
                    ELearning
                  </h3>
                </link_1.default>
                <material_1.IconButton onClick={() => setIsCollapsed(!isCollapsed)} className="inline-block">
                  <Icon_1.ArrowBackIosIcon className="text-black dark:text-[#ffffffc1]"/>
                </material_1.IconButton>
              </material_1.Box>)}
          </react_pro_sidebar_1.MenuItem>

          {!isCollapsed && (<material_1.Box mb="25px">
              <material_1.Box display="flex" justifyContent="center" alignItems="center">
                <image_1.default alt="profile-user" width={100} height={100} src={user.avatar ? user.avatar.url : avatar_png_1.default} style={{
                cursor: "pointer",
                borderRadius: "50%",
                border: "3px solid #5b6fe6",
            }}/>
              </material_1.Box>
              <material_1.Box textAlign="center">
                <material_1.Typography variant="h4" className="!text-[20px] text-black dark:text-[#ffffffc1]" sx={{ m: "10px 0 0 0" }}>
                  {user?.name}
                </material_1.Typography>
                <material_1.Typography variant="h6" sx={{ m: "10px 0 0 0" }} className="!text-[20px] text-black dark:text-[#ffffffc1] capitalize">
                  - {user?.role}
                </material_1.Typography>
              </material_1.Box>
            </material_1.Box>)}

          <material_1.Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item title="Dashboard" to="/admin" icon={<Icon_1.HomeOutlinedIcon />} selected={selected} setSelected={setSelected}/>

            <material_1.Typography variant="h5" sx={{ m: "15px 0 5px 25px" }} className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]">
              {!isCollapsed && "Data"}
            </material_1.Typography>
            <Item title="Users manage" to="/admin/users" icon={<Icon_1.GroupsIcon />} selected={selected} setSelected={setSelected}/>
            <Item title="Users progress" to="/admin/users-progress" icon={<gi_1.GiProgression size={20}/>} selected={selected} setSelected={setSelected}/>

            <Item title="Invoices" to="/admin/invoices" icon={<Icon_1.ReceiptOutlinedIcon />} selected={selected} setSelected={setSelected}/>

            <material_1.Typography variant="h5" className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]" sx={{ m: "15px 0 5px 20px" }}>
              {!isCollapsed && "Content"}
            </material_1.Typography>
            <Item title="Create Course" to="/admin/create-course" icon={<Icon_1.VideoCallIcon />} selected={selected} setSelected={setSelected}/>
            <Item title="Live Courses" to="/admin/courses" icon={<Icon_1.OndemandVideoIcon />} selected={selected} setSelected={setSelected}/>
            <Item title="Create Ebook" to="/admin/create-ebook" icon={<Icon_1.DifferenceIcon />} selected={selected} setSelected={setSelected}/>

            <Item title="Live Ebook" to="/admin/ebook" icon={<Icon_1.InsertDriveFileIcon />} selected={selected} setSelected={setSelected}/>
            <Item title="Create Blog" to="/admin/create-blog" icon={<ArtTrack_1.default />} selected={selected} setSelected={setSelected}/>
            <Item title="Live Blog" to="/admin/blogs" icon={<Article_1.default />} selected={selected} setSelected={setSelected}/>
            <Item title="Upload Video" to="/admin/upload" icon={<ri_1.RiVideoUploadLine size={25}/>} selected={selected} setSelected={setSelected}/>
            <Item title="Create Quiz" to="/admin/create-quiz" icon={<ri_2.RiBookOpenLine size={25}/>} selected={selected} setSelected={setSelected}/>
            <Item title="Report Quiz" to="/admin/result-quiz" icon={<tb_1.TbReportAnalytics size={25}/>} selected={selected} setSelected={setSelected}/>

            <material_1.Typography variant="h5" className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]" sx={{ m: "15px 0 5px 20px" }}>
              {!isCollapsed && "Customization"}
            </material_1.Typography>
            <Item title="Hero" to="/admin/hero" icon={<Icon_1.WebIcon />} selected={selected} setSelected={setSelected}/>
            <Item title="FAQ" to="/admin/faq" icon={<Icon_1.QuizIcon />} selected={selected} setSelected={setSelected}/>
            <Item title="Categories" to="/admin/categories" icon={<Icon_1.WysiwygIcon />} selected={selected} setSelected={setSelected}/>

            <material_1.Typography variant="h5" className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]" sx={{ m: "15px 0 5px 20px" }}>
              {!isCollapsed && "Controllers"}
            </material_1.Typography>
            <Item title="Manage Team" to="/admin/team" icon={<Icon_1.PeopleOutlinedIcon />} selected={selected} setSelected={setSelected}/>

            <material_1.Typography variant="h6" className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]" sx={{ m: "15px 0 5px 20px" }}>
              {!isCollapsed && "Analytics"}
            </material_1.Typography>
            <Item title="Courses Analytics" to="/admin/courses-analytics" icon={<Icon_1.BarChartOutlinedIcon />} selected={selected} setSelected={setSelected}/>
            <Item title="Orders Analytics" to="/admin/orders-analytics" icon={<Icon_1.MapOutlinedIcon />} selected={selected} setSelected={setSelected}/>

            <Item title="Users Analytics" to="/admin/users-analytics" icon={<Icon_1.ManageHistoryIcon />} selected={selected} setSelected={setSelected}/>

            <material_1.Typography variant="h6" className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]" sx={{ m: "15px 0 5px 20px" }}>
              {!isCollapsed && "Extras"}
            </material_1.Typography>
            <div onClick={logoutHandler}>
              <Item title="Logout" to="/" icon={<Icon_1.ExitToAppIcon />} selected={selected} setSelected={setSelected}/>
            </div>
          </material_1.Box>
        </react_pro_sidebar_1.Menu>
      </react_pro_sidebar_1.ProSidebar>
    </material_1.Box>);
};
exports.default = Sidebar;
