import React from 'react'
import Formfield from '../components/Formfield'
import useSignup from '../hooks/useSignup'
import Flash from '../components/Flash'

const Signup = () => {
  const {error, handleSubmit, displayFlash} = useSignup()
  return (
    <>
        {displayFlash && <Flash message="Successfully created this account" classname="success" id="signupFlash"/>}
        <form className="signup" onSubmit={(event)=>handleSubmit(event)}>
            <div className='form-head'>
              <h1>Create Your Account</h1>
            </div>
            <div className="error">{error.general}</div>
            <Formfield name="name" label="Name" error={error.name}  options={undefined} type="text"/>
            <Formfield name="sex" label="Sex" error={error.sex}  options={["Male", "Female", "Other"]} type="select"/>
            <Formfield name="age" label="Age"  error={error.age} options={undefined} type="number"/>
            <Formfield name="password" label="Password"  error={error.password} options={undefined} type="password"/>
            <Formfield name="email" label="Email"  error={error.email} options={undefined} type="email"/>
            <Formfield name="signup" label="Signup" error={undefined} options={undefined} type="button"/>
        </form>
    </>
  )
}

export default Signup