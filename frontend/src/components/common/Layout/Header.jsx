import React from 'react'
import { BellIcon, UserIcon } from '@heroicons/react/24/outline'

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-30 h-16">
      <div className="flex items-center justify-between px-6 h-full">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Instagram Analytics</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <BellIcon className="w-6 h-6" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <UserIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
