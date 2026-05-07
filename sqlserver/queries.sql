-- Все программы с институтами.
SELECT
  p.id,
  p.code,
  p.name AS program_name,
  i.name AS institute_name,
  p.study_form,
  p.budget_places,
  p.paid_places,
  p.passing_score,
  p.tuition_fee
FROM programs p
JOIN institutes i ON i.id = p.institute_id
ORDER BY p.passing_score DESC;

-- Поиск программ, куда проходит абитуриент по сумме баллов.
DECLARE @ApplicantScore INT = 250;

SELECT
  code,
  name,
  study_form,
  passing_score,
  budget_places,
  tuition_fee
FROM programs
WHERE passing_score <= @ApplicantScore
ORDER BY passing_score DESC;

-- Фильтр по форме обучения.
SELECT
  code,
  name,
  passing_score,
  budget_places
FROM programs
WHERE study_form = N'Очная'
ORDER BY budget_places DESC;

-- Фильтр по предмету ЕГЭ.
SELECT
  p.code,
  p.name,
  e.name AS exam_name,
  pe.min_score
FROM programs p
JOIN program_exams pe ON pe.program_id = p.id
JOIN exams e ON e.id = pe.exam_id
WHERE e.name = N'Математика'
ORDER BY p.name;

-- Карточка одной программы для страницы подробностей.
SELECT
  p.code,
  p.name,
  p.degree_level,
  p.duration_years,
  p.study_form,
  p.passing_score,
  p.budget_places,
  p.paid_places,
  p.tuition_fee,
  i.name AS institute_name,
  STRING_AGG(CONCAT(e.name, N' от ', pe.min_score, N' баллов'), N', ') AS exams
FROM programs p
JOIN institutes i ON i.id = p.institute_id
LEFT JOIN program_exams pe ON pe.program_id = p.id
LEFT JOIN exams e ON e.id = pe.exam_id
WHERE p.id = 1
GROUP BY
  p.id,
  p.code,
  p.name,
  p.degree_level,
  p.duration_years,
  p.study_form,
  p.passing_score,
  p.budget_places,
  p.paid_places,
  p.tuition_fee,
  i.name;

-- События институтов.
SELECT
  i.name AS institute_name,
  e.name AS event_name,
  e.event_date,
  e.event_time,
  e.description
FROM events e
JOIN institutes i ON i.id = e.institute_id
WHERE e.event_date >= CAST(GETDATE() AS DATE)
ORDER BY e.event_date, e.event_time;
