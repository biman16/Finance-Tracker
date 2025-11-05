import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext';
import { formatAmount } from '../../utils/formatCurrency';

export const CustomLegend = ({payload}) => {
  const { user } = useContext(UserContext);
  return (
    <div className='flex flex-wrap justify-center gap-2 mt-4 space-x-6'>
        {payload.map((entry, index) => (
            <div key={`legend-${index}`} className='flex items-center space-x-2'>
                <div
                    className='w-2.5 h-2.5 rounded-full'
                    style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className='text-gray-700 font-medium'>
                        {typeof entry.value === 'number' ? formatAmount(entry.value, user?.currency) : entry.value}
                    </span>
            </div>
        ))}
    </div>
  )
}


export default CustomLegend;
