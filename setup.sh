if [ -f .env.example ]; then
  echo "Создаю .env файл..."
  cp .env.example .env
  echo ".env файл успешно создан."
else
  echo "Файл .env.example не найден!"
  exit 1
fi

echo "Запускаю docker compose up -d..."
docker compose up -d

if [ $? -eq 0 ]; then
  echo "Контейнеры запущены успешно."
else
  echo "Ошибка при запуске контейнеров."
  exit 1
fi
