'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import { supabase } from '../lib/supabase'

const OrganizationContext = createContext()

export function OrganizationProvider({ children }) {

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)

async function loadUserData() {

  console.log("========== loadUserData ==========");

  setLoading(true)

  const {
    data: { user },
  } = await supabase.auth.getUser()
console.log("CURRENT USER ID:", user?.id);

  console.log("USER:", user);

    if (!user) {

      setUser(null)
      setProfile(null)
      setOrganization(null)
      setLoading(false)

      return
    }

    setUser(user)

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from('Profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      console.log("PROFILE:", profile);
console.log("PROFILE ERROR:", profileError);

      if (!profile) {

  setLoading(false);
  return;

}

    if (profileError) {

      console.error(profileError)
      setLoading(false)
      return
    }

    setProfile(profile)

    const {
      data: organization,
      error: orgError,
    } = await supabase
      .from('Organizations')
      .select('*')
      .eq('id', profile.organization_id)
      .single()
      console.log("ORGANIZATION:", organization);
console.log("ORG ERROR:", orgError);

    if (orgError) {

      console.error(orgError)
      setLoading(false)
      return
    }

    setOrganization(organization)

    setLoading(false)
  }
useEffect(() => {

  loadUserData();

  const {
    data: listener,
  } = supabase.auth.onAuthStateChange(

    async (event) => {

      console.log("Auth Event:", event);

if (
  event === "SIGNED_IN" ||
  event === "TOKEN_REFRESHED"
) {

  setTimeout(() => {

    loadUserData();

  }, 100);

}

      if (
        event === "SIGNED_OUT"
      ) {

        setUser(null);
        setProfile(null);
        setOrganization(null);
        setLoading(false);

      }

    }

  );

  return () => {

    listener.subscription.unsubscribe();

  };

}, []);
  
  return (

    <OrganizationContext.Provider
      value={{
        user,
        profile,
        organization,
        loading,
        refreshUser: loadUserData,
      }}
    >

      {children}

    </OrganizationContext.Provider>
  )
}

export function useOrganization() {

  return useContext(
    OrganizationContext
  )
}