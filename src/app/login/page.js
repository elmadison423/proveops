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

    if (loading) return

    setLoading(true)

  const {
  data,
  error,
} = await supabase.auth.signInWithPassword({

  email,
  password,

});

if (error) {

  toast.error("Invalid email or password.");

  setLoading(false);

  return;
}

if (!data?.session) {

  toast.error(
    "Unable to establish session."
  );

  setLoading(false);

  return;
}

toast.success("Welcome back!");

window.location.replace("/");

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
          'linear-gradient(135deg, #0f172a, #1e293b, #312e81)',

        padding: '20px',

      }}
    >

      <div
        style={{

          width: '100%',

          maxWidth: '450px',

          background: '#ffffff',

          border: '1px solid #e2e8f0',

          borderRadius: '20px',

          padding: '40px',

          boxShadow:
            '0 20px 50px rgba(0,0,0,0.25)',

        }}
      >

        {/* LOGO / TITLE */}

        <h1
          style={{

            textAlign: 'center',

            marginBottom: '8px',

            fontSize: '2.5rem',

            fontWeight: '700',

            color: '#0f172a',

          }}
        >

          ProveOps

        </h1>

        <p
          style={{

            textAlign: 'center',

            color: '#64748b',

            marginBottom: '32px',

            fontSize: '15px',

          }}
        >

          Operational Intelligence Platform

        </p>


        {/* EMAIL */}

        <div>

          <label
            style={{

              display: 'block',

              marginBottom: '8px',

              fontWeight: '600',

              fontSize: '14px',

              color: '#334155',

            }}
          >

            Email

          </label>

          <input

            type="email"

            placeholder="Enter email"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }

            onKeyDown={handleEnterKey}

            style={{

              width: '100%',

              boxSizing: 'border-box',

              padding: '12px 14px',

              background: '#ffffff',

              color: '#0f172a',

              border: '1px solid #cbd5e1',

              borderRadius: '8px',

              outline: 'none',

              fontSize: '15px',

            }}

          />

        </div>


        {/* PASSWORD */}

        <div
          style={{
            marginTop: '20px',
          }}
        >

          <label
            style={{

              display: 'block',

              marginBottom: '8px',

              fontWeight: '600',

              fontSize: '14px',

              color: '#334155',

            }}
          >

            Password

          </label>

          <input

            type="password"

            placeholder="Enter password"

            value={password}

            onChange={(e) =>
              setPassword(e.target.value)
            }

            onKeyDown={handleEnterKey}

            style={{

              width: '100%',

              boxSizing: 'border-box',

              padding: '12px 14px',

              background: '#ffffff',

              color: '#0f172a',

              border: '1px solid #cbd5e1',

              borderRadius: '8px',

              outline: 'none',

              fontSize: '15px',

            }}

          />

        </div>


        {/* LOGIN BUTTON */}

        <button

          type="button"

          onClick={login}

          disabled={loading}

          style={{

            width: '100%',

            marginTop: '28px',

            padding: '13px',

            border: 'none',

            borderRadius: '8px',

            background:
              'linear-gradient(135deg, #2563eb, #7c3aed)',

            color: '#ffffff',

            fontSize: '15px',

            fontWeight: '600',

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