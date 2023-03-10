import { reactive } from "vue"
import { defineStore } from "pinia"

export const useContactsStore = defineStore("contacts", () => {
  // state
  const contacts = reactive({
    list: [],
    searchText: "",
    loading: false
  })

  return { contacts }
})
