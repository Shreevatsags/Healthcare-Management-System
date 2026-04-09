import { useState } from "react";
import { store } from "@/lib/store";
import { useNavigate } from "react-router-dom";
import { Calendar, XCircle, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Appointments() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = store.getUser();
  const [filterDoctor, setFilterDoctor] = useState("");
  const [, forceUpdate] = useState(0);

  if (!user) { navigate("/login"); return null; }

  const doctors = store.getDoctors();
  let appointments = store.getAppointments();
  if (user.role !== "admin") appointments = appointments.filter(a => a.patientEmail === user.email);
  if (filterDoctor) appointments = appointments.filter(a => a.doctorId === filterDoctor);
  appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleCancel = (id: string) => {
    store.cancelAppointment(id);
    toast({ title: "Appointment cancelled" });
    forceUpdate(v => v + 1);
  };

  const getDoctorName = (id: string) => doctors.find(d => d.id === id)?.name || "Unknown";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Appointments</h1>
          <p className="text-sm text-muted-foreground">{appointments.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select value={filterDoctor} onChange={e => setFilterDoctor(e.target.value)}
            className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">All Doctors</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-2xl border bg-card py-20 text-center">
          <Calendar className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-muted-foreground">No appointments yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt, i) => (
            <motion.div key={appt.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${appt.status === "confirmed" ? "bg-emerald-500" : "bg-destructive"}`} />
                <div>
                  <p className="text-sm font-semibold">{getDoctorName(appt.doctorId)}</p>
                  <p className="text-xs text-muted-foreground">{appt.patientName} · {appt.date} at {appt.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  appt.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                }`}>{appt.status}</span>
                {appt.status === "confirmed" && (
                  <button onClick={() => handleCancel(appt.id)} className="flex items-center gap-1 text-xs text-destructive hover:underline">
                    <XCircle className="h-3.5 w-3.5" /> Cancel
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
