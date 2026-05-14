import { useState } from 'react';
import { login, signup } from '../services/api';
import '../styles/AuthPage.css';

function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!isLogin && (!formData.name || formData.name.trim().length < 2))
      errs.name = 'Name must be at least 2 characters';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Enter a valid email address';
    if (!formData.password || formData.password.length < 8)
      errs.password = 'Password must be at least 8 characters';
    if (!isLogin && !/\d/.test(formData.password))
      errs.password = 'Password must contain at least one number';
    if (!isLogin && formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = isLogin
        ? await login({ email: formData.email, password: formData.password })
        : await signup({ name: formData.name, email: formData.email, password: formData.password });

      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      onAuth(res.user, res.token);
    } catch (err) {
      const message = err.response?.data?.error 
        || err.response?.data?.message
        || (err.code === 'ERR_NETWORK' ? 'Cannot connect to server. Make sure backend is running.' : err.message)
        || 'Something went wrong';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setServerError('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <h1>🧠 SkillBridge</h1>
          <p>AI-Powered Career Intelligence Platform</p>
        </div>
        <div className="auth-features">
          <div className="auth-feature">
            <span>🎯</span>
            <div>
              <h4>Skill Gap Analysis</h4>
              <p>Identify exactly what skills you need</p>
            </div>
          </div>
          <div className="auth-feature">
            <span>🤖</span>
            <div>
              <h4>AI Roadmap Generation</h4>
              <p>Personalized learning paths powered by AI</p>
            </div>
          </div>
          <div className="auth-feature">
            <span>📊</span>
            <div>
              <h4>Track Your Progress</h4>
              <p>Save analyses and monitor improvement</p>
            </div>
          </div>
          <div className="auth-feature">
            <span>📝</span>
            <div>
              <h4>Skill Assessment Tests</h4>
              <p>Verify your knowledge with role-specific tests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>{isLogin ? 'Welcome back 👋' : 'Create account 🚀'}</h2>
          <p className="auth-subtitle">
            {isLogin ? 'Sign in to access your analyses' : 'Start your career intelligence journey'}
          </p>

          {serverError && <div className="server-error">⚠️ {serverError}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isLogin ? 'Enter your password' : 'Min 8 chars, include a number'}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          <p className="auth-switch">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={switchMode} className="switch-btn">
              {isLogin ? ' Sign Up' : ' Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
