import { useState } from "react";
import { store } from "@/lib/store";
import { useNavigate, useParams, Link } from "react-router-dom";
import { CalendarDays, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = store.getUser();
  const doctor = store.getDoctors().find(d => d.id === doctorId);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (!user) { navigate("/login"); return null; }
  if (!doctor) return <div className="py-20 text-center text-muted-foreground">Doctor not found.</div>;

  // Find booked slots for selected date
  const bookedSlots = store.getAppointments()
    .filter(a => a.doctorId === doctor.id && a.date === date && a.status !== "cancelled")
    .map(a => a.time);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    const res = store.bookAppointment({ patientName: user.name, patientEmail: user.email, doctorId: doctor.id, date, time });
    if (res.success) {
      toast({ title: "Appointment Booked!", description: `${doctor.name} on ${date} at ${time}` });
      navigate("/appointments");
    } else {
      toast({ title: "Booking Failed", description: res.error, variant: "destructive" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-2xl space-y-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to doctors
      </Link>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4 border-b pb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 font-display text-xl font-bold text-primary">
            {doctor.avatar}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">{doctor.name}</h1>
            <p className="text-sm text-muted-foreground">{doctor.specialty} · {doctor.experience}y experience · ₹{doctor.fee}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="h-4 w-4 text-primary" /> Select Date
            </label>
            <input type="date" value={date} onChange={e => { setDate(e.target.value); setTime(""); }}
              min={new Date().toISOString().split("T")[0]} required
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          {date && (
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-primary" /> Select Time
              </label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {timeSlots.map(slot => {
                  const booked = bookedSlots.includes(slot);
                  return (
                    <button key={slot} type="button" disabled={booked}
                      onClick={() => setTime(slot)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        booked ? "cursor-not-allowed bg-muted text-muted-foreground line-through opacity-50"
                        : time === slot ? "border-primary bg-primary text-primary-foreground"
                        : "hover:border-primary hover:bg-primary/5"
                      }`}>
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button type="submit" disabled={!date || !time}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50">
            <CheckCircle className="h-4 w-4" /> Confirm Appointment
          </button>
        </form>
      </div>
    </motion.div>
  );
}
