import { Outlet, Link, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🔥 FES</h2>
        <p style={styles.username}>{user.first_name} {user.last_name}</p>
        <p style={styles.role}>{user.role}</p>
        <nav>
          <Link style={styles.link} to="/">Dashboard</Link>
          <Link style={styles.link} to="/extinguishers">Extinguishers</Link>
          <Link style={styles.link} to="/inspections">Inspections</Link>
          <Link style={styles.link} to="/maintenance">Maintenance</Link>
          <Link style={styles.link} to="/reports">Reports</Link>
        </nav>
        <button style={styles.logout} onClick={logout}>Logout</button>
      </div>
      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}

const styles = {
  sidebar: { width:'220px', background:'#2c3e50', color:'white', padding:'1.5rem', display:'flex', flexDirection:'column' },
  logo: { color:'#e74c3c', marginBottom:'0.5rem' },
  username: { fontWeight:'bold', marginBottom:'0.25rem' },
  role: { color:'#bdc3c7', fontSize:'0.85rem', marginBottom:'2rem', textTransform:'uppercase' },
  link: { display:'block', color:'white', textDecoration:'none', padding:'0.6rem 0', borderBottom:'1px solid #34495e' },
  logout: { marginTop:'auto', padding:'0.75rem', background:'#e74c3c', color:'white', border:'none', borderRadius:'8px', cursor:'pointer' },
  content: { flex:1, padding:'2rem', background:'#f0f2f5', overflowY:'auto' }
}