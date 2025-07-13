import axiosClient from "../axios";

export function getAllCategories({ commit }) {
  console.log("Hellooooo");
  return axiosClient
    .get("/category/getAllCategories")
    .then(({ data }) => {
      console.log("fhdhfhdfhs", data);
      commit("setGetAllCategories", data);
    })
    .catch(() => {
      console.log("fhdhfhdfhsErrro", data);
      commit("setGetAllCategories", [false]);
    });
}
