# Minecraft Live Bingo

Небольшое приложение на Vue + Vite для bingo-карточки во время трансляции Minecraft Live. Карточка генерируется случайно, хранится в `localStorage` и умеет быстро копировать текущий прогресс в буфер обмена.

## Что уже есть
- адаптивное поле 5x5 без развала логики бинго на мобильных экранах
- автосохранение состояния в браузере
- подсветка собранных линий и отметка отмеченных клеток галочкой
- кнопка для копирования текущего статуса карточки
- кнопка запуска конфетти
- деплой на GitHub Pages через GitHub Actions

## Стек
- Vue 3
- Vite 5
- Bun

## Шрифты
- **Monocraft** — пиксельный акцентный шрифт для подписей, кнопок и значений
  ([IdreesInc/Monocraft](https://github.com/IdreesInc/Monocraft), SIL Open Font License 1.1), файл лежит в `assets/Monocraft.ttf`
- **Manrope** — основной шрифт интерфейса и текста клеток, подключён через Google Fonts в `index.html`

## Локальный запуск
```powershell
cd путь-к-клону-репозитория
bun install
bun run dev
```

Приложение поднимется на `http://localhost:5173`.

## Сборка
```powershell
bun run build
```

## Деплой
Сайт публикуется на GitHub Pages по адресу **https://bingo.ruina.team** через workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), который:

1. устанавливает Bun
2. собирает приложение
3. публикует `dist` в GitHub Pages

### Что уже подготовлено в репозитории
- `public/CNAME` — файл с доменом `bingo.ruina.team`, попадает в корень сборки
- `vite.config.js` — читает `BASE_URL` от `actions/configure-pages`: пустое значение
  (кастомный домен) превращается в `/`, а путь вида `/repo` — в base для project pages
- `index.html` — `canonical`, Open Graph и `twitter:card` с абсолютным адресом домена,
  картинка для превью лежит в `public/og-image.webp`
- workflow не передаёт `static_site_generator` в `configure-pages`: конфиг Vite
  настраивается вручную, без автоправок со стороны экшена

### Разовая настройка на GitHub
1. **Settings → Pages → Build and deployment → Source**: выбрать `GitHub Actions`.
2. **Settings → Pages → Custom domain**: вписать `bingo.ruina.team` и сохранить.
   Для Actions-деплоя домен задаётся именно здесь: файл `CNAME` в артефакте сам
   по себе домен не включает.
3. Дождаться проверки DNS и включить **Enforce HTTPS**.
4. В DNS у домена `ruina.team` добавить запись:

   | Тип | Имя | Значение |
   | --- | --- | --- |
   | CNAME | `bingo` | `<владелец-репозитория>.github.io.` |

5. После первого успешного прогона workflow сайт открывается на `https://bingo.ruina.team`.

## Где менять контент
- список событий карточки: `src/components/bingo/data/predictions.js`
- логика и интерфейс поля: `src/components/bingo/`
- основная страница: `src/App.vue`
- токены шрифтов, цветов, радиусов и анимаций: `src/style.css`

## Идеи для следующих улучшений
- добавить free space в центре карточки
- добавить режимы карточки под конкретный сезон или тему
- экспортировать результат в изображение
- добавить отдельный экран для совместной игры с общим seed
