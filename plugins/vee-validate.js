import Vue from "vue";
import { ValidationProvider, extend } from "vee-validate";

import {
  required,
  alpha_dash,
  alpha_spaces,
  max,
  min,
  email
} from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "Пожалуйста, заполните это поле"
});
extend("alpha_dash", {
  ...alpha_dash,
  message: "Символы и '-', '_'"
});
extend("alpha_spaces", {
  ...alpha_spaces,
  message: "Только буквы и пробелы"
});
extend("max", {
  ...max,
  message: "Много символов"
});
extend("min", {
  ...min,
  message: "Мало символов"
});
extend("email", {
  ...email,
  message: "Введите корректный email"
});


Vue.component("ValidationProvider", ValidationProvider);
