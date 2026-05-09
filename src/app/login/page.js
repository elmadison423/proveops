'use client'

import {
  useState,
} from 'react'

import {
  useRouter,
} from 'next/navigation'

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

  async function signIn() {

    const { error } =
      await supabase.auth
        .signInWithPassword({

          email,

          password,
        })

    if (error) {

      alert(error.message)

    } else {

      router.push('/')
    }
  }

  async function signUp() {

    const { error } =
      await supabase.auth
        .signUp({

          email,

          password,
        })

    if (error) {

      alert(error.message)

    } else {

      alert(
        'Account created successfully'
      )
    }
  }

  return (

    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f4f4f4',
      }}
    >

      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          width: '350px',
          boxShadow:
            '0 0 10px rgba(0,0,0,0.1)',
        }}
      >

        <h1
          style={{
            marginBottom: '20px',
          }}
        >

          ProveOps Login

        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
          }}
        />

        <button
          type="button"
          onClick={signIn}
          style={{
            width: '100%',
            padding: '12px',
            background: '#0b1736',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >

          Sign In

        </button>

        <button
          type="button"
          onClick={signUp}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '10px',
            background: '#1f5eff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >

          Create Account

        </button>

      </div>

    </div>
  )
}