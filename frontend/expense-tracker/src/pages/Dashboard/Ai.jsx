import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import InfoCard from '../../components/Cards/InfoCard'
import { IoMdCard } from 'react-icons/io'
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'
import { API_PATHS } from '../../utils/apiPaths'
import axiosInstance from '../../utils/axiosInstance'
import AiLayout from '../../components/layouts/AiLayout'



  const Ai = () => {
      useUserAuth();

      const navigate = useNavigate();

      const [dashboardData, setDashboardData] = useState(null);
      const [loading, setLoading] = useState(false);

      const fetchDashboardData = async () => {
        if (loading) return;

        setLoading(true);

        try {
          const response = await axiosInstance.get(
            `${API_PATHS.DASHBOARD.GET_DASHBOARD_DATA}`
          );

          if (response.data) {
            setDashboardData(response.data);
          }
        } catch (error) {
          console.log("Something went wrong . Please try again letter.", error);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchDashboardData();
        return () => {};
      }, []);

  return (
    <DashboardLayout activeMenu="Manage with Ai">
          <div className='my-5 mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={dashboardData?.totalBalance || 0}
            color="bg-blue-500"
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={dashboardData?.totalIncome || 0}
            color="bg-orange-500"
          />

          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={dashboardData?.totalExpense || 0}
            color="bg-red-500"
          />
          </div>

          <AiLayout />
          
          </div>
    </DashboardLayout>
  )
}

export default Ai