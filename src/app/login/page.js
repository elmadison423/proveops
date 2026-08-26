'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { supabase } from '../../lib/supabase'

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

 async function login() {

  if (loading) return;

  setLoading(true);

  const { error } =
    await supabase.auth.signInWithPassword({

      email,
      password,

    });

  if (error) {

    toast.error("Invalid email or password.");

    setLoading(false);

    return;
  }

 const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  toast.error("Unable to establish session.");
  setLoading(false);
  return;
}

toast.success("Welcome back!");

router.replace("/");
}

  function handleEnterKey(e) {

    if (e.key === 'Enter') {

      login()

    }
  }

  return (

    <div
      style={{

        minHeight: '100vh',

        display: 'flex',

        justifyContent: 'center',

        alignItems: 'center',

        background:
          'linear-gradient(135deg,#0f172a,#1e293b,#312e81)',

        padding: '20px',

      }}
    >

      <div
        style={{

          width: '100%',

          maxWidth: '450px',

          background:
            'rgba(255,255,255,0.08)',

          border:
            '1px solid rgba(255,255,255,0.08)',

          backdropFilter:
            'blur(18px)',

          borderRadius: '24px',

          padding: '40px',

          boxShadow:
            '0 20px 40px rgba(0,0,0,0.35)',

        }}
      >

        <h1
          style={{

            textAlign: 'center',

            marginBottom: '10px',

            fontSize: '2.5rem',

          }}
        >

          ProveOps

        </h1>

        <p
          style={{

            textAlign: 'center',

            opacity: 0.7,

            marginBottom: '35px',

          }}
        >

          Operational Intelligence Platform

        </p>

        <div>

          <label>Email</label>

          <input

            type="email"

            placeholder="Enter email"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }

            onKeyDown={handleEnterKey}

          />

        </div>

        <div
          style={{
            marginTop: '20px',
          }}
        >

          <label>Password</label>

          <input

            type="password"

            placeholder="Enter password"

            value={password}

            onChange={(e) =>
              setPassword(e.target.value)
            }

            onKeyDown={handleEnterKey}

          />

        </div>

        <button

          type="button"

          onClick={login}

          disabled={loading}

          style={{

            width: '100%',

            marginTop: '25px',

            opacity:
              loading ? 0.6 : 1,

            cursor:
              loading
                ? 'not-allowed'
                : 'pointer',

          }}

        >

          {loading
            ? 'Signing In...'
            : 'Login'}

        </button>

      </div>

    </div>

  )

}