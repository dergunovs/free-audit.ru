# free-audit.ru

Сервис по бесплатному самостоятельному аудиту сайта.
Ссылка на прямые трансляции по разработке приложения https://www.youtube.com/channel/UC3Dtx3aaSDbNXJyph3y675Q

### Используемые технологии

Nuxt.js, Vue.js, Express.js, Mongoose.js, MongoDB.

### Установка

Предварительно установите Node.js и MongoDB. Затем в консоли пропишите:

```bash
npm install
```

### Настройка глобальных переменных

В корневой папке проекта создайте файл ".env". В нём укажите:

- BASE_URL: домен вашего сайта
- TINY_KEY: API ключ tinyMCE - бесплатно получите на сайте tiny.cloud
- SECRET: ключ для генерации JsonWebToken
- LOGIN: логин администратора
- PASSWORD: пароль администратора
- EMAIL_SMTP: сервер SMTP
- EMAIL_USER: логин почты для отправки сообщений
- EMAIL_PASSWORD: пароль почты для отправки сообщений

Например:

```bash
BASE_URL=http://localhost:3000
TINY_KEY=er0yhb47t9nyr9g8hbur0rty
SECRET=g0hv3003ubhgv3g3tg
LOGIN=admin
PASSWORD=gnm90ubne
EMAIL_SMTP=smtp.yandex.ru
EMAIL_USER=mail@yandex.ru
EMAIL_PASSWORD=rh9r8rthg
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
