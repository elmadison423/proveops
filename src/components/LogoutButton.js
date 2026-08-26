'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function LogoutButton() {

  const router = useRouter()

  async function handleLogout() {

    const { error } =
      await supabase.auth.signOut()

    if (error) {

      console.error(error)

      return
    }

    router.replace('/login')
  }

  return (

    <button
      onClick={handleLogout}
      className="sidebar-link"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: 'inherit',
        font: 'inherit',
      }}
    >

      <LogOut size={20} />

      <span>Logout</span>

    </button>

  )

}