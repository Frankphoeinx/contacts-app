<script setup>
// vue
import { reactive } from "@vue/reactivity"
import { onBeforeMount } from "vue"
import { RouterLink, useRoute } from "vue-router"

// components
import Input from "@/components/Input.vue"
import Button from "@/components/Button.vue"
import Tag from "@/components/Tag.vue"
import ErrorMassage from "@/components/ErrorMessage.vue"
import UploadAvatar from "@/components/UploadAvatar.vue"
import LoaderFullScreen from "@/components/LoaderFullScreen.vue"

// store
import { useUserStore } from "../stores/user"

// api
import {
  fetchContactDetailApi,
  updateContactsApi,
  deleteImageApi,
  uploadImageApi
} from "@/api/contacts.js"

// vuelidate
import { useVuelidate } from "@vuelidate/core"
import { required, email, helpers } from "@vuelidate/validators"

// router
const route = useRoute()

//global state
const { user, getSession } = useUserStore()

// state
const state = reactive({
  contact: null,
  tag: "",
  imageURL: "",
  imageFile: null,
  errorMessage: "",
  loading: false
})

const rules = {
  name: {
    required: helpers.withMessage("Обязательное поле", required)
  },
  phone: {
    required: helpers.withMessage("Обязательное поле", required)
  },
  email: {
    required: helpers.withMessage("Обязательное поле", required),
    email: helpers.withMessage("Невалидный email", email)
  }
}

let v$ = useVuelidate(rules, state.contact)

// methods
const fetchContact = async () => {
  state.loading = true
  const response = await fetchContactDetailApi(user.data.id, route.params.id)

  state.loading = false
  if (response.error) {
    throw response.error
  }

  state.contact = response[0]
  state.imageURL = state.contact.avatar

  v$ = useVuelidate(rules, state.contact)
}

const addTag = () => {
  if (state.contact.tags.some((tag) => tag === state.tag)) return
  state.contact.tags.push(state.tag)
  state.tag = ""
}

const removeTag = (index) => state.contact.tags.splice(index, 1)

const uploadFiles = (e) => {
  let files = e.target.files
  if (!files[0]) return

  if (state.imageURL) {
    URL.revokeObjectURL(state.imageURL)
  }
  state.imageURL = window.URL.createObjectURL(files[0])
  state.imageFile = files[0]

  e.target.value = ""
}

const saveContact = async (e) => {
  v$.value.$validate()
  if (v$.value.$error) return
  state.loading = true

  let contact = {
    id: state.contact.id,
    userId: user.data.id,
    tags: state.contact.tags,
    email: state.contact.email,
    phone: state.contact.phone,
    name: state.contact.name
  }

  // upload image
  if (state.imageFile) {
    // delete old image
    if (state.contact.avatar) {
      const deleteRes = await deleteImageApi(state.contact.avatar)

      if (deleteRes.error) {
        state.loading = false
        state.errorMessage = deleteRes.errorMessage
        return
      }
    }

    // upload new image
    const uploadRes = await uploadImageApi(state.imageFile)
    if (uploadRes.error) {
      state.loading = false
      state.errorMessage = uploadRes.errorMessage
      return
    }
    contact.avatar = uploadRes
  }

  // create contact
  const createRes = await updateContactsApi(contact)

  if (createRes.error) {
    state.errorMessage = createRes.errorMessage
    return
  }

  state.loading = false
}

// mounted
onBeforeMount(async () => {
  await getSession()
  fetchContact()
})
</script>

<template>
  <div class="contact">
    <LoaderFullScreen v-if="state.loading" />
    <div class="contact__wrapper">
      <div v-if="state.contact" class="contact__detail">
        <UploadAvatar
          :src="state.imageURL"
          width="200px"
          class="contact__detail__avatar"
          @change="uploadFiles"
        />

        <form @submit.prevent class="contact__detail__form">
          <Input
            v-model="state.contact.name"
            label="Ф.И.О"
            placeholder="Введите Ф.И.О"
            dark
            name="name"
            class="contact__detail__input"
            :errorMessage="v$.name.$error && v$.name.$errors[0].$message"
          ></Input>
          <Input
            v-model="state.contact.phone"
            label="Номер телефона"
            placeholder="Введите номер телефона"
            dark
            name="phone"
            class="contact__detail__input"
            :pattern="/[^+\d]/g"
            :errorMessage="v$.phone.$error && v$.phone.$errors[0].$message"
          ></Input>
          <Input
            v-model="state.contact.email"
            label="Email"
            placeholder="Введите Email"
            dark
            name="email"
            class="contact__detail__input"
            :errorMessage="v$.email.$error && v$.email.$errors[0].$message"
          ></Input>
          <Input
            v-model="state.tag"
            label="Тег"
            placeholder="Введите тег и нажмите Enter"
            dark
            name="tag"
            class="contact__detail__input"
            @enter="addTag"
          ></Input>
          <div class="contact__detail__tags">
            <Tag
              closable
              v-for="(tag, index) in state.contact.tags"
              :key="tag"
              class="tag"
              @onClick="removeTag(index)"
              >{{ tag }}</Tag
            >
          </div>

          <ErrorMassage>{{ state.errorMessage }}</ErrorMassage>

          <Button type="button" @click="saveContact" class="contact__detail__btn">Сохранить</Button>
        </form>
      </div>

      <div v-if="!state.contact && !state.loading" class="contact__notfound">
        Контакт не найден. Вернуться к
        <RouterLink to="/">контактам</RouterLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contact {
  height: 100vh;
  padding: 50px 185px;
  .contact__wrapper {
    padding: 25px 75px;
    background: #ffffff;
    border-radius: 15px;
  }
  .contact__detail {
    display: flex;
    align-items: flex-end;
    .contact__detail__avatar {
      align-self: start;
    }
    .contact__detail__form {
      padding-left: 30px;
      width: 100%;
    }
    .contact__detail__input {
      margin-bottom: 20px;
    }
    .contact__detail__tags {
      display: flex;
      flex-wrap: wrap;
      .tag {
        margin-right: 10px;
      }
    }
    .contact__detail__btn {
      margin-top: 30px;
      margin-left: auto;
    }
  }
  .contact__notfound {
    text-align: center;
    color: #585252;
    a {
      font-weight: bold;
      &:hover {
        color: #383838;
      }
    }
  }
}
</style>
