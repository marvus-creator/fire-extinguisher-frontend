import { useState, useEffect } from 'react'
import api from '../api'

export default function MaintenanceLogs() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ extinguisher_id:'', inspector_id:'', action_taken:'', conditions:'', date_of_action:'' })
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => api.get('/maintenance-logs').then(r => setItems(r.data.data))
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) { await api.put(`/maintenance-logs/${editing}`, form) }
    else { await api.post('/maintenance-logs', form) }
    setForm({ extinguisher_id:'', inspector_id:'', action_taken:'', conditions:'', date_of_action:'' })
    setEditing(null); setShowForm(false); load()
  }

  const handleEdit = (item) => { setForm(item); setEditing(item.id); setShowForm(true) }
  const handleDelete = async (id) => { if(confirm('Delete?')) { await api.delete(`/maintenance-logs/${id}`); load() } }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
        <h1 style={{color:'#2c3e50'}}>Maintenance Logs</h1>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Log'}</button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3>{editing ? 'Edit Log' : 'Add Maintenance Log'}</h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <input style={styles.input} placeholder="Extinguisher ID" type="number" value={form.extinguisher_id} onChange={e => setForm({...form, extinguisher_id: e.target.value})} required />
            <input style={styles.input} placeholder="Inspector ID" type="number" value={form.inspector_id} onChange={e => setForm({...form, inspector_id: e.target.value})} required />
            <input style={styles.input} placeholder="Action Taken" value={form.action_taken} onChange={e => setForm({...form, action_taken: e.target.value})} required />
            <input style={styles.input} placeholder="Conditions" value={form.conditions} onChange={e => setForm({...form, conditions: e.target.value})} required />
            <input style={styles.input} type="date" value={form.date_of_action} onChange={e => setForm({...form, date_of_action: e.target.value})} required />
            <button style={styles.btn} type="submit">{editing ? 'Update' : 'Save'}</button>
          </form>
        </div>
      )}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead><tr style={styles.thead}>
            <th>ID</th><th>Extinguisher</th><th>Inspector</th><th>Action Taken</th><th>Conditions</th><th>Date</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={styles.tr}>
                <td>{item.id}</td>
                <td>{item.extinguisher?.serial_number || item.extinguisher_id}</td>
                <td>{item.inspector?.first_name} {item.inspector?.last_name}</td>
                <td>{item.action_taken}</td>
                <td>{item.conditions}</td>
                <td>{item.date_of_action}</td>
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
  editBtn: { marginRight:'0.5rem', padding:'0.3rem 0.7rem', background:'#3498db', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' },
  delBtn: { padding:'0.3rem 0.7rem', background:'#e74c3c', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' }
}