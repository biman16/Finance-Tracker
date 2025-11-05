import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import InfoCard from '../../components/Cards/InfoCard'
import { IoMdCard } from 'react-icons/io'
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'
import { API_PATHS } from '../../utils/apiPaths'
import axiosInstance from '../../utils/axiosInstance'
  const Ai = () => {
      useUserAuth();

      const navigate = useNavigate();

      const [dashboardData, setDashboardData] = useState(null);
      const [loading, setLoading] = useState(false);
      const [messages, setMessages] = useState([]);
      const [inputMessage, setInputMessage] = useState('');
      const [chatLoading, setChatLoading] = useState(false);
      const [initialAiMessageSent, setInitialAiMessageSent] = useState(false);

      const defaultSuggestions = [
        'Smart budgeting',
        'Saving habits',
        'Expense control',
        'Income diversification',
        'Financial planning',
      ];

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

      const handleSendMessage = async (messageText = inputMessage) => {
        if (!messageText.trim() || chatLoading) return;

        const newMessage = { sender: 'user', text: messageText };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputMessage('');
        setChatLoading(true);

        try {
          const response = await axiosInstance.post(API_PATHS.AI.GENERATE_RESPONSE, {
            message: messageText,
            dashboardData: dashboardData, // Pass dashboardData to the backend
          });

          if (response.data && response.data.reply) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { sender: 'ai', text: response.data.reply },
            ]);
          }
        } catch (error) {
          console.error('Error sending message to AI:', error);
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'ai', text: 'Sorry, I am unable to respond at the moment.' },
          ]);
        } finally {
          setChatLoading(false);
        }
      };

      useEffect(() => {
        fetchDashboardData();
        if (!initialAiMessageSent) {
          // Construct the initial AI message with clickable suggestions
          const initialMessage = {
            sender: 'ai',
            text: `Hello! I'm your financial advisor AI, here to help you understand and manage your finances. Here are some topics you can ask me about:`,
            suggestions: defaultSuggestions,
          };
          setMessages([initialMessage]);
          setInitialAiMessageSent(true);
        }
        return () => {};
      }, [initialAiMessageSent]);

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

          <div className='flex flex-col h-[calc(100vh-300px)] bg-white rounded-lg shadow-md p-4 mt-6'>
            <div className='flex-grow overflow-y-auto p-2 space-y-4'>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    } p-3 rounded-lg max-w-[70%] md:max-w-[50%]`}
                  style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {msg.text}
                    {msg.suggestions && (
                      <div className='mt-2'>
                        {msg.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            className='bg-blue-200 text-blue-800 p-2 m-1 rounded-lg hover:bg-blue-300'
                            onClick={() => handleSendMessage(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className='flex justify-start'>
                  <div className='bg-gray-200 text-gray-800 p-3 rounded-lg max-w-[70%] md:max-w-[50%]'>
                    Typing...
                  </div>
                </div>
              )}
            </div>
            <div className='flex items-center p-2 border-t border-gray-200'>
              <input
                type='text'
                placeholder='Type your message...'
                className='flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={chatLoading}
              />
              <button
                className='ml-3 px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
                onClick={() => handleSendMessage()}
                disabled={chatLoading}
              >
                Send
              </button>
            </div>
          </div>
          </div>
    </DashboardLayout>
  )
}

export default Ai