import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Releases from './components/Releases'
import Artists from './components/Artists'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Submit from './pages/Submit'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import NotFound from './pages/NotFound'
import './App.css'

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true'
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/submit" element={<Submit />} />
        <Route path="/news" element={
          <>
            <Navbar />
            <News />
            <Footer />
          </>
        } />
        <Route path="/news/:slug" element={
          <>
            <Navbar />
            <NewsDetail />
            <Footer />
          </>
        } />
        <Route path="/" element={
          <div className="app">
            <Navbar />
            <Hero />
            <Releases />
            <Artists />
            <Contact />
            <Footer />
          </div>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
