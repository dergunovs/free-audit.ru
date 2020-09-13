<template>
  <div>
    Яндекс: 1) <a :href="`https://yandex.ru/search/?text=host:${url}`" target="_blank">без www</a>, 2)
    <a :href="`https://yandex.ru/search/?text=host:www.${url}`" target="_blank">с www</a><br />
    Гугл: 1)
    <a :href="`https://www.google.com/search?q=site:${url}+-inurl:www+-inurl:https`" target="_blank">без www</a>, 2)
    <a :href="`https://www.google.com/search?q=site:${url}+inurl:www+-inurl:https`" target="_blank">с www</a>, 3)
    <a :href="`https://www.google.com/search?q=site:${url}+-inurl:www+inurl:https`" target="_blank">без www + https</a>,
    4) <a :href="`https://www.google.com/search?q=site:${url}+inurl:www+inurl:https`" target="_blank">с www + https</a>
  </div>
</template>

<script>
export default {
  props: ["url", "answers"]
};
</script>
