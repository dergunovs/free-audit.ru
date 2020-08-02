export const state = () => ({
  resultPassword: ""
});

export const mutations = {
  toggleAdminMenu(state, payload) {
    state.resultPassword = payload;
  }
};
