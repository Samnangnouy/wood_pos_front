import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import Order from "../views/Order.vue";
import ProductList from "../views/Products/ProductList.vue";
import CategoriesList from "../views/Categories/CategoriesList.vue";
import store from "../store";

const routes = [
  {
    path: "/app",
    name: "app.dashboard",
    component: Dashboard,
    title: "Dashboard",
  },
  { path: "/login", name: "login", component: Login, title: "Login" },
  { path: "/order", name: "order", component: Order, title: "Order" },
  {
    path: "/productlist",
    name: "productlist",
    component: ProductList,
    title: "Product List",
  },
  {
    path: "/categorieslist",
    name: "categorieslist",
    component: CategoriesList,
    title: "Categories List",
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: Login,

    // component: () => import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.user.token) {
    console.log("Hlekekekekek");
    next({ name: "login" });
  } else if (to.meta.requiresGuest && store.state.user.token) {
    console.log("Hlekekekekek");
    next({ name: "app.dashboard" });
  } else {
    next();
  }
});

export default router;
