import React, { useState } from 'react'
import AuthLayoute from '../../components/layouts/AuthLayoute'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate ();

  const handleLogin = async(e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter valid email address.");
      return;
    }

    if(!password){
      setError("Enter correct password.");
      return;
    }

    setError("");

    //Login API call
  }


  return (
    <AuthLayoute>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h1 className="text-2xl font-semibold text-black">Wellcome Back</h1>
        <p className="text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          lable="Email Address"
          placeholder="akash@gmail.com"
          type="text"
          />

          <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          lable="Enter Password"
          placeholder="minimum 8 character"
          type="password"
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>LOGIN</button>
          <p className='text-[17px] text-slate-800mt-3'>Don't have account?{" "}
            <Link className='font-medium text-primary underline' to="/signup">Sign Up</Link>
          </p>
      </form>

      </div>
    </AuthLayoute>
  )
}

export default Login