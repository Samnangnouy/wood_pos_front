import axiosClient from "../axios";

export function getUser({ commit }, data) {
  return axiosClient.get("/auth/me", data).then(({ data }) => {
    commit("setUser", data);
    return data;
  });
}

export function login({ commit }, data) {
  return axiosClient
    .post("/auth/login", data)
    .then(({ data }) => {
      commit("setUser", data.user);
      commit("setToken", data.token);
      return data;
    })
    .catch((error) => {
      return error;
    });
}

export function logout({ commit }) {
  return axiosClient.post("/auth/logout").then((response) => {
    commit("setToken", null);
    return response;
  });
}

export function getAllUsers() {
  return axiosClient
    .get("/user/getAllUsers")
    .then(({ data }) => {
      return data;
    })
    .catch(() => {
      console.log("Get All Products Fail", data);
    });
}

export function getAllProducts({ commit }) {
  return axiosClient
    .get("/product/getAllProducts")
    .then(({ data }) => {
      return data;
    })
    .catch(() => {
      console.log("Get All Products Fail", data);
    });
}

export function createUser({ commit }, user) {
  const form = new FormData();
  form.append("image", user.image);
  form.append("full_name", user.full_name);
  form.append("username", user.username);
  form.append("password", user.password);
  form.append("role", user.role);
  user = form;
  return axiosClient
    .post("/user/create", user)
    .then(({ data }) => {
      return data;
    })
    .catch(() => {
      console.log("Create User Fail", data);
    });
}

export function deleteUser({ commit }, userId) {
  return axiosClient
    .delete(`/user/delete/${userId}`)
    .then(({ data }) => {
      return data;
    })
    .catch(() => {
      console.log("Delete Product Fail", data);
    });
}

export function createProduct({ commit }, product) {
  const form = new FormData();
  form.append("image", product.image);
  form.append("name", product.name);
  form.append("description", product.description);
  form.append("category_id", product.category_id);
  form.append("price", product.price);
  form.append("cost", product.cost);
  form.append("status", product.status);
  form.append("created_by", product.created_by);
  form.append("updated_by", product.updated_by);
  product = form;
  return axiosClient
    .post("/product/create", product)
    .then(({ data }) => {
      return data;
    })
    .catch(() => {
      console.log("Create Product Fail", data);
    });
}

export function updateProduct({ commit }, product) {
  const form = new FormData();
  form.append("image", product.image);
  form.append("name", product.name);
  form.append("description", product.description);
  form.append("category_id", product.category_id);
  form.append("price", product.price);
  form.append("cost", product.cost);
  form.append("status", product.status);
  form.append("created_by", product.created_by);
  form.append("updated_by", product.updated_by);
  return axiosClient
    .put(`/product/update/${product.id}`, form)
    .then(({ data }) => {
      return data;
    })
    .catch(() => {
      console.log("Update Product Fail", data);
    });
}

export function deleteProduct({ commit }, productId) {
  return axiosClient
    .delete(`/product/delete/${productId}`)
    .then(({ data }) => {
      return data;
    })
    .catch(() => {
      console.log("Delete Product Fail", data);
    });
}

export function getAllCategories({ commit }) {
  return axiosClient
    .get("/category/getAllCategories")
    .then(({ data }) => {
      return data;
    })
    .catch(() => {
      console.log("Get All Categories Fail", data);
    });
}

export function createCategory({ commit }, category) {
  return axiosClient
    .post("/category/create", category)
    .then(({ data }) => {
      return data;
    })
    .catch(() => {
      console.log("Create Category Fail", data);
    });
}

export function updateCategory({ commit }, category) {
  return axiosClient
    .put(`/category/update/${category.id}`, category)
    .then(({ data }) => {
      return data;
    })
    .catch(() => {
      console.log("Update Category Fail", data);
    });
}

export function deleteCategory({ commit }, categoryId) {
  return axiosClient
    .delete(`/category/delete/${categoryId}`)
    .then(({ data }) => {
      return data;
    })
    .catch(() => {
      console.log("Delete Category Fail", data);
    });
}
