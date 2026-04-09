// In-memory data store (simulates backend)
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  fee: number;
  avatar: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  date: string;
  time: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "patient";
}

const DOCTORS_KEY = "hc_doctors";
const APPOINTMENTS_KEY = "hc_appointments";
const USER_KEY = "hc_user";
const NOTIFICATIONS_KEY = "hc_notifications";

const defaultDoctors: Doctor[] = [
  { id: "1", name: "Dr. Ananya Sharma", specialty: "Cardiologist", experience: 12, fee: 800, avatar: "AS", available: true },
  { id: "2", name: "Dr. Rajesh Patel", specialty: "Dermatologist", experience: 8, fee: 600, avatar: "RP", available: true },
  { id: "3", name: "Dr. Priya Menon", specialty: "Pediatrician", experience: 15, fee: 700, avatar: "PM", available: true },
  { id: "4", name: "Dr. Vikram Singh", specialty: "Orthopedic", experience: 10, fee: 900, avatar: "VS", available: true },
  { id: "5", name: "Dr. Neha Gupta", specialty: "Neurologist", experience: 7, fee: 1000, avatar: "NG", available: true },
  { id: "6", name: "Dr. Arjun Reddy", specialty: "General Physician", experience: 5, fee: 400, avatar: "AR", available: true },
];

function getItem<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function setItem<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const store = {
  getDoctors: (): Doctor[] => getItem(DOCTORS_KEY, defaultDoctors),
  setDoctors: (d: Doctor[]) => setItem(DOCTORS_KEY, d),
  addDoctor: (d: Omit<Doctor, "id">) => {
    const docs = store.getDoctors();
    const newDoc = { ...d, id: crypto.randomUUID() };
    docs.push(newDoc);
    store.setDoctors(docs);
    return newDoc;
  },
  updateDoctor: (id: string, updates: Partial<Doctor>) => {
    const docs = store.getDoctors().map(d => d.id === id ? { ...d, ...updates } : d);
    store.setDoctors(docs);
  },
  deleteDoctor: (id: string) => {
    store.setDoctors(store.getDoctors().filter(d => d.id !== id));
  },

  getAppointments: (): Appointment[] => getItem(APPOINTMENTS_KEY, []),
  setAppointments: (a: Appointment[]) => setItem(APPOINTMENTS_KEY, a),
  bookAppointment: (a: Omit<Appointment, "id" | "status" | "createdAt">): { success: boolean; error?: string } => {
    const appts = store.getAppointments();
    const conflict = appts.find(x => x.doctorId === a.doctorId && x.date === a.date && x.time === a.time && x.status !== "cancelled");
    if (conflict) return { success: false, error: "This time slot is already booked." };
    appts.push({ ...a, id: crypto.randomUUID(), status: "confirmed", createdAt: new Date().toISOString() });
    store.setAppointments(appts);
    store.addNotification(`Appointment confirmed for ${a.patientName} on ${a.date} at ${a.time}`);
    return { success: true };
  },
  cancelAppointment: (id: string) => {
    const appts = store.getAppointments().map(a => a.id === id ? { ...a, status: "cancelled" as const } : a);
    store.setAppointments(appts);
  },

  getUser: (): User | null => getItem(USER_KEY, null),
  setUser: (u: User | null) => u ? setItem(USER_KEY, u) : localStorage.removeItem(USER_KEY),
  login: (email: string, _password: string): { success: boolean; user?: User; error?: string } => {
    if (email === "admin@health.com") return { success: true, user: { id: "admin", name: "Admin", email, role: "admin" } };
    const users = getItem<User[]>("hc_users_db", []);
    const found = users.find(u => u.email === email);
    if (found) return { success: true, user: found };
    return { success: false, error: "Invalid credentials" };
  },
  register: (name: string, email: string, _password: string): { success: boolean; user?: User; error?: string } => {
    const users = getItem<User[]>("hc_users_db", []);
    if (users.find(u => u.email === email)) return { success: false, error: "Email already registered" };
    const user: User = { id: crypto.randomUUID(), name, email, role: "patient" };
    users.push(user);
    setItem("hc_users_db", users);
    return { success: true, user };
  },

  getNotifications: (): string[] => getItem(NOTIFICATIONS_KEY, []),
  addNotification: (msg: string) => {
    const n = store.getNotifications();
    n.unshift(msg);
    setItem(NOTIFICATIONS_KEY, n.slice(0, 20));
  },
};
