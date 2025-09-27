import React from 'react'
import Card from '../components/common/UI/Card'

const Profile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Profile Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Profile management functionality will be implemented here.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Profile
