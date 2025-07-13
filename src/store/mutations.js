export function setGetAllCategories(state, [loading, data = null]) {
  console.log("sdnfndnfdnfdfdf");
  if (data) {
    state.categories = {
      ...state.categories,
      data: data.data,
    };
  }

  state.categories.loading = loading;
}
