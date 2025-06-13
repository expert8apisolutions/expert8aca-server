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
const link_1 = __importDefault(require("next/link"));
const react_1 = __importStar(require("react"));
const NavItems_1 = __importDefault(require("../utils/NavItems"));
const hi_1 = require("react-icons/hi");
const CustomModal_1 = __importDefault(require("../utils/CustomModal"));
const Login_1 = __importDefault(require("../components/Auth/Login"));
const SignUp_1 = __importDefault(require("../components/Auth/SignUp"));
const Verification_1 = __importDefault(require("../components/Auth/Verification"));
const image_1 = __importDefault(require("next/image"));
const avatar_png_1 = __importDefault(require("../../public/assests/avatar.png"));
const react_2 = require("next-auth/react");
const authApi_1 = require("@/redux/features/auth/authApi");
const react_hot_toast_1 = require("react-hot-toast");
const apiSlice_1 = require("@/redux/features/api/apiSlice");
const flowbite_react_1 = require("flowbite-react");
const fa_1 = require("react-icons/fa");
const ri_1 = require("react-icons/ri");
const si_1 = require("react-icons/si");
const ai_1 = require("react-icons/ai");
const md_1 = require("react-icons/md");
const navigation_1 = require("next/navigation");
const subMenuUserItem = [
    {
        title: "Profile",
        icon: <fa_1.FaUser />,
        link: "/profile?tab=account",
    },
    {
        title: "Change Password",
        icon: <ri_1.RiLockPasswordLine />,
        link: "/profile?tab=password",
    },
    {
        title: "My Courses",
        icon: <si_1.SiCoursera />,
        link: "/profile?tab=course",
    },
    {
        title: "My Ebooks",
        icon: <ai_1.AiOutlineFilePpt />,
        link: "/profile?tab=ebook",
    },
    {
        title: "Admin Dashbord",
        icon: <md_1.MdOutlineAdminPanelSettings />,
        link: "/admin",
    },
];
const Header = ({ activeItem, setOpen, route, open, setRoute }) => {
    const router = (0, navigation_1.useRouter)();
    const [active, setActive] = (0, react_1.useState)(false);
    const [openSidebar, setOpenSidebar] = (0, react_1.useState)(false);
    const { data: userData, isLoading, refetch } = (0, apiSlice_1.useLoadUserQuery)(undefined, {});
    const { data } = (0, react_2.useSession)();
    const [socialAuth, { isSuccess, error }] = (0, authApi_1.useSocialAuthMutation)();
    const [logout, setLogout] = (0, react_1.useState)(false);
    const {} = (0, authApi_1.useLogOutQuery)(undefined, {
        skip: !logout ? true : false,
    });
    (0, react_1.useEffect)(() => {
        if (!isLoading) {
            if (!userData) {
                if (data) {
                    socialAuth({
                        email: data?.user?.email,
                        name: data?.user?.name,
                        avatar: data.user?.image,
                    });
                    setTimeout(() => {
                        refetch?.();
                    }, 2000);
                }
            }
            if (data === null) {
                if (isSuccess) {
                    react_hot_toast_1.toast.success("Login Successfully");
                }
            }
            if (data === null && !isLoading && !userData) {
                setLogout(true);
            }
        }
    }, [data, userData, isLoading]);
    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 85) {
                setActive(true);
            }
            else {
                setActive(false);
            }
        });
    }
    const handleClose = (e) => {
        if (e.target.id === "screen") {
            {
                setOpenSidebar(false);
            }
        }
    };
    const logOutHandler = async () => {
        setLogout(true);
        await (0, react_2.signOut)();
    };
    const isAdmin = userData?.user?.role === "admin";
    const filterSubMenu = subMenuUserItem.filter((item) => {
        if (isAdmin) {
            return item;
        }
        else {
            return item.title !== "Admin Dashbord";
        }
    });
    return (<>
      {/* {
          isLoading ? (
            <Loader />
          ) : ( */}
          <div className="w-full bg-white relative dark:bg-[#140342]">
            <div className={`${active
            ? "dark:bg-opacity-50 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#b232321c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"}`}>
              <div className="w-[95%] 800px:w-[92%] m-auto h-full">
                <div className="w-full h-[80px] flex items-center justify-between p-3 pl-0 md:pl-3">
                  <div>
                    <link_1.default href={"/"} className={`text-[18px] md:text-[25px] flex items-center font-Poppins font-[500] text-black dark:text-white`}>
                      <image_1.default src={'/logo1.png'} width={80} height={80} alt=""/>

                          <span className="ml-[15px] text-[#2e2e2e]">
                          
                      </span>
                      
                    </link_1.default>
                  </div>
                  <div className="flex items-center">
                    <NavItems_1.default activeItem={activeItem} isMobile={false}/>
                    {/* <ThemeSwitcher /> */}
                    {/* only for mobile */}
                    <div className="800px:hidden">
                      <hi_1.HiOutlineMenuAlt3 size={25} className="cursor-pointer dark:text-white text-black" onClick={() => setOpenSidebar(true)}/>
                    </div>
                  {userData ? (<>
                          <flowbite_react_1.Dropdown className="z-[999]" label={<image_1.default src={userData?.user.avatar ? userData.user.avatar.url : avatar_png_1.default} alt="" width={30} height={30} className="w-[30px] h-[30px] rounded-full cursor-pointer" style={{ border: activeItem === 5 ? "2px solid #37a39a" : "none", marginLeft: "15px" }}/>} inline>
                            {filterSubMenu.map((item, index) => (<flowbite_react_1.Dropdown.Item onClick={() => router.push(item.link)} key={item.title}>
                                  <div className="flex items-center space-x-2">
                                    <span> {item.icon}</span>
                                    <span>  {item.title}</span>
                                  </div>
                                </flowbite_react_1.Dropdown.Item>))}
                            <flowbite_react_1.Dropdown.Item onClick={logOutHandler}>
                              <ai_1.AiOutlineLogout size={15} className="dark:text-white text-black mr-2"/>
                              <span>Log Out</span>
                            </flowbite_react_1.Dropdown.Item>
                          </flowbite_react_1.Dropdown>
                        </>) : (<hi_1.HiOutlineUserCircle size={25} className="cursor-pointer dark:text-white text-black" onClick={() => setOpen(true)} style={{ marginLeft: "15px" }}/>)}
                  </div>
                </div>
              </div>

              {/* mobile sidebar */}
              {openSidebar && (<div className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]" onClick={handleClose} id="screen">
                  <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                    <NavItems_1.default activeItem={activeItem} isMobile={true}/>
                    {userData ? (<link_1.default href={"/profile"}>
                        <image_1.default src={userData?.user.avatar ? userData.user.avatar.url : avatar_png_1.default} alt="" width={30} height={30} className="w-[30px] h-[30px] rounded-full ml-[20px] cursor-pointer" style={{ border: activeItem === 5 ? "2px solid #37a39a" : "none" }}/>
                      </link_1.default>) : (<hi_1.HiOutlineUserCircle size={25} className="hidden 800px:block cursor-pointer dark:text-white text-black" onClick={() => setOpen(true)}/>)}
                    <br />
                    <br />
                    <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                      Copyright © 2023 LMS
                    </p>
                  </div>
                </div>)}
            </div>
            {route === "Login" && (<>
                {open && (<CustomModal_1.default open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} component={Login_1.default} refetch={refetch}/>)}
              </>)}

            {route === "Sign-Up" && (<>
                {open && (<CustomModal_1.default open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} component={SignUp_1.default}/>)}
              </>)}

            {route === "Verification" && (<>
                {open && (<CustomModal_1.default open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} component={Verification_1.default}/>)}
              </>)}
          </div>
        {/* )
      } */}
    </>);
};
exports.default = Header;
