<script setup>
// vue
import { useRouter } from "vue-router"
import { reactive } from "vue"

// components
import Input from "@/components/Input.vue"
import Button from "@/components/Button.vue"
import LoaderFullScreen from "@/components/LoaderFullScreen.vue"

// modules
import ContactsList from "@/components/Contacts/ContactsList.vue"
import CreateContact from "@/components/Contacts/CreateContact.vue"

// api
import { signOutApi } from "@/api/auth"
import { useContactsStore } from "../stores/contacts"

// router
const router = useRouter()

// global state
const { contacts } = useContactsStore()

// state
const state = reactive({
  showContactCreatePanel: false
})

// methods
const signOut = async () => {
  contacts.loading = true
  const response = await signOutApi()
  contacts.loading = false
  if (response === "success") {
    router.push("/login")
  }
}
</script>

<template>
  <main class="main">
    <LoaderFullScreen v-if="contacts.loading" />
    <Input
      v-model="contacts.searchText"
      type="text"
      placeholder="Найти контакт"
      search
      class="main__search"
    ></Input>
    <ContactsList />
    <Transition>
      <CreateContact
        v-if="state.showContactCreatePanel"
        @close="state.showContactCreatePanel = false"
      />
    </Transition>
    <div class="main__controllers">
      <Button
        type="button"
        class="main__controllers__btn"
        plus
        @click="state.showContactCreatePanel = !state.showContactCreatePanel"
        >Добавить контакт</Button
      >
      <Button type="button" @click="signOut">Выйти</Button>
    </div>
  </main>
</template>
<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: 0.2s;
  transform: translateX(0);
}

.v-enter-from,
.v-leave-to {
  transform: translateX(-100%);
}
</style>

<style lang="scss" scoped>
.main {
  height: calc(100vh - 100px);
  padding: 50px 180px;
  .main__search {
    margin-bottom: 50px;
  }
  .main__controllers {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    position: fixed;
    right: 50px;
    bottom: 30px;
    z-index: 2;
    .main__controllers__btn {
      margin-bottom: 10px;
    }
  }
}
</style>
