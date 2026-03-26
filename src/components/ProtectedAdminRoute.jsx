import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProtectedAdminRoute({ children }) {
  const [state, setState] = useState({ loading: true, allowed: false })

  useEffect(() => {
    let ignore = false

    async function check() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        if (!ignore) setState({ loading: false, allowed: false })
        return
      }

      const { data } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!ignore) {
        setState({ loading: false, allowed: Boolean(data) })
      }
    }

    check()
    return () => {
      ignore = true
    }
  }, [])

  if (state.loading) {
    return <div className="center-screen">Loading...</div>
  }

  if (!state.allowed) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
