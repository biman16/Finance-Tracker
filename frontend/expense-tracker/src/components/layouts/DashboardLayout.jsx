import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/UserContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

export const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

    const toggleSideMenu = () => {
        setIsSideMenuOpen(!isSideMenuOpen);
    };

  return (
    <div className='min-h-screen max-h-screen overflow-hidden'>
        <Navbar activeMenu={activeMenu} toggleSideMenu={toggleSideMenu} isSideMenuOpen={isSideMenuOpen} />

        {user && (
            <div className='flex h-[calc(100vh-64px)]'> 
                <div className={`fixed inset-y-0 left-0 transform ${isSideMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out z-30`}>
                    <SideMenu activeMenu={activeMenu} />
                </div>


                <div className='grow mx-5 overflow-y-auto'>{children}</div>
            </div>
        )}
    </div>
  )
}

export default DashboardLayout;
