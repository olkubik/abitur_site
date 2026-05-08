---
id: database
title: База данных
sidebar_position: 7
author: Лещевич Варвара
---

**Автор страницы:** Лещевич Варвара

## Назначение базы данных

База данных предназначена для хранения информации о программах, институтах, экзаменах, минимальных баллах и мероприятиях.

## Основные сущности

| Сущность | Назначение |
| --- | --- |
| `institutes` | институты и факультеты |
| `programs` | образовательные программы |
| `exams` | экзамены |
| `program_exams` | связь программ и экзаменов |
| `events` | мероприятия |

## ER-диаграмма

```mermaid
erDiagram
  institutes ||--o{ programs : has
  institutes ||--o{ events : organizes
  programs ||--o{ program_exams : requires
  exams ||--o{ program_exams : used_in

  institutes {
    int id PK
    nvarchar name
  }

  programs {
    int id PK
    int institute_id FK
    nvarchar code
    nvarchar name
    nvarchar degree_level
    int duration_years
    nvarchar study_form
    int tuition_fee
    int budget_places
    int paid_places
    int passing_score
  }

  exams {
    int id PK
    nvarchar name
    nvarchar level
  }

  program_exams {
    int program_id PK, FK
    int exam_id PK, FK
    int min_score
  }

  events {
    int id PK
    int institute_id FK
    nvarchar name
    date event_date
    time event_time
    nvarchar description
  }
```

## SQL Server

Для курсовой базы данных выбрана Microsoft SQL Server. Она поддерживает внешние ключи, ограничения целостности, индексы и язык SQL.

## Индексы

```sql
CREATE INDEX IX_programs_institute_id ON programs(institute_id);
CREATE INDEX IX_programs_passing_score ON programs(passing_score);
CREATE INDEX IX_programs_study_form ON programs(study_form);
CREATE INDEX IX_program_exams_exam_id ON program_exams(exam_id);
```
