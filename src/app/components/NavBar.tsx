import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full bg-blue-900 text-white py-3 px-6 flex gap-6 items-center shadow-md">
      <Link href="/dashboard" className="hover:underline font-semibold">Dashboard</Link>
      <Link href="/animal_bite_record" className="hover:underline">Records</Link>
      <Link href="/billing" className="hover:underline">Billing</Link>
      <Link href="/checkins" className="hover:underline">Check-ins</Link>
      <Link href="/wristbands" className="hover:underline">Wristbands</Link>
      <Link href="/sms" className="hover:underline">SMS</Link>
      <Link href="/emergency" className="hover:underline">Emergency</Link>
      <Link href="/register" className="hover:underline">Register</Link>
    </nav>
  );
}
