import React, { useContext, useState } from 'react'
import AuthLayoute from '../../components/layouts/AuthLayoute'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import uploadImage from '../../utils/uploadImage';
import CurrencySelector from '../../components/Inputs/CurrencySelector';
import { currencies } from '../../utils/currencies';

const SignUp = () => {

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  //Sign Up Form
  const handelSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError ("Please enter your name");
      return;
    }

    if(!validateEmail(email)) {
      setError("Please enter valid email address.");
      return;
    }

    if(!password){
      setError("Please enter the password");
      return;
    }

    setError("");

    //SignUp API Call
    try {

      //Upload image if present
      if(profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
        currency: {
          code: selectedCurrency.code,
          symbol: selectedCurrency.symbol
        },
      });

      const { token, user } = response.data;

      if(token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if(error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError("Something went wrong. Please try again latter.")
      }
    }

  }

  return (
    <AuthLayoute>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold'>Create an account</h3>
        <p className='text-slate-700 mt-[5px] mb-6'>Create your account to start managing your expenses.</p>
      

      <form onSubmit={handelSignUp}>

      <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 '>
          <Input 
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          lable="Full Name"
          placeholder="Raj"
          type="text"
          />

                  <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          lable="Email Address"
          placeholder="akash@gmail.com"
          type="text"
          />

          <div className='col-span-2'>
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              lable="Enter Password"
              placeholder="minimum 8 character"
              type="password"
            />
          </div>
          
          <div className='col-span-2'>
            <CurrencySelector
              selectedCurrency={selectedCurrency.code}
              onChange={(currency) => setSelectedCurrency(currency)}
            />
          </div>
        </div>


        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
        
          <button type='submit' className='btn-primary'>
            SIGN UP
          </button>
          <p className='text-[17px] text-slate-800mt-3'>
            Already have an account?{" "}
              <Link className='font-medium text-primary   underline' to="/login">Login here
              </Link>
          </p>
      </form>
      </div>
    </AuthLayoute>
  )
}

export default SignUp