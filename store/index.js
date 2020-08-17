export const state = () => ({
  resultPassword: "",
  urlPrefix: ""
});

export const mutations = {
  toggleAdminMenu(state, payload) {
    state.resultPassword = payload;
  },
  saveUrlPrefix(state, payload) {
    state.urlPrefix = payload;
  }
};
