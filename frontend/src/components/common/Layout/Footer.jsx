import React from 'react'

const Footer = () => {
  return (
    <footer className="ml-64 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-6 px-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 Instagram Analytics Dashboard. Built with ❤️ using React & Django.
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Version 1.0.0</span>
            <span>•</span>
            <a href="#" className="hover:text-primary-600">Support</a>
            <span>•</span>
            <a href="#" className="hover:text-primary-600">Documentation</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
