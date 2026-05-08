---
id: api
title: API проекта
sidebar_position: 6
author: Белоусова Ольга
---

**Автор страницы:** Белоусова Ольга

## Реальный API MVP

Текущий API проекта работает через `json-server`.

Базовый адрес:

```text
http://localhost:3001
```

Спецификация доступна в файле:

[openapi.yaml](pathname:///files/openapi.yaml)

## Рабочие ручки

| Метод | URL | Назначение |
| --- | --- | --- |
| GET | `/programs` | получить программы |
| GET | `/programs/:id` | получить программу |
| POST | `/programs` | создать программу |
| PUT | `/programs/:id` | обновить программу |
| DELETE | `/programs/:id` | удалить программу |
| GET | `/institutes` | получить институты |
| GET | `/exams` | получить экзамены |
| GET | `/program_exams` | получить связи программ и экзаменов |
| GET | `/events` | получить мероприятия |

## Пример GET-запроса

```js
fetch('http://localhost:3001/programs')
  .then((response) => response.json())
  .then(console.log);
```

## Пример объекта программы

```json
{
  "id": "big-data",
  "institute_id": 1,
  "code": "09.03.01",
  "name": "Технологии разработки программного обеспечения и обработки больших данных",
  "degree_level": "Бакалавриат",
  "duration_years": 4,
  "study_form": "Очная",
  "tuition_fee": 220000,
  "budget_places": 10,
  "paid_places": 30,
  "passing_score": 259
}
```

## Ограничения MVP

В текущем API нет полноценной Bearer Token-авторизации. Она предусмотрена для будущей серверной версии. В MVP ручки можно проверять напрямую через браузер или консоль.

## N+1

В MVP данные программ, институтов и экзаменов хранятся отдельными коллекциями. Для полноценного backend необходимо возвращать связанные данные через JOIN-запрос, чтобы избежать проблемы N+1.
