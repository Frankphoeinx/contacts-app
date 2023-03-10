import { isAuthorized } from "../api/auth.js"
import { createRouter, createWebHistory } from "vue-router"

import HomeView from "../views/HomeView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/login",
      name: "login",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/LoginView.vue")
    },

    {
      path: "/contacts/:id",
      name: "contact",
      component: () => import("../views/ContactView.vue")
    }
  ]
})

router.beforeEach(async (to) => {
  if (to.name === "login") return true
  return await isAuthorized()
})

export default router
