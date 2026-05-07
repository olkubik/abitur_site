# Деплой проекта на VDS Ubuntu

Проект состоит из двух частей:

- React-приложение собирается в папку `dist` и раздается через Nginx.
- `json-server` читает `db.json` и работает как демонстрационный REST API для программ и админ-панели.

В продакшене фронтенд обращается к API через путь `/api`. Локально используется файл `.env.development`:

```env
VITE_API_URL=http://localhost:3001
```

## 1. Установить зависимости на сервере

```bash
apt update
apt install -y nginx git curl
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
npm install -g pm2
```

## 2. Загрузить проект

Через GitHub:

```bash
cd /var/www
git clone https://github.com/USERNAME/REPOSITORY.git abitur_site
cd abitur_site
npm ci
npm run build
```

Если проекта еще нет на GitHub, сначала создать репозиторий и отправить туда исходники.

## 3. Запустить API

```bash
cd /var/www/abitur_site
pm2 start npm --name abitur-api -- run api:prod
pm2 save
pm2 startup
```

API будет доступен только внутри сервера на `127.0.0.1:3001`, а наружу его отдаст Nginx через `/api`.

## 4. Настроить Nginx

Создать файл:

```bash
nano /etc/nginx/sites-available/abitur_site
```

Вставить конфигурацию:

```nginx
server {
    listen 80;
    server_name example.ru www.example.ru;

    root /var/www/abitur_site/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Если домена пока нет, можно временно заменить строку:

```nginx
server_name example.ru www.example.ru;
```

на:

```nginx
server_name _;
```

Включить сайт:

```bash
ln -s /etc/nginx/sites-available/abitur_site /etc/nginx/sites-enabled/abitur_site
nginx -t
systemctl reload nginx
```

## 5. Открыть доступ

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

После этого сайт будет доступен по IP сервера или по домену.

## 6. HTTPS для домена

Когда домен уже направлен на IP сервера:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d example.ru -d www.example.ru
```
