<template>
  <div>
    <h1>Войти в админку</h1>
    <div class="admin-form">
      <div class="form-group w25">
        <label for="login">Логин</label>
        <input type="text" name="login" v-model="login.user" class="admin-input" />
      </div>
      <div class="form-group w25">
        <label for="password">Пароль</label>
        <input type="password" name="password" v-model="login.password" class="admin-input" />
      </div>
    </div>
    <div class="admin-form">
      <div class="form-group w12">
        <input type="submit" v-on:click="userLogin" value="Войти" class="admin-input admin-button " />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login: {
        user: "",
        password: ""
      }
    };
  },
  head() {
    return {
      meta: [{ name: "robots", content: "noindex,nofollow" }]
    };
  },
  methods: {
    async userLogin() {
      try {
        let response = await this.$auth.loginWith("local", {
          data: this.login
        });
        this.$toast.success("Добро пожаловать!", { duration: 1000 });
      } catch (err) {
        this.$toast.error(err.response.data.message, { duration: 5000 });
      }
    }
  }
};
</script>
