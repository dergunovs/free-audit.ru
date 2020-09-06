<template>
  <div class="text-center">
    <h1>О проекте</h1>
    <p>Free-audit.ru - это бесплатный open source сервис по самостоятельному аудита сайта.</p>
    <p>
      Разработка сервиса происходит в прямом эфире
      <a href="https://www.youtube.com/playlist?list=PLOICX-WjKEZetz86Evsf7pvVd6qzGT_rg" target="_blank">на ютубе.</a>
    </p>
    <p>Автор проекта Александр Дергунов.</p>
    <h2>Контакты</h2>
    <p>Сайт: <a href="https://dergunov.com" target="_blank">dergunov.com</a></p>
    <p>Электронная почта: <a href="mailto:a@dergunov.com" target="_blank">a@dergunov.com</a></p>
    <p>Мессенджер: <a href="https://t.me/dergunovs" target="_blank">Телеграм</a></p>
    <p>
      Социальные сети: <a href="https://vk.com/dergunov_alexandr" target="_blank">ВКонтакте</a> и
      <a href="https://www.facebook.com/dergunovs" target="_blank">Фейсбук</a>
    </p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  head: {
    title: "О сервисе free-audit.ru",
    meta: [
      {
        hid: "description",
        name: "description",
        content: "Информация о сервисе free-audit.ru - контакты, ссылка на исходный код"
      }
    ]
  }
};
</script>
