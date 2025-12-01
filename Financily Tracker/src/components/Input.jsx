import React from 'react'
import './styles.css'

const Input = ({label,state,setState,placeholder,type,value}) => {
  return (
    <div className='inputs'>
      <p className='input-label' >{label}</p>
      <input
       value={state} 
       onChange={(e) => setState(e.target.value)} 
       placeholder={placeholder}
       type={type}
       className='input-text' 
       />
    </div>
  )
}

export default Input
