import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.name, form.username, form.password)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Start tracking your expenses</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[['name','Full Name','text'],['username','Username','text'],['password','Password','password']].map(([key, label, type]) => (
            <div key={key} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input style={styles.input} type={type} value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })} required />
            </div>
          ))}
          <button style={styles.btn} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#f5f5f5' },
  card: { background: '#fff', padding: '2.5rem', borderRadius: '12px',
    width: '100%', maxWidth: '400px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  title: { textAlign: 'center', marginBottom: '4px', fontSize: '1.4rem' },
  subtitle: { textAlign: 'center', color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' },
  error: { background: '#fff0f0', color: '#e53e3e', padding: '10px 14px',
    borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.875rem', color: '#444' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '0.95rem', outline: 'none' },
  btn: { width: '100%', padding: '11px', background: '#2563eb', color: '#fff',
    border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.5rem' },
  footer: { textAlign: 'center', marginTop: '1.2rem', color: '#888', fontSize: '0.875rem' },
  link: { color: '#2563eb', textDecoration: 'none', fontWeight: 500 }
}
