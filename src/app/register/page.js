"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [form, setForm] = useState({
    organization: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dispatchRegion: "Permian Basin",
    timeZone: "Central",
    agree: false,
  });

  const router = useRouter();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

async function handleSubmit(e) {
  e.preventDefault();

  console.log("STEP 1");

  if (form.password !== form.confirmPassword) {
    console.log("Password mismatch");
    alert("Passwords do not match.");
    return;
  }

  console.log("STEP 2");

  if (!form.agree) {
    console.log("Terms not accepted");
    alert("Please agree to the Terms of Service.");
    return;
  }

  console.log("STEP 3");

  try {

    console.log("STEP 4 - Calling signUp");

    const { data, error } =
      await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

    console.log("STEP 5");
    console.log(data);
    console.log(error);

    if (error) throw error;

    console.log("STEP 6 - Calling API");

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: data.user.id,
        organization: form.organization,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        dispatchRegion: form.dispatchRegion,
      }),
    });

    console.log("STEP 7");

    const result = await response.json();

    console.log("STEP 8");
    console.log(result);

    if (!response.ok) {
      throw new Error(result.error);
    }

    console.log("STEP 9");

router.replace("/");

console.log("STEP 10");

  } catch (err) {

    console.error("REGISTER ERROR");
    console.error(err);

    alert(err.message);
  }
}

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      {/* LEFT PANEL */}

      <div className="hidden xl:flex w-72 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex-col justify-between p-10">

        <div>

          <h1 className="text-5xl font-extrabold">
            ProveOps
          </h1>

          <p className="mt-4 text-blue-200 text-lg">
            Operational Intelligence Platform
          </p>

          <div className="mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>

          <div className="mt-12 space-y-6">

            <div className="flex items-center gap-3">
              <span className="text-green-400 text-xl">✓</span>
              <span>Compliance Tracking</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-400 text-xl">✓</span>
              <span>Automated Due Reports</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-400 text-xl">✓</span>
              <span>Technician Scheduling</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-400 text-xl">✓</span>
              <span>Dispatch Board</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-400 text-xl">✓</span>
              <span>Unlimited Meter History</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-400 text-xl">✓</span>
              <span>Enterprise Security</span>
            </div>

          </div>

          <div className="mt-16 rounded-2xl border border-blue-800 bg-blue-950/40 p-6">

            <p className="text-sm uppercase tracking-widest text-blue-300">
              Trusted By
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              Oil & Gas Measurement Companies
            </h3>

          </div>

        </div>

        <div>

          <p className="text-blue-200">
            Already have an account?
          </p>

          <Link
            href="/login"
            className="mt-2 inline-block font-semibold text-white hover:text-blue-300"
          >
            Sign In →
          </Link>

        </div>

      </div>

         {/* RIGHT SIDE */}

      <div className="flex-1 flex justify-center items-center px-16 py-12">

        <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl p-10">

          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
              👤
            </div>
          </div>

          <div className="mt-4 flex justify-center">

  <div className="rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">

    ✓ Free 14-Day Trial

  </div>

</div>

          <h1 className="mt-6 text-center text-5xl font-bold text-slate-900">
            Create Your
            <br />
            ProveOps Account
          </h1>

          <p className="mt-4 text-center text-slate-500">
            Start your free trial and streamline your meter proving operations.
          </p>

          <form
  onSubmit={handleSubmit}
  className="mt-8 space-y-4"
>

            <label className="block">

              <span className="mb-1 block text-sm font-medium text-slate-600">
                Organization Name
              </span>

              <input
                type="text"
                name="organization"
                value={form.organization}
                onChange={handleChange}
                placeholder="Madison Oil & Gas"
                className="w-full rounded-xl border border-slate-300 p-4"
              />

            </label>

            <label className="block">

              <span className="mb-1 block text-sm font-medium text-slate-600">
                Contact Name
              </span>

              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="John Smith"
                className="w-full rounded-xl border border-slate-300 p-4"
              />

            </label>

            <label className="block">

              <span className="mb-1 block text-sm font-medium text-slate-600">
                Business Email
              </span>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="company@email.com"
                className="w-full rounded-xl border border-slate-300 p-4"
              />

            </label>

            <label className="block">

              <span className="mb-1 block text-sm font-medium text-slate-600">
                Phone Number
              </span>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="432-555-1234"
                className="w-full rounded-xl border border-slate-300 p-4"
              />

            </label>

            <label className="block">

              <span className="mb-1 block text-sm font-medium text-slate-600">
                Password
              </span>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 p-4"
              />

            </label>

            <label className="block">

              <span className="mb-1 block text-sm font-medium text-slate-600">
                Confirm Password
              </span>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 p-4"
              />

            </label>

               <label className="block">

              <span className="mb-1 block text-sm font-medium text-slate-600">
                Dispatch Region
              </span>

              <select
                name="dispatchRegion"
                value={form.dispatchRegion}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 p-4"
              >
                <option>Permian Basin</option>
                <option>Eagle Ford</option>
                <option>DJ Basin</option>
                <option>Bakken</option>
                <option>Other</option>
              </select>

            </label>

            <label className="block">

              <span className="mb-1 block text-sm font-medium text-slate-600">
                Time Zone
              </span>

              <select
                name="timeZone"
                value={form.timeZone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 p-4"
              >
                <option>Central</option>
                <option>Mountain</option>
                <option>Eastern</option>
              </select>

            </label>

           
    <div className="flex items-center gap-3 py-3">

  <input
    id="agree"
    type="checkbox"
    name="agree"
    checked={form.agree}
    onChange={handleChange}
    className="h-4 w-4"
  />

  <label
    htmlFor="agree"
    className="text-sm text-slate-600 cursor-pointer"
  >
    I agree to the Terms of Service and Privacy Policy.
  </label>

</div>

            <button
              type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 py-5 text-lg font-bold tracking-wide text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Start Free Trial
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}