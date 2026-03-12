import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const CATEGORIES = ['Food', 'Travel', 'Bills', 'Entertainment', 'Other']
const COLORS = { Food: '#f59e0b', Travel: '#3b82f6', Bills: '#ef4444', Entertainment: '#8b5cf6', Other: '#10b981' }

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/expenses'),
      api.get('/expenses/summary')
    ]).then(([expRes, sumRes]) => {
      setExpenses(expRes.data)
      setSummary(sumRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const totalThisMonth = summary.reduce((acc, s) => acc + s.total, 0)
  const recentExpenses = expenses.slice(0, 5)

  if (loading) return <div style={styles.loading}>Loading...</div>

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Welcome back, {user}</h1>

      {/* Stat Cards */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Total This Month</p>
          <p style={styles.cardValue}>₹{totalThisMonth.toFixed(2)}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Total Transactions</p>
          <p style={styles.cardValue}>{expenses.length}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Categories Used</p>
          <p style={styles.cardValue}>{summary.length}</p>
        </div>
      </div>

      {/* Category breakdown */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>This Month by Category</h2>
        {summary.length === 0 ? (
          <p style={styles.empty}>No expenses this month yet.</p>
        ) : (
          <div style={styles.categoryList}>
            {summary.map(s => (
              <div key={s.category} style={styles.categoryRow}>
                <span style={{ ...styles.dot, background: COLORS[s.category] || '#888' }} />
                <span style={styles.categoryName}>{s.category}</span>
                <span style={styles.categoryAmount}>₹{s.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Expenses */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Recent Expenses</h2>
          <button onClick={() => navigate('/expenses')} style={styles.viewAll}>View All</button>
        </div>
        {recentExpenses.length === 0 ? (
          <p style={styles.empty}>No expenses yet. <span style={styles.addLink} onClick={() => navigate('/expenses')}>Add one!</span></p>
        ) : (
          recentExpenses.map(exp => (
            <div key={exp.id} style={styles.expenseRow}>
              <div>
                <p style={styles.expenseTitle}>{exp.title}</p>
                <p style={styles.expenseMeta}>{exp.category} · {exp.date}</p>
              </div>
              <p style={styles.expenseAmount}>₹{exp.amount.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' },
  loading: { textAlign: 'center', marginTop: '4rem', color: '#888' },
  heading: { fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' },
  card: { background: '#fff', padding: '1.25rem', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cardLabel: { color: '#888', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 500 },
  cardValue: { fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a' },
  section: { background: '#fff', borderRadius: '10px', padding: '1.25rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.25rem' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' },
  viewAll: { background: 'none', border: 'none', color: '#2563eb', fontWeight: 500, fontSize: '0.875rem' },
  empty: { color: '#aaa', fontSize: '0.9rem' },
  addLink: { color: '#2563eb', cursor: 'pointer', fontWeight: 500 },
  categoryList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  categoryRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  dot: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  categoryName: { flex: 1, fontSize: '0.9rem', color: '#444' },
  categoryAmount: { fontWeight: 600, color: '#1a1a1a' },
  expenseRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 0', borderBottom: '1px solid #f0f0f0' },
  expenseTitle: { fontWeight: 500, fontSize: '0.95rem' },
  expenseMeta: { color: '#aaa', fontSize: '0.8rem', marginTop: '2px' },
  expenseAmount: { fontWeight: 600, color: '#1a1a1a' }
}
