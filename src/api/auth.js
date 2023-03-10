import { supabase } from "@/services/supabase.js"

export const getSessionApi = async () => {
  const {
    data: { session }
  } = await supabase.auth.getSession()
  return session
}

export const signUpApi = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  if (error) {
    let errorMessage = "Произошла ошибка, повторите попытку"
    if (error.message === "User already registered") {
      errorMessage = "Пользователь с данными параметрами уже создан"
    }
    return {
      error,
      errorMessage
    }
  }

  const { error: errorUsers } = await supabase.from("users").insert({
    id: data.user.id,
    email: data.user.email,
    created_at: data.user.created_at
  })

  if (errorUsers) {
    console.log("Не удалось создать экземпляр пользователя")
  }

  return data
}
export const signInApi = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    let errorMessage = "Произошла ошибка, повторите попытку"
    if (error.message === "Invalid login credentials") {
      errorMessage = "Пользователь не найден"
    }
    return {
      error,
      errorMessage
    }
  }

  return data
}

export const signOutApi = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    return {
      error,
      errorMessage: "Произошла ошибка, повторите попытку"
    }
  }
  return "success"
}
