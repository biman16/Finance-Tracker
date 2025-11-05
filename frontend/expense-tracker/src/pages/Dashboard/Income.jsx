import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import IncomeOverview from '../../components/Income/IncomeOverview'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Model from '../../components/Model';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import { DeleteAlert } from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';

const Income = () => {
  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddIncomeModel, setopenAddIncomeModel] = useState(false);




//Get all Income Details
const fetchIncomeDetails = async () => {
  if(loading) return;

  setLoading(true);

  try {
    const respose = await axiosInstance.get(
      `${API_PATHS.INCOME.GET_ALL_INCOME}`
    );
    if(respose.data) {
      setIncomeData(respose.data);
    }
  } catch (error) {
    console.log("Something went wrong. Please try again letter", error);
  } finally {
    setLoading(false);
  }
};


//Handle Add Income
const handleAddIncome = async (income) => {
  const { source, amount, date, icon } = income;

  //validation check
  if(!source.trim()) {
    toast.error("Source is required.");
    return;
  }

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    toast.error("Amount should be a valid Number greater than 0.")
    return;
  }

  if(!date){
    toast.error("Date is Required.");
    return;
  }

  try {
    await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
      source,
      amount,
      date,
      icon,
    });

    setopenAddIncomeModel(false);
    toast.success("Income added successfully");
    fetchIncomeDetails();
  } catch (error) {
    console.error(
      "Error adding income: ",
      error.respose?.data?.message || error.message
    );
  }
};


//Delete Income
const deleteIncome = async (id) => {
  try {
    await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id))

    setOpenDeleteAlert({ show:false, data: null });
    toast.success("Income details deleted successfully.");
    fetchIncomeDetails();
  } catch (error) {
    console.error(
      "Error deleting income:",
      error.respose?.data?.message || error.message
    )
  }
};


//handle download income details as PDF
const handleDownloadIncomeDetails = async () => {
  try {
    toast.loading('Generating PDF...');
    const response = await axiosInstance.get(
      API_PATHS.INCOME.DOWNLOAD_INCOME_PDF,
      {
        responseType: "blob",
      }
    );

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "income_details.pdf");
    
    // Click the link programmatically
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.dismiss();
    toast.success('PDF downloaded successfully!');
  } catch (error) {
    console.error("Error downloading income details:", error);
    toast.dismiss();
    toast.error("Failed to download income details. Please try again later.");
  }
};





useEffect(() => {
  fetchIncomeDetails();

  return () => {};
}, []);



  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={()=>setopenAddIncomeModel(true)}
              />
          </div>

            <IncomeList
              transactions={incomeData}
              onDelete={(id) => {
                setOpenDeleteAlert({ show: true, data: id });
              }}
              onDownload={handleDownloadIncomeDetails}
            />


        </div>

        <Model
          isOpen = {openAddIncomeModel}
          onClose = { () => setopenAddIncomeModel(false)}
          title="Add Income"
        >


          <div><AddIncomeForm onAddIncome={handleAddIncome} /></div>
          </Model>


          <Model
            isOpen={openDeleteAlert.show}
            onClose={()=> setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Income"
          >
            <DeleteAlert
              content="Are you sure you want to delete this income source??"
              onDelete={()=> deleteIncome(openDeleteAlert.data)}
            />
          </Model>


        </div>
      </DashboardLayout>
    )
}

export default Income