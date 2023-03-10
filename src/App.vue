<script setup>
// vue
import { RouterView } from "vue-router"
import { onBeforeMount } from "vue"

// store
import { useUserStore } from "@/stores/user"

// supabase
import { supabase } from "@/services/supabase.js"

// global state
const { user } = useUserStore()

// mounted
onBeforeMount(async () => {
  const {
    data: { session },
    error
  } = await supabase.auth.getSession()
  if (!session || error) return
  user.data = session.user
})
</script>

<template>
  <RouterView />
</template>
