# free-audit.ru

Сервис по бесплатному самостоятельному аудиту сайта.
Ссылка на прямые трансляции по разработке приложения https://www.youtube.com/channel/UC3Dtx3aaSDbNXJyph3y675Q

## Используемые технологии

Nuxt.js, Vue.js, Express.js, Mongoose.js, MongoDB. Рекомендуемый редактор VS Code + Prettier.

### Установка

Предварительно нужно установить Node.js и MongoDB. Затем в консоли прописать:

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

Например:

```bash
SECRET=g0hv3003ubhgv3g3tg
LOGIN=admin
PASSWORD=gnm90ubne
```
