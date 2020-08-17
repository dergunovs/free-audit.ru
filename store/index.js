export const state = () => ({
  resultPassword: "",
  mainVersion: ""
});

export const mutations = {
  toggleAdminMenu(state, payload) {
    state.resultPassword = payload;
  },
  saveMainVersion(state, payload) {
    state.mainVersion = payload;
  }
};
