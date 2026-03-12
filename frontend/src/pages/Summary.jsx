import { useState, useEffect } from 'react'
import api from '../api/axios'

const COLORS = { Food: '#f59e0b', Travel: '#3b82f6', Bills: '#ef4444', Entertainment: '#8b5cf6', Other: '#10b981' }
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function Summary() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/expenses/summary?month=${month}&year=${year}`)
      .then(res => setSummary(res.data))
      .finally(() => setLoading(false))
  }, [month, year])

  const total = summary.reduce((acc, s) => acc + s.total, 0)

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Monthly Summary</h1>

      {/* Month/Year picker */}
      <div style={styles.picker}>
        <select style={styles.select} value={month} onChange={e => setMonth(Number(e.target.value))}>
          {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
        </select>
        <select style={styles.select} value={year} onChange={e => setYear(Number(e.target.value))}>
          {[2023, 2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : summary.length === 0 ? (
        <p style={styles.empty}>No expenses for {MONTHS[month-1]} {year}.</p>
      ) : (
        <>
          {/* Total */}
          <div style={styles.totalCard}>
            <p style={styles.totalLabel}>Total Spent in {MONTHS[month-1]} {year}</p>
            <p style={styles.totalValue}>₹{total.toFixed(2)}</p>
          </div>

          {/* Category breakdown */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Breakdown by Category</h2>
            {summary.map(s => {
              const pct = ((s.total / total) * 100).toFixed(1)
              return (
                <div key={s.category} style={styles.catRow}>
                  <div style={styles.catHeader}>
                    <div style={styles.catLeft}>
                      <span style={{ ...styles.dot, background: COLORS[s.category] || '#888' }} />
                      <span style={styles.catName}>{s.category}</span>
                    </div>
                    <div style={styles.catRight}>
                      <span style={styles.catPct}>{pct}%</span>
                      <span style={styles.catAmount}>₹{s.total.toFixed(2)}</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={styles.barBg}>
                    <div style={{ ...styles.barFill, width: `${pct}%`, background: COLORS[s.category] || '#888' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

const styles = {
  page: { maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' },
  heading: { fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' },
  picker: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' },
  select: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '7px',
    fontSize: '0.9rem', background: '#fff', outline: 'none' },
  empty: { textAlign: 'center', color: '#aaa', marginTop: '3rem' },
  totalCard: { background: '#2563eb', color: '#fff', borderRadius: '10px',
    padding: '1.5rem', marginBottom: '1.25rem', textAlign: 'center' },
  totalLabel: { fontSize: '0.875rem', opacity: 0.85, marginBottom: '6px' },
  totalValue: { fontSize: '2rem', fontWeight: 700 },
  card: { background: '#fff', borderRadius: '10px', padding: '1.5rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' },
  catRow: { marginBottom: '1rem' },
  catHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  catLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  catRight: { display: 'flex', gap: '12px', alignItems: 'center' },
  dot: { width: '10px', height: '10px', borderRadius: '50%' },
  catName: { fontWeight: 500, fontSize: '0.9rem' },
  catPct: { color: '#888', fontSize: '0.8rem' },
  catAmount: { fontWeight: 600, fontSize: '0.9rem' },
  barBg: { height: '6px', background: '#f0f0f0', borderRadius: '3px' },
  barFill: { height: '6px', borderRadius: '3px', transition: 'width 0.3s ease' }
}
