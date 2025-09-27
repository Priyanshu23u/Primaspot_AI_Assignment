import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  ChartBarIcon,
  UsersIcon,
  PhotoIcon,
  PlayIcon,
  ChartPieIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon },
  { name: 'Influencers', href: '/app/influencers', icon: UsersIcon },
  { name: 'Posts', href: '/app/posts', icon: PhotoIcon },
  { name: 'Reels', href: '/app/reels', icon: PlayIcon },
  { name: 'Analytics', href: '/app/analytics', icon: ChartBarIcon },
  { name: 'Demographics', href: '/app/demographics', icon: UserGroupIcon },
  { name: 'Settings', href: '/app/settings', icon: Cog6ToothIcon },
]

const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
      <div className="flex flex-col h-full">
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-primary-500' : 'text-gray-400'
                    }`}
                  />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-4 text-white">
            <h4 className="text-sm font-semibold mb-1">Upgrade to Pro</h4>
            <p className="text-xs opacity-90 mb-2">
              Get advanced analytics and insights
            </p>
            <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-xs font-medium py-2 px-3 rounded transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
