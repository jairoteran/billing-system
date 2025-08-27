import { useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useSupabaseRealtime(
  table: string,
  callback: () => void,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
) {
  const handleChange = useCallback(() => {
    callback()
  }, [callback])

  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes' as any,
        {
          event,
          schema: 'public',
          table,
        },
        handleChange
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, event, handleChange])
}
