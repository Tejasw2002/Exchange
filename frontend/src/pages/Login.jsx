import React from 'react'
import Formfield from '../components/Formfield'
import useLogin from '../hooks/useLogin'
import Flash from '../components/Flash'

const Signup = () => {
  const {error, handleSubmit, displayFlash} = useLogin()
  return (
    <>
        {displayFlash && <Flash message="Successfully logged in" classname="success" id="login  Flash"/>}
        <form className="login" onSubmit={(event)=>handleSubmit(event)}>
            <div className='form-head'>
                  <h1>User Login</h1>
            </div>
            <div className="error">{error.general}</div>
            <Formfield name="email" label="Email"  error={error.email} options={undefined} type="email"/>
            <Formfield name="password" label="Password"  error={error.password} options={undefined} type="password"/>
            <Formfield name="login" label="Login" error={undefined} options={undefined} type="button"/>
        </form>
    </>
  )
}

export default Signup