import { useState, useEffect } from 'react'
import api from '../api'

export default function Extinguishers() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ serial_number:'', location:'', type:'Water', size:'5 lbs', installation_date:'', expiry_date:'', status:'active' })
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => api.get('/extinguishers').then(r => setItems(r.data.data))
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await api.put(`/extinguishers/${editing}`, form)
    } else {
      await api.post('/extinguishers', form)
    }
    setForm({ serial_number:'', location:'', type:'Water', size:'5 lbs', installation_date:'', expiry_date:'', status:'active' })
    setEditing(null)
    setShowForm(false)
    load()
  }

  const handleEdit = (item) => {
    setForm(item)
    setEditing(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this extinguisher?')) {
      await api.delete(`/extinguishers/${id}`)
      load()
    }
  }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
        <h1 style={{color:'#2c3e50'}}>Fire Extinguishers</h1>
        <button style={styles.btn} onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ serial_number:'', location:'', type:'Water', size:'5 lbs', installation_date:'', expiry_date:'', status:'active' }) }}>
          {showForm ? 'Cancel' : '+ Add New'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3>{editing ? 'Edit Extinguisher' : 'Add Extinguisher'}</h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <input style={styles.input} placeholder="Serial Number" value={form.serial_number} onChange={e => setForm({...form, serial_number: e.target.value})} required />
            <input style={styles.input} placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
            <select style={styles.input} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option>Water</option><option>CO2</option><option>Foam</option><option>Dry Chemical</option>
            </select>
            <select style={styles.input} value={form.size} onChange={e => setForm({...form, size: e.target.value})}>
              <option>2.5 lbs</option><option>5 lbs</option><option>9 lbs</option><option>12 lbs</option>
            </select>
            <input style={styles.input} type="date" placeholder="Installation Date" value={form.installation_date} onChange={e => setForm({...form, installation_date: e.target.value})} required />
            <input style={styles.input} type="date" placeholder="Expiry Date" value={form.expiry_date} onChange={e => setForm({...form, expiry_date: e.target.value})} required />
            <select style={styles.input} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              <option>active</option><option>expired</option><option>maintenance</option>
            </select>
            <button style={styles.btn} type="submit">{editing ? 'Update' : 'Save'}</button>
          </form>
        </div>
      )}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead><tr style={styles.thead}>
            <th>Serial No.</th><th>Location</th><th>Type</th><th>Size</th>
            <th>Installed</th><th>Expires</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={styles.tr}>
                <td>{item.serial_number}</td>
                <td>{item.location}</td>
                <td>{item.type}</td>
                <td>{item.size}</td>
                <td>{item.installation_date}</td>
                <td>{item.expiry_date}</td>
                <td><span style={styles.badge(item.status)}>{item.status}</span></td>
                <td>
                  <button style={styles.editBtn} onClick={() => handleEdit(item)}>Edit</button>
                  <button style={styles.delBtn} onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  btn: { padding:'0.6rem 1.2rem', background:'#e74c3c', color:'white', border:'none', borderRadius:'8px', cursor:'pointer' },
  formCard: { background:'white', padding:'1.5rem', borderRadius:'12px', marginBottom:'1.5rem', boxShadow:'0 2px 10px rgba(0,0,0,0.08)' },
  formGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'1rem', marginTop:'1rem' },
  input: { padding:'0.6rem', borderRadius:'8px', border:'1px solid #ddd', fontSize:'0.95rem', width:'100%', boxSizing:'border-box' },
  tableWrap: { background:'white', borderRadius:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.08)', overflow:'auto' },
  table: { width:'100%', borderCollapse:'collapse' },
  thead: { background:'#2c3e50', color:'white' },
  tr: { borderBottom:'1px solid #eee' },
  badge: (s) => ({ padding:'0.25rem 0.75rem', borderRadius:'20px', fontSize:'0.8rem', background: s==='active'?'#d5f5e3': s==='expired'?'#fadbd8':'#fef9e7', color: s==='active'?'#1e8449': s==='expired'?'#c0392b':'#d68910' }),
  editBtn: { marginRight:'0.5rem', padding:'0.3rem 0.7rem', background:'#3498db', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' },
  delBtn: { padding:'0.3rem 0.7rem', background:'#e74c3c', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' }
}