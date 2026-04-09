import { useState } from "react";
import { store, Doctor } from "@/lib/store";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function AdminDoctors() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = store.getUser();
  const [, forceUpdate] = useState(0);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", specialty: "", experience: 0, fee: 0, avatar: "" });

  if (!user || user.role !== "admin") { navigate("/"); return null; }

  const doctors = store.getDoctors();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    store.addDoctor({ ...form, available: true });
    toast({ title: "Doctor added" });
    setAdding(false);
    setForm({ name: "", specialty: "", experience: 0, fee: 0, avatar: "" });
    forceUpdate(v => v + 1);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    store.updateDoctor(editing.id, form);
    toast({ title: "Doctor updated" });
    setEditing(null);
    forceUpdate(v => v + 1);
  };

  const handleDelete = (id: string) => {
    store.deleteDoctor(id);
    toast({ title: "Doctor removed" });
    forceUpdate(v => v + 1);
  };

  const startEdit = (doc: Doctor) => {
    setEditing(doc);
    setAdding(false);
    setForm({ name: doc.name, specialty: doc.specialty, experience: doc.experience, fee: doc.fee, avatar: doc.avatar });
  };

  const FormFields = ({ onSubmit, label }: { onSubmit: (e: React.FormEvent) => void; label: string }) => (
    <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-xl border bg-card p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
          className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        <input placeholder="Specialty" value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} required
          className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        <input placeholder="Experience (years)" type="number" value={form.experience || ""} onChange={e => setForm(f => ({ ...f, experience: +e.target.value }))} required
          className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        <input placeholder="Fee (₹)" type="number" value={form.fee || ""} onChange={e => setForm(f => ({ ...f, fee: +e.target.value }))} required
          className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        <input placeholder="Avatar initials (e.g. AB)" value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value.toUpperCase().slice(0, 2) }))} required maxLength={2}
          className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Save className="h-3.5 w-3.5" /> {label}
        </button>
        <button type="button" onClick={() => { setAdding(false); setEditing(null); }} className="flex items-center gap-1 rounded-lg border px-4 py-2 text-sm hover:bg-muted">
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
      </div>
    </form>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Manage Doctors</h1>
        {!adding && !editing && (
          <button onClick={() => { setAdding(true); setForm({ name: "", specialty: "", experience: 0, fee: 0, avatar: "" }); }}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add Doctor
          </button>
        )}
      </div>

      {adding && <FormFields onSubmit={handleAdd} label="Add Doctor" />}
      {editing && <FormFields onSubmit={handleEdit} label="Save Changes" />}

      <div className="space-y-3">
        {doctors.map((doc, i) => (
          <motion.div key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">{doc.avatar}</div>
              <div>
                <p className="text-sm font-semibold">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.specialty} · {doc.experience}y · ₹{doc.fee}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(doc)} className="rounded-lg border p-2 text-muted-foreground hover:bg-muted"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(doc.id)} className="rounded-lg border p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
