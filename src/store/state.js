export default {
  user: {
    token: sessionStorage.getItem("TOKEN"),
    data: {},
  },
  categories: {
    loading: false,
    data: [],
  },
};
