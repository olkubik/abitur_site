---
id: diagrams
title: UML и приложения
sidebar_position: 8
author: Нистор Анна
---

**Автор страницы:** Нистор Анна

## Диаграмма вариантов использования

```mermaid
flowchart LR
  Applicant[Абитуриент]
  Admin[Администратор]
  Commission[Приемная комиссия]

  Programs((Просмотр программ))
  Filter((Фильтрация программ))
  Detail((Карточка программы))
  Dorms((Общежития))
  Edit((Редактирование данных))
  Events((Мероприятия))

  Applicant --> Programs
  Applicant --> Filter
  Applicant --> Detail
  Applicant --> Dorms
  Admin --> Edit
  Commission --> Events
```

## Диаграмма компонентов

```mermaid
flowchart TB
  UI[React UI]
  AdminPanel[Админ-панель]
  Api[REST API]
  DbJson[(db.json)]
  Sql[(SQL Server модель)]
  Docs[Docusaurus]

  UI --> Api
  AdminPanel --> Api
  Api --> DbJson
  Sql -. проектная БД .-> Api
  Docs -. описывает .-> UI
  Docs -. описывает .-> Api
```

## Диаграмма последовательности выбора программы

```mermaid
sequenceDiagram
  actor A as Абитуриент
  participant UI as React
  participant API as json-server
  participant Data as db.json

  A->>UI: Открывает страницу выбора программы
  UI->>API: GET /programs
  API->>Data: Читает programs
  Data-->>API: Возвращает список
  API-->>UI: JSON
  UI-->>A: Показывает карточки
  A->>UI: Выбирает программу
  UI->>API: GET /programs/:id
  API-->>UI: Данные программы
```

## Загруженная ER-диаграмма

![ER-диаграмма](/img/uml_bd.png)

## Приложения

- OpenAPI-спецификация: [openapi.yaml](pathname:///files/openapi.yaml)
- SQL-скрипты находятся в папке `sqlserver` основного проекта.
- Проверочные запросы API находятся в `api/console-tests.md`.
