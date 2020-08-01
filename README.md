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

### Настройка глобальных переменных

В корневой папке проекта создайте файл ".env". В нём укажите:

- BASE_URL: домен вашего сайта
- TINY_KEY: API ключ tinyMCE - бесплатно получите на сайте tiny.cloud
- SECRET: ключ для генерации JsonWebToken
- LOGIN: логин администратора
- PASSWORD: пароль администратора

Например:

```bash
BASE_URL=http://localhost:3000
TINY_KEY=er0yhb47t9nyr9g8hbur0rty
SECRET=g0hv3003ubhgv3g3tg
LOGIN=admin
PASSWORD=gnm90ubne
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
