import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { LuBrain } from "react-icons/lu"; 
import SideMenu from './SideMenu';

const Navbar = ({activeMenu}) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const navigate = useNavigate();
  return (
    <div className='flex items-center justify-between gap-5 bg-gradient-to-r from-[#E8E1F8] to-[#FDF2FA]
 shadow-md border-b border-gray-200 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30'>
        <div className='flex items-center gap-5'>
            <button
                className='block lg:hidden text-black'
                onClick={() => {
                    setOpenSideMenu(!openSideMenu);
                }}
            >
                {openSideMenu ? (
                    <HiOutlineX className='text-2xl' />
                ) : (
                    <HiOutlineMenu className='text-2xl' />
                )}
            </button>
            <div>
                <h2 className='text-3xl font-medium text-black'>Expenzo</h2>
                <h6 className='text-xs font-medium text-slate-500'>Maximize Your Money</h6>
            </div>
        </div>
        <button
            className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer'
            onClick={()=>navigate('/ai')}
            >
            <LuBrain className='text-xl' />
            Manage with AI
        </button>

        {openSideMenu && (
            <div className='fixed top-[61px] -ml-4 bg-white'>
                <SideMenu activeMenu={activeMenu} />
            </div>
        )}
    </div>
  )
}

export default Navbar