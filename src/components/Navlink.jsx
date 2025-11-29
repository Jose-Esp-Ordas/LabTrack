import React from 'react'
import { NavLink } from 'react-router-dom'

export const Navlink = ({where, text}) => {
  return (
    <div className='hover:bg-indigo-700 px-4 py-2 rounded w-full text-center'>
        <NavLink to={where} className={({ isActive }) => `text-white  text-lg whitespace-pre-line py-1  ${isActive ? 'font-bold' : 'font-normal'}`}>
            {text}
        </NavLink>
    </div>
  )
}
