import React from 'react'
import { Link } from 'react-router-dom'
import { 
  ChartBarIcon, 
  UsersIcon, 
  PhotoIcon, 
  PlayIcon,
  ArrowRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import Button from '../components/common/UI/Button'

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card border border-gray-200 dark:border-gray-700">
    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      {description}
    </p>
  </div>
)

const Home = () => {
  const features = [
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Get deep insights into engagement patterns, growth trends, and performance metrics.'
    },
    {
      icon: UsersIcon,
      title: 'Influencer Management',
      description: 'Manage and analyze multiple influencer profiles with comprehensive data tracking.'
    },
    {
      icon: PhotoIcon,
      title: 'AI-Powered Post Analysis',
      description: 'Automatic keyword extraction, vibe classification, and quality scoring for posts.'
    },
    {
      icon: PlayIcon,
      title: 'Video Analytics',
      description: 'Analyze reels and video content with AI-driven event detection and insights.'
    }
  ]

  const benefits = [
    'Real-time engagement tracking',
    'AI-powered content analysis',
    'Comprehensive demographic insights',
    'Export and reporting capabilities',
    'Dark mode support',
    'Responsive design for all devices'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <nav className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IA</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Instagram Analytics
            </span>
          </div>
          <Link to="/app/dashboard">
            <Button variant="primary" size="lg">
              Get Started
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Advanced Instagram Analytics{' '}
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Harness the power of AI to analyze Instagram content, track engagement, 
              and gain deep insights into your influencer marketing campaigns.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link to="/app/dashboard">
                <Button variant="instagram" size="xl">
                  Launch Dashboard
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="xl">
                View Demo
              </Button>
            </div>
          </div>
          
          {/* Hero Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">5M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Posts Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Influencers Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">AI Processing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to analyze, understand, and optimize your Instagram presence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Our AI-powered analytics platform provides unprecedented insights into Instagram 
                performance, helping you make data-driven decisions for your social media strategy.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                      <CheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-8">
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement Rate</span>
                    <span className="text-green-600 text-sm">+12.5%</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">4.8%</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Content Quality</span>
                    <span className="text-green-600 text-sm">Excellent</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">9.2/10</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Analysis</span>
                    <span className="text-blue-600 text-sm">Real-time</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Instagram Strategy?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Join thousands of marketers using our platform to drive better results
          </p>
          <Link to="/app/dashboard">
            <Button variant="secondary" size="xl">
              Start Analyzing Now
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">IA</span>
            </div>
            <span className="text-lg font-semibold">Instagram Analytics</span>
          </div>
          <p className="text-gray-400 mb-4">
            Advanced AI-powered Instagram analytics and insights platform
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white">Support</a>
            <a href="#" className="text-gray-400 hover:text-white">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
