import { useState, useEffect } from 'react'
import api from '../api'

export default function Reports() {
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    api.get('/reports/general').then(r => setStats(r.data))
    api.get('/reports/maintenance-history').then(r => setHistory(r.data.data))
  }, [])

  return (
    <div>
      <h1 style={{color:'#2c3e50', marginBottom:'2rem'}}>Reports</h1>

      {stats && (
        <>
          <h2 style={{color:'#34495e', marginBottom:'1rem'}}>General Statistics</h2>
          <div style={styles.grid}>
            <div style={styles.card}><h4>Daily New</h4><p style={styles.num}>{stats.total_extinguishers.daily}</p></div>
            <div style={styles.card}><h4>Monthly New</h4><p style={styles.num}>{stats.total_extinguishers.monthly}</p></div>
            <div style={styles.card}><h4>Yearly New</h4><p style={styles.num}>{stats.total_extinguishers.yearly}</p></div>
            <div style={styles.card}><h4>Total All</h4><p style={styles.num}>{stats.total_extinguishers.all}</p></div>
            <div style={styles.card}><h4>Expired</h4><p style={{...styles.num, color:'#e74c3c'}}>{stats.expired_extinguishers}</p></div>
            <div style={styles.card}><h4>Inspections Done</h4><p style={{...styles.num, color:'#27ae60'}}>{stats.inspection_status.completed}</p></div>
          </div>
        </>
      )}

      <h2 style={{color:'#34495e', margin:'2rem 0 1rem'}}>Maintenance History</h2>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead><tr style={styles.thead}>
            <th>Extinguisher</th><th>Inspector</th><th>Action</th><th>Conditions</th><th>Date</th>
          </tr></thead>
          <tbody>
            {history.map(item => (
              <tr key={item.id} style={styles.tr}>
                <td>{item.extinguisher?.serial_number}</td>
                <td>{item.inspector?.first_name} {item.inspector?.last_name}</td>
                <td>{item.action_taken}</td>
                <td>{item.conditions}</td>
                <td>{item.date_of_action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:'1rem', marginBottom:'1rem' },
  card: { background:'white', borderRadius:'12px', padding:'1.2rem', boxShadow:'0 2px 10px rgba(0,0,0,0.08)', textAlign:'center' },
  num: { fontSize:'2rem', fontWeight:'bold', color:'#2c3e50', margin:'0.5rem 0 0' },
  tableWrap: { background:'white', borderRadius:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.08)', overflow:'auto' },
  table: { width:'100%', borderCollapse:'collapse' },
  thead: { background:'#2c3e50', color:'white' },
  tr: { borderBottom:'1px solid #eee' }
}