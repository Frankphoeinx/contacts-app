<script setup>
// vue
import { RouterView } from "vue-router"
import { onBeforeMount } from "vue"

// store
import { useUserStore } from "@/stores/user"

// global state
const { getSession } = useUserStore()

// mounted
onBeforeMount(async () => {
  await getSession()
})
</script>

<template>
  <RouterView />
</template>
