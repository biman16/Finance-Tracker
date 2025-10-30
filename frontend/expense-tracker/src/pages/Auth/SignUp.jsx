import React, { useState } from 'react'
import AuthLayoute from '../../components/layouts/AuthLayoute'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';

const SignUp = () => {

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  //Sign Up Form
  const handelSignUp = async (e) => {

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
        </div>
      </form>
      </div>
    </AuthLayoute>
  )
}

export default SignUp