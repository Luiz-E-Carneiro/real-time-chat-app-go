'use client'

import React, { useContext } from 'react'
import { API_URL } from '@/constants'
import { AuthContext } from '@/modules/auth_provider'

const LogoutButton = () => {
    const { logout } = useContext(AuthContext)
    
    const logoutHandler = async () => {
        try {
            const res = await fetch(`${API_URL}/users/logout`, {
                method: 'GET', 
                credentials: 'include',
            })

            logout() 
            
        } catch (err) {
            console.error('Erro ao fazer logout:', err)
            logout() 
        }
    }

    return (
        <button
            onClick={logoutHandler}
            className='absolute right-3 top-3 py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-150'
            aria-label="Sair da conta"
        >
            Logout
        </button>
    )
}

export default LogoutButton