import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import Model from '../../components/Model';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';
import { DeleteAlert } from '../../components/DeleteAlert';

const Expense = () => {
  useUserAuth();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  
  const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false);

  //Get all Expense Details
const fetchExpenseDetails = async () => {
  if(loading) return;

  setLoading(true);

  try {
    const respose = await axiosInstance.get(
      `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
    );
    if(respose.data) {
      setExpenseData(respose.data);
    }
  } catch (error) {
    console.log("Something went wrong. Please try again letter", error);
  } finally {
    setLoading(false);
  }
};


//Handle Add Expense
const handleAddExpense = async (expense) => {
  const { category, amount, date, icon } = expense;

  //validation check
  if(!category.trim()) {
    toast.error("Category is required.");
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
    await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
      category,
      amount,
      date,
      icon,
    });

    setOpenAddExpenseModel(false);
    toast.success("Expense added successfully");
    fetchExpenseDetails();
  } catch (error) {
    console.error(
      "Error adding Expense: ",
      error.respose?.data?.message || error.message
    );
  }
};

//Delete Expense
const deleteExpense = async (id) => {
  try {
    await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))

    setOpenDeleteAlert({ show:false, data: null });
    toast.success("Expense details deleted successfully.");
    fetchExpenseDetails();
  } catch (error) {
    console.error(
      "Error deleting Expense:",
      error.respose?.data?.message || error.message
    )
  }
};


//handle download Expense details as PDF
const handleDownloadExpenseDetails = async () => {
  try {
    toast.loading('Generating PDF...');
    const response = await axiosInstance.get(
      API_PATHS.EXPENSE.DOWNLOAD_EXPENSE_PDF,
      {
        responseType: "blob",
      }
    );

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expense_details.pdf");
    
    // Click the link programmatically
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.dismiss();
    toast.success('PDF downloaded successfully!');
  } catch (error) {
    console.error("Error downloading expense details:", error);
    toast.dismiss();
    toast.error("Failed to download expense details. Please try again later.");
  }
};



useEffect(()=> {
  fetchExpenseDetails()

  return () => {}
}, []);




  return (
    <DashboardLayout activeMenu="Expense">
          <div className='my-5 mx-auto'>
            <div className='grid grid-cols-1 gap-6'>
              <ExpenseOverview
                transactions={expenseData}
                onExpenseIncome = {()=> setOpenAddExpenseModel(true)}
              />
            </div>

            <ExpenseList
              transactions={expenseData}
              onDelete={(id)=> {
                setOpenDeleteAlert({ show: true, data: id});
              }}
              onDownload={handleDownloadExpenseDetails}
            />
          </div>

          <Model
            isOpen={openAddExpenseModel}
            onClose={()=> setOpenAddExpenseModel(false)}
            title="Add Expense"
          >
            <AddExpenseForm onAddExpense={handleAddExpense} />
          </Model>

          <Model
            isOpen={openDeleteAlert.show}
            onClose={()=> setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Expense"
          >
            <DeleteAlert
              content="Are you sure you want to delete this Expense category??"
              onDelete={()=> deleteExpense(openDeleteAlert.data)}
            />
          </Model>
    </DashboardLayout>
  )
}

export default Expense