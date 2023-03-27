<script setup>
import { onMounted, reactive } from "vue"
import { onBeforeRouteLeave } from "vue-router"

// components
import Loader from "@/components/Loader.vue"

// modules
import ContactsListItem from "./ContactsListItem.vue"

// store
import { useContactsStore } from "../../stores/contacts"
import { useUserStore } from "../../stores/user"

// api
import { fetchContactsApi } from "@/api/contacts"
import { computed } from "@vue/reactivity"

// global state
const { contacts } = useContactsStore()
const { user, getSession } = useUserStore()

// state
const state = reactive({
  // так как supabase не предоставляет хорошие инструменты для фильтрации списка(не стал тратить время), решил поставить такой лимит и фильтровать локально уже полученные данные
  limit: 200,
  from: 0,
  to: 199,
  loading: true,
  allList: false
})

const filteredList = computed(() => {
  let list = []
  if (!contacts.searchText) {
    return contacts.list
  }
  let searchWords = contacts.searchText.split(" ").filter((word) => word)
  list = contacts.list.filter((contact) => {
    let name = contact.name.split(" ").map((namePart) => namePart.toLowerCase())
    let tags = contact.tags.map((tag) => tag.toLowerCase())
    let phone = contact.phone
    let email = contact.email

    return searchWords.some(
      (word) =>
        name.some((namePart) => namePart.includes(word.toLowerCase())) ||
        tags.some((tag) => tag.includes(word.toLowerCase())) ||
        phone.includes(word.toLowerCase()) ||
        email.includes(word.toLowerCase())
    )
  })
  return list
})

// methods
const fetchContacts = async () => {
  if (state.allList) return
  state.loading = true

  const response = await fetchContactsApi(user.data.id, state.from, state.to)

  state.loading = false
  if (response.error) {
    throw response.error
  }

  if (response.length) {
    contacts.list = contacts.list.concat(response)
  } else {
    state.allList = true
  }
}

const onScroll = (e) => {
  if (state.loading) return
  let top = Math.trunc(e.target.scrollHeight - e.target.scrollTop)
  if (top === e.target.clientHeight) {
    state.from = state.to + 1
    state.to = state.from + state.limit - 1
    fetchContacts()
  }
}

// mounted
onMounted(async () => {
  await getSession()
  fetchContacts()
})

onBeforeRouteLeave(() => {
  contacts.list = []
  contacts.searchText = ""
  contacts.loading = false
})
</script>

<template>
  <div class="contacts" @scroll="onScroll">
    <ContactsListItem v-for="contact in filteredList" :key="contact.id" :contact="contact" />
    <Loader v-if="state.loading" class="contacts__loader" />
  </div>
</template>
<style lang="scss" scoped>
.contacts {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100% - 100px);
  overflow: auto;
  padding-right: 10px;
  scroll-behavior: smooth;
  .contacts__loader {
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }
}
</style>
