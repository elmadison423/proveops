"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { supabase } from "../../lib/supabase";

export default function SetPasswordPage() {

  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {

    checkSession();

  }, []);

  async function checkSession() {

    const {
      data: {
        session,
      },
    } = await supabase.auth.getSession();

    if (!session) {

      toast.error(
        "Your invitation link is invalid or has expired."
      );

      setLoading(false);

      return;
    }

    setLoading(false);
  }

  async function handleSubmit(e) {

    e.preventDefault();

    if (saving) return;

    if (password.length < 8) {

      toast.error(
        "Password must be at least 8 characters."
      );

      return;
    }

    if (password !== confirmPassword) {

      toast.error(
        "Passwords do not match."
      );

      return;
    }

    setSaving(true);

    const {
      error,
    } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {

      console.error(
        "PASSWORD UPDATE ERROR:",
        error
      );

      toast.error(
        error.message ||
        "Unable to set password."
      );

      setSaving(false);

      return;
    }

    toast.success(
      "Password created successfully!"
    );

    router.push("/");
  }

  if (loading) {

    return (

      <div className="page-container">

        <div className="card">

          <h1>
            Set Your Password
          </h1>

          <p>
            Verifying your invitation...
          </p>

        </div>

      </div>

    );
  }

  return (

    <div className="page-container">

      <div className="card">

        <h1>
          Set Your Password
        </h1>

        <p>
          Welcome to ProveOps. Create a password
          for your account below.
        </p>

        <form
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>
              New Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter your password"
              autoComplete="new-password"
            />

          </div>

          <div className="form-group">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm your password"
              autoComplete="new-password"
            />

          </div>

          <button
            type="submit"
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : "Create Password"}

          </button>

        </form>

      </div>

    </div>

  );
}