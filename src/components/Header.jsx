import React from 'react'
import style from './Header.module.css'
import { NavLink } from 'react-router-dom'

const Header = () => {
    return (
        <>
            <ul className={style.headerLists}>
                <li>
                    <NavLink to='/'>Home</NavLink>
                </li>
                <li>
                    <NavLink to='/login'>Login</NavLink>
                </li>
                <li>
                    <NavLink to='/view-stock'>View Stock</NavLink>
                </li>
            </ul>
        </>
    )
}

export default Header
