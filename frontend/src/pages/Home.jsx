import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  console.log('Home component is rendering') // Debug log

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Navigation */}
      <nav style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        padding: '16px 0',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              marginRight: '12px'
            }}>
              IG
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
              Instagram Analytics
            </h1>
          </div>
          <div>
            <Link 
              to="/dashboard"
              style={{
                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        padding: '100px 20px',
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '4rem', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Instagram Analytics
            <br />
            <span style={{ 
              background: 'linear-gradient(45deg, #f09433, #dc2743)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Dashboard
            </span>
          </h1>
          
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: '40px',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Advanced AI-powered Instagram analytics platform with real-time insights, 
            influencer tracking, and comprehensive performance metrics.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/dashboard"
              style={{
                background: 'linear-gradient(45deg, #f09433 0%, #dc2743 100%)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block',
                boxShadow: '0 8px 25px rgba(240, 148, 51, 0.3)',
                transition: 'transform 0.2s ease'
              }}
            >
              🚀 Launch Dashboard
            </Link>
            
            <button style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}>
              📹 Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '40px', 
        padding: '80px 20px',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
        color: 'white'
      }}>
        <div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '8px' }}>5M+</div>
          <div style={{ opacity: 0.8 }}>Posts Analyzed</div>
        </div>
        <div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '8px' }}>10K+</div>
          <div style={{ opacity: 0.8 }}>Influencers Tracked</div>
        </div>
        <div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '8px' }}>99.9%</div>
          <div style={{ opacity: 0.8 }}>Uptime</div>
        </div>
        <div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '8px' }}>24/7</div>
          <div style={{ opacity: 0.8 }}>AI Processing</div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
            Ready to Transform Your Instagram Strategy?
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '40px', opacity: 0.9 }}>
            Join thousands of marketers using our platform to drive better results
          </p>
          <Link
            to="/dashboard"
            style={{
              background: 'white',
              color: '#dc2743',
              border: 'none',
              padding: '16px 40px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
            }}
          >
            🚀 Start Analyzing Now - It's Free!
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: '#1e293b',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              background: 'linear-gradient(45deg, #f09433 0%, #dc2743 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              marginRight: '12px'
            }}>
              IG
            </div>
            <span style={{ fontSize: '18px', fontWeight: '600' }}>Instagram Analytics</span>
          </div>
          <p style={{ opacity: 0.7, marginBottom: '20px' }}>
            Advanced AI-powered Instagram analytics and insights platform
          </p>
          <div style={{ marginTop: '20px', opacity: 0.6, fontSize: '14px' }}>
            © 2025 Instagram Analytics. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
