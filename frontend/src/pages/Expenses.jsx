import { useState, useEffect } from 'react'
import api from '../api/axios'

const CATEGORIES = ['Food', 'Travel', 'Bills', 'Entertainment', 'Other']

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', amount: '', category: 'Food', note: '', date: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchExpenses = async () => {
    const res = filter === 'All'
      ? await api.get('/expenses')
      : await api.get(`/expenses/category/${filter}`)
    setExpenses(res.data)
  }

  useEffect(() => {
    setLoading(true)
    fetchExpenses().finally(() => setLoading(false))
  }, [filter])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await api.post('/expenses', {
        ...form,
        amount: parseFloat(form.amount),
        date: form.date || new Date().toISOString().split('T')[0]
      })
      setForm({ title: '', amount: '', category: 'Food', note: '', date: '' })
      setShowForm(false)
      fetchExpenses()
    } catch {
      setError('Failed to add expense')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    await api.delete(`/expenses/${id}`)
    setExpenses(expenses.filter(e => e.id !== id))
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Expenses</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>New Expense</h3>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleAdd}>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Title</label>
                <input style={styles.input} value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Amount (₹)</label>
                <input style={styles.input} type="number" min="0" step="0.01" value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Category</label>
                <select style={styles.input} value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Date</label>
                <input style={styles.input} type="date" value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Note (optional)</label>
              <input style={styles.input} value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })} />
            </div>
            <button style={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Expense'}
            </button>
          </form>
        </div>
      )}

      {/* Filter */}
      <div style={styles.filters}>
        {['All', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{ ...styles.filterBtn, ...(filter === cat ? styles.filterActive : {}) }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Expense List */}
      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : expenses.length === 0 ? (
        <p style={styles.empty}>No expenses found.</p>
      ) : (
        <div style={styles.list}>
          {expenses.map(exp => (
            <div key={exp.id} style={styles.row}>
              <div style={styles.rowLeft}>
                <p style={styles.rowTitle}>{exp.title}</p>
                <p style={styles.rowMeta}>{exp.category} · {exp.date} {exp.note && `· ${exp.note}`}</p>
              </div>
              <div style={styles.rowRight}>
                <p style={styles.rowAmount}>₹{exp.amount.toFixed(2)}</p>
                <button onClick={() => handleDelete(exp.id)} style={styles.deleteBtn}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  heading: { fontSize: '1.5rem', fontWeight: 700 },
  addBtn: { padding: '9px 18px', background: '#2563eb', color: '#fff', border: 'none',
    borderRadius: '7px', fontWeight: 600, fontSize: '0.875rem' },
  formCard: { background: '#fff', borderRadius: '10px', padding: '1.5rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.5rem' },
  formTitle: { fontWeight: 600, marginBottom: '1rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  field: { marginBottom: '0.75rem' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 500, fontSize: '0.8rem', color: '#555' },
  input: { width: '100%', padding: '9px 11px', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '0.9rem', outline: 'none' },
  submitBtn: { padding: '9px 20px', background: '#2563eb', color: '#fff',
    border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.875rem' },
  error: { background: '#fff0f0', color: '#e53e3e', padding: '8px 12px',
    borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' },
  filters: { display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' },
  filterBtn: { padding: '6px 14px', border: '1px solid #ddd', borderRadius: '20px',
    background: '#fff', color: '#555', fontSize: '0.85rem', fontWeight: 500 },
  filterActive: { background: '#2563eb', color: '#fff', borderColor: '#2563eb' },
  list: { background: '#fff', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 1.25rem', borderBottom: '1px solid #f5f5f5' },
  rowLeft: {},
  rowTitle: { fontWeight: 500, fontSize: '0.95rem' },
  rowMeta: { color: '#aaa', fontSize: '0.8rem', marginTop: '2px' },
  rowRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  rowAmount: { fontWeight: 600, fontSize: '0.95rem' },
  deleteBtn: { padding: '5px 10px', background: '#fff0f0', color: '#e53e3e',
    border: '1px solid #fecaca', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 500 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: '3rem' }
}
