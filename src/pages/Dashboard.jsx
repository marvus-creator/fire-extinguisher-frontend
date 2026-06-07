import { useState, useEffect } from 'react'
import api from '../api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/reports/general').then(res => setStats(res.data))
  }, [])

  return (
    <div>
      <h1 style={{color:'#2c3e50', marginBottom:'2rem'}}>Dashboard</h1>
      {stats ? (
        <div style={styles.grid}>
          <div style={styles.card('blue')}>
            <h3>Total Extinguishers</h3>
            <p style={styles.num}>{stats.total_extinguishers.all}</p>
          </div>
          <div style={styles.card('green')}>
            <h3>Active</h3>
            <p style={styles.num}>{stats.active_extinguishers}</p>
          </div>
          <div style={styles.card('red')}>
            <h3>Expired</h3>
            <p style={styles.num}>{stats.expired_extinguishers}</p>
          </div>
          <div style={styles.card('orange')}>
            <h3>In Maintenance</h3>
            <p style={styles.num}>{stats.maintenance_extinguishers}</p>
          </div>
          <div style={styles.card('purple')}>
            <h3>Scheduled Inspections</h3>
            <p style={styles.num}>{stats.inspection_status.scheduled}</p>
          </div>
          <div style={styles.card('teal')}>
            <h3>Completed Inspections</h3>
            <p style={styles.num}>{stats.inspection_status.completed}</p>
          </div>
          <div style={styles.card('gray')}>
            <h3>Maintenance Logs</h3>
            <p style={styles.num}>{stats.total_maintenance_logs}</p>
          </div>
        </div>
      ) : <p>Loading...</p>}
    </div>
  )
}

const styles = {
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'1.5rem' },
  card: (color) => ({
    background:'white', borderRadius:'12px', padding:'1.5rem',
    boxShadow:'0 2px 10px rgba(0,0,0,0.08)', borderTop:`4px solid ${color}`
  }),
  num: { fontSize:'2.5rem', fontWeight:'bold', margin:'0.5rem 0 0', color:'#2c3e50' }
}