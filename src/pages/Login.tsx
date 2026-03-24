import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import './Login.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Simple authentication - in production, use proper backend auth
    const ADMIN_USERNAME = 'admin'
    const ADMIN_PASSWORD = 'afterglow2024'

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdminAuthenticated', 'true')
      navigate('/admin')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="login-container">
      <div className="login-background" />
      
      <div className="login-content">
        <div className="login-left">
          <div className="login-brand">
            <h1>AFTERGLOW</h1>
            <h2>MUSIC</h2>
          </div>
          <p className="login-tagline">
            Where Musical Dreams<br />Become Reality.
          </p>
          <p className="login-description">
            Manage your music label with ease.<br />
            Access your admin dashboard.
          </p>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <Lock size={32} />
              <h3>Admin Login</h3>
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="login-button">
                SIGN IN
              </button>
            </form>

            <div className="login-footer">
              <a href="/">← Back to Site</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
