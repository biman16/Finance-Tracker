import React, { useContext } from 'react'
import { SIDE_MENU_DATA } from "../../utils/data"
import { UserContext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom';
import CharAvatar from '../Cards/CharAvatar';
import { API_BASE_URL } from '../../utils/apiPaths';
import { LuBrain } from 'react-icons/lu';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handelLogout();
      return;
    }

    navigate (route);
  };

  const handelLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };


  // Normalize profile image URL so it always points to the current backend uploads path
  const getProfileImageSrc = () => {
    if (!user?.profileImageUrl) return "";

    try {
      // If the stored URL already contains '/uploads/', extract the filename
      const parts = user.profileImageUrl.split("/");
      const filename = parts[parts.length - 1];
      // Build URL from current API base (remove /api/v1)
      const base = API_BASE_URL.replace('/api/v1', '');
      return `${base}/uploads/${filename}`;
    } catch (err) {
      return user.profileImageUrl;
    }
  };

  return <div className='w-64 h-[calc(100vh-61px)] bg-gradient-to-b from-[#E8E1F8] to-[#FDF2FA]
 shadow-md border-r border-gray-200 p-5 sticky top-[61px] z-20'>
    <div className='flex flex-col items-center justify-center gap-3 mt-3 mb-7'>
      {user?.profileImageUrl ? (
        <img
        src={getProfileImageSrc() || ""}
        alt="Profile Image"
        className='w-20 h-20 bg-slate-400 rounded-full'
        /> ) : (<CharAvatar
        fullName={user?.fullName}
        width="w-20"
        height="h-20"
        style="text-xl"
        /> )}

        <h5 className='text-gray-950 font-medium leading-6 '>
          {user?.fullName || ""}
        </h5>
    </div>

    {SIDE_MENU_DATA.map((item, index) => (
      <button
      key={`menu_${index}`}
      className={`w-full flex items-center gap-4 text-[15px] ${activeMenu === item.label ? "text-white bg-blue-500" : ""} py-3 px-6 rounded-lg mb-3 cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out`}
      onClick={()=> handleClick(item.path)}
      >
        <item.icon className='text-xl' />
        {item.label}
      </button>
    ))}

    <button
        className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer'
        onClick={()=>navigate('/ai')}
        >
        <LuBrain className='text-xl' />
        Manage with AI
    </button>
    </div>
  
}

export default SideMenu