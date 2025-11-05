import React from 'react'

const AiLayout = () => {
  return (
    <div className='flex flex-col h-full bg-white rounded-lg shadow-md p-4 mt-6'>
            <div className='flex-grow overflow-y-auto p-2 space-y-4'>
              {/* Sample chat messages */}
              <div className='flex justify-end'>
                <div className='bg-blue-500 text-white p-3 rounded-lg max-w-[70%] md:max-w-[50%]'>
                  Hello AI, how can you help me today?
                </div>
              </div>
              <div className='flex justify-start'>
                <div className='bg-gray-200 text-gray-800 p-3 rounded-lg max-w-[70%] md:max-w-[50%]'>
                  I can help you manage your expenses, track your income, and provide financial insights.
                </div>
              </div>
              <div className='flex justify-end'>
                <div className='bg-blue-500 text-white p-3 rounded-lg max-w-[70%] md:max-w-[50%]'>
                  That sounds great! Can you summarize my spending for last month?
                </div>
              </div>
              <div className='flex justify-start'>
                <div className='bg-gray-200 text-gray-800 p-3 rounded-lg max-w-[70%] md:max-w-[50%]'>
                  Certainly! Last month, your total expenses were $1200, with the largest categories being groceries ($400) and utilities ($250).
                </div>
              </div>
            </div>
            <div className='flex items-center p-2 border-t border-gray-200'>
              <input
                type='text'
                placeholder='Type your message...'
                className='flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
              />
              <button className='ml-3 px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500'>
                Send
              </button>
            </div>
          </div>
  )
}

export default AiLayout