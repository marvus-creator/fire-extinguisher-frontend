import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔥 Fire Extinguisher System</h2>
        <h3 style={styles.subtitle}>Login</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" placeholder="Email"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} type="password" placeholder="Password"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <button style={styles.button} type="submit">Login</button>
        </form>
        <p style={{textAlign:'center', marginTop:'1rem'}}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f2f5' },
  card: { background:'white', padding:'2rem', borderRadius:'12px', width:'100%', maxWidth:'400px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  title: { textAlign:'center', color:'#e74c3c', marginBottom:'0.5rem' },
  subtitle: { textAlign:'center', color:'#333', marginBottom:'1.5rem' },
  input: { width:'100%', padding:'0.75rem', marginBottom:'1rem', borderRadius:'8px', border:'1px solid #ddd', fontSize:'1rem', boxSizing:'border-box' },
  button: { width:'100%', padding:'0.75rem', background:'#e74c3c', color:'white', border:'none', borderRadius:'8px', fontSize:'1rem', cursor:'pointer' },
  error: { color:'red', textAlign:'center', marginBottom:'1rem' }
}