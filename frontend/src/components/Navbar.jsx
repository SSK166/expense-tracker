import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <span style={styles.logo}>Expense Tracker</span>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Dashboard</Link>
        <Link to="/expenses" style={styles.link}>Expenses</Link>
        <Link to="/summary" style={styles.link}>Summary</Link>
      </div>
      <div style={styles.user}>
        <span style={styles.username}>Hi, {user}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2rem', height: '60px', background: '#fff', borderBottom: '1px solid #e5e5e5' },
  logo: { fontWeight: 700, fontSize: '1.1rem', color: '#1a1a1a' },
  links: { display: 'flex', gap: '2rem' },
  link: { textDecoration: 'none', color: '#555', fontWeight: 500, fontSize: '0.95rem' },
  user: { display: 'flex', alignItems: 'center', gap: '1rem' },
  username: { color: '#555', fontSize: '0.9rem' },
  logoutBtn: { padding: '6px 14px', background: '#f0f0f0', border: 'none',
    borderRadius: '6px', fontWeight: 500, color: '#333', fontSize: '0.875rem' }
}
