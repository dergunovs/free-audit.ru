export const state = () => ({
  urlPrefix: "",
  auditId: "",
});

export const actions = {
  async nuxtServerInit({ commit, dispatch }) {
    await dispatch("getAuditId");
  },
  async getAuditId({ commit }) {
    const { data } = await this.$axios.get(`/api/audit`);
    commit("setAuditId", data._id);
  },
};

export const mutations = {
  saveUrlPrefix(state, payload) {
    state.urlPrefix = payload;
  },
  setAuditId(state, message) {
    state.auditId = message;
  },
};
