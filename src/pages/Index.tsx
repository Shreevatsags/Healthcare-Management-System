import { store, Doctor } from "@/lib/store";
import { Link } from "react-router-dom";
import { Star, Clock, IndianRupee, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const specialtyColors: Record<string, string> = {
  Cardiologist: "bg-red-100 text-red-700",
  Dermatologist: "bg-purple-100 text-purple-700",
  Pediatrician: "bg-blue-100 text-blue-700",
  Orthopedic: "bg-amber-100 text-amber-700",
  Neurologist: "bg-pink-100 text-pink-700",
  "General Physician": "bg-emerald-100 text-emerald-700",
};

export default function Index() {
  const doctors = store.getDoctors().filter(d => d.available);
  const user = store.getUser();

  return (
    <div className="space-y-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 sm:p-12"
      >
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Your Health, <br />
          <span className="text-primary">Our Priority</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Book appointments with top specialists in seconds. No wait, no hassle.
        </p>
        {!user && (
          <Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </motion.section>

      {/* Doctors Grid */}
      <section>
        <h2 className="font-display text-2xl font-bold text-foreground">Available Doctors</h2>
        <p className="mt-1 text-muted-foreground">Choose a specialist and book your visit</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc, i) => (
            <DoctorCard key={doc.id} doctor={doc} index={i} loggedIn={!!user} />
          ))}
        </div>
      </section>
    </div>
  );
}

function DoctorCard({ doctor, index, loggedIn }: { doctor: Doctor; index: number; loggedIn: boolean }) {
  const colorClass = specialtyColors[doctor.specialty] || "bg-secondary text-secondary-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-display text-lg font-bold text-primary">
          {doctor.avatar}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold text-foreground truncate">{doctor.name}</h3>
          <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
            {doctor.specialty}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{doctor.experience}y exp</span>
        <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" />₹{doctor.fee}</span>
        <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" />4.{5 + (parseInt(doctor.id) % 5)}</span>
      </div>

      {loggedIn ? (
        <Link
          to={`/book/${doctor.id}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Book Appointment <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <Link
          to="/login"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-primary py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
        >
          Sign in to Book
        </Link>
      )}
    </motion.div>
  );
}
