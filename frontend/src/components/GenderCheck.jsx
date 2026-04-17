import React from 'react'
import { User2 } from 'lucide-react';

const GenderCheck = ({ onCheckboxChange, selectedGender }) => {
  return (
    <div className='flex gap-4'>
      <label className='flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 transition'>
        <input
          type="radio"
          name="gender"
          className='w-4 h-4 text-blue-500 cursor-pointer'
          checked={selectedGender === "male"}
          onChange={() => onCheckboxChange("male")}
        />
        <span className='text-slate-200 font-medium'>Male</span>
      </label>
      <label className='flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 transition'>
        <input
          type="radio"
          name="gender"
          className='w-4 h-4 text-pink-500 cursor-pointer'
          checked={selectedGender === "female"}
          onChange={() => onCheckboxChange("female")}
        />
        <span className='text-slate-200 font-medium'>Female</span>
      </label>
    </div>
  )
}

export default GenderCheck
