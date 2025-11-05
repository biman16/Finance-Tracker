import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext';
import { formatAmount } from '../../utils/formatCurrency';

const InfoCard = ({ icon, label, value, color }) => {
  const { user } = useContext(UserContext);
  return (
    <div className={`flex gap-6 bg-white p-6 rounded-2xl shadow-md border border-gray-200/50
                    transform transition-transform duration-300 hover:scale-105 hover:shadow-xl`}>
        <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
            {icon}
        </div>
        <div>
            <h6 className='text-lg font-bold text-gray-500 mb-1'>{label}</h6>
            <span className='text-[22px] '>{formatAmount(value, user?.currency)}</span>
        </div>
    </div>
    
  )
}

export default InfoCard