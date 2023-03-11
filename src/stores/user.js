import { defineStore } from "pinia"
import { reactive } from "vue"

// supabase
import { supabase } from "@/services/supabase.js"

export const useUserStore = defineStore("user", () => {
  const user = reactive({
    data: null
  })

  const getSession = async () => {
    const {
      data: { session },
      error
    } = await supabase.auth.getSession()
    if (!session || error) return
    user.data = session.user
  }

  return { user, getSession }
})
