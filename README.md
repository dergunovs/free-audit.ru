# free-audit.ru

Сервис по бесплатному самостоятельному аудиту сайта.
Ссылка на прямые трансляции по разработке приложения https://www.youtube.com/channel/UC3Dtx3aaSDbNXJyph3y675Q

## Используемые технологии

Nuxt.js, Vue.js, Express.js, Mongoose.js, MongoDB.

### Установка

Предварительно нужно установить Node.js и MongoDB.

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

### Запуск в продакшене

```bash
npm run build
npm start
```

### Начало работы с приложением

- В корневой папке проекта нужно создать файл .env.
- Вписать secret для генерации JWT: SECRET=xxx.
- Логин администратора: LOGIN=xxx.
- Пароль администратора: PASSWORD=xxx.