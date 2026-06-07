import { useState, useEffect } from 'react'
import api from '../api'

export default function Inspections() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ extinguisher_id:'', inspector_id:'', scheduled_date:'', status:'scheduled', notes:'' })
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => api.get('/inspections').then(r => setItems(r.data.data))
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) { await api.put(`/inspections/${editing}`, form) }
    else { await api.post('/inspections', form) }
    setForm({ extinguisher_id:'', inspector_id:'', scheduled_date:'', status:'scheduled', notes:'' })
    setEditing(null); setShowForm(false); load()
  }

  const handleEdit = (item) => { setForm(item); setEditing(item.id); setShowForm(true) }
  const handleDelete = async (id) => { if(confirm('Delete?')) { await api.delete(`/inspections/${id}`); load() } }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
        <h1 style={{color:'#2c3e50'}}>Inspections</h1>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Schedule'}</button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3>{editing ? 'Edit Inspection' : 'Schedule Inspection'}</h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <input style={styles.input} placeholder="Extinguisher ID" type="number" value={form.extinguisher_id} onChange={e => setForm({...form, extinguisher_id: e.target.value})} required />
            <input style={styles.input} placeholder="Inspector ID" type="number" value={form.inspector_id} onChange={e => setForm({...form, inspector_id: e.target.value})} required />
            <input style={styles.input} type="datetime-local" value={form.scheduled_date} onChange={e => setForm({...form, scheduled_date: e.target.value})} required />
            <select style={styles.input} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              <option>scheduled</option><option>completed</option><option>cancelled</option>
            </select>
            <input style={styles.input} placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            <button style={styles.btn} type="submit">{editing ? 'Update' : 'Save'}</button>
          </form>
        </div>
      )}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead><tr style={styles.thead}>
            <th>ID</th><th>Extinguisher</th><th>Inspector</th><th>Date</th><th>Status</th><th>Notes</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={styles.tr}>
                <td>{item.id}</td>
                <td>{item.extinguisher?.serial_number || item.extinguisher_id}</td>
                <td>{item.inspector?.first_name} {item.inspector?.last_name}</td>
                <td>{item.scheduled_date}</td>
                <td><span style={styles.badge(item.status)}>{item.status}</span></td>
                <td>{item.notes}</td>
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
  badge: (s) => ({ padding:'0.25rem 0.75rem', borderRadius:'20px', fontSize:'0.8rem', background: s==='completed'?'#d5f5e3': s==='cancelled'?'#fadbd8':'#eaf2ff', color: s==='completed'?'#1e8449': s==='cancelled'?'#c0392b':'#2471a3' }),
  editBtn: { marginRight:'0.5rem', padding:'0.3rem 0.7rem', background:'#3498db', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' },
  delBtn: { padding:'0.3rem 0.7rem', background:'#e74c3c', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' }
}