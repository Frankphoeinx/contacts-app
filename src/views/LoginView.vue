<script setup>
// vue
import { useRouter } from "vue-router"
import { watch, reactive } from "vue"

// components
import Input from "@/components/Input.vue"
import Button from "@/components/Button.vue"
import LoaderFullScreen from "@/components/LoaderFullScreen.vue"
import ErrorMessage from "@/components/ErrorMessage.vue"

// api
import { signUpApi, signInApi } from "@/api/auth.js"

// vuelidate
import { useVuelidate } from "@vuelidate/core"
import { required, email, minLength, helpers } from "@vuelidate/validators"

// router
const router = useRouter()

// state
const state = reactive({
  signIn: false,
  email: "",
  password: "",
  loading: false,
  errorMessage: ""
})

const rules = {
  email: {
    required: helpers.withMessage("Обязательное поле", required),
    email: helpers.withMessage("Невалидный email", email)
  },
  password: {
    required: helpers.withMessage("Обязательное поле", required),
    minLength: helpers.withMessage("Пароль должен состоять минимум из 6 символов", minLength(6))
  }
}

const v$ = useVuelidate(rules, state)

// watchers
watch([() => state.signIn, () => state.email, () => state.password], () => {
  state.errorMessage = ""
})

// method
const auth = () => {
  v$.value.$validate()
  if (v$.value.$error) return
  if (state.signIn) {
    signIn()
    return
  }
  signUp()
}

const signIn = async () => {
  state.loading = true
  const response = await signInApi(state.email, state.password)
  !response.error ? router.push("/") : (state.errorMessage = response.errorMessage)
  state.loading = false
}

const signUp = async () => {
  state.loading = true
  const response = await signUpApi(state.email, state.password)
  !response.error ? router.push("/") : (state.errorMessage = response.errorMessage)
  state.loading = false
}
</script>

<template>
  <div class="login">
    <LoaderFullScreen v-if="state.loading" />
    <form class="login__form" @submit.prevent="auth">
      <h1 class="login__form__title">
        {{ state.signIn ? "Войти" : "Регистрация" }}
      </h1>
      <Input
        v-model="state.email"
        placeholder="Email"
        type="email"
        class="login__form__input"
        name="email"
        :errorMessage="v$.email.$error && v$.email.$errors[0].$message"
      ></Input>

      <Input
        v-model="state.password"
        placeholder="Пароль"
        type="password"
        class="login__form__input"
        name="password"
        :errorMessage="v$.password.$error && v$.password.$errors[0].$message"
      />

      <div v-if="state.signIn" class="login__form__toggler">
        Нет аккаунта? <span @click="state.signIn = false">Регистрация</span>
      </div>
      <div v-else class="login__form__toggler">
        Уже есть аккаунт? <span @click="state.signIn = true">Войти</span>
      </div>

      <ErrorMessage v-if="state.errorMessage" class="login__form__error">{{
        state.errorMessage
      }}</ErrorMessage>

      <Button type="submit" class="login__form__btn">
        {{ state.signIn ? "Войти" : "Зарегистрироваться" }}
      </Button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  .login__form {
    display: flex;
    flex-direction: column;
    width: 30%;
    .login__form__title {
      color: #ffffff;
      background: #8e8e8e;
      width: fit-content;
      margin: 0 auto;
      margin-bottom: 30px;
      padding: 10px 25px;
      font-size: 25px;
      border-radius: 20px;
    }
    .login__form__input {
      margin-bottom: 20px;
    }

    .login__form__toggler {
      margin-bottom: 30px;
      font-size: 15px;
      color: #535353;
      span {
        font-weight: bold;
        cursor: pointer;
        &:hover {
          color: #383838;
        }
      }
    }
    .login__form__error {
      margin-bottom: 15px;
    }
    .login__form__btn {
      margin: 0 auto;
    }
  }
}
</style>
