'use client'

import {
  useState,
} from 'react'

import {
  useRouter,
} from 'next/navigation'

import toast from 'react-hot-toast'

import { supabase }
from '../../lib/supabase'

export default function LoginPage() {

  const router =
    useRouter()

  const [email, setEmail] =
    useState('')

  const [
    password,
    setPassword,
  ] = useState('')

  async function login() {

    const { error } =
      await supabase.auth
        .signInWithPassword({

          email,

          password,
        })

    if (error) {

      toast.error(
        'Invalid login credentials'
      )

    } else {

      toast.success(
        'Login successful'
      )

      router.push('/')
    }
  }

  function handleEnterKey(
    e
  ) {

    if (
      e.key === 'Enter'
    ) {

      login()
    }
  }

  return (

    <div
      style={{

        minHeight: '100vh',

        display: 'flex',

        justifyContent:
          'center',

        alignItems:
          'center',

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

          borderRadius:
            '24px',

          padding: '40px',

          boxShadow:
            '0 20px 40px rgba(0,0,0,0.35)',
        }}
      >

        <h1
          style={{

            textAlign: 'center',

            marginBottom:
              '10px',

            fontSize: '2.5rem',
          }}
        >

          ProveOps

        </h1>

        <p
          style={{

            textAlign: 'center',

            opacity: 0.7,

            marginBottom:
              '35px',
          }}
        >

          Operational Intelligence Platform

        </p>

        <div>

          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            onKeyDown={
              handleEnterKey
            }
            placeholder="Enter email"
          />

        </div>

        <div>

          <label>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
           onKeyDown={handleEnterKey}
            placeholder="Enter password"
          />

        </div>

        <button
          type="button"
          onClick={login}
          style={{
            width: '100%',
            marginTop: '10px',
          }}
        >

          Login

        </button>

      </div>

    </div>
  )
}