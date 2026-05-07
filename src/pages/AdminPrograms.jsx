import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ProgramSchema } from '../types';
import {
  createProgram,
  deleteProgram,
  getInstitutes,
  getPrograms,
  updateProgram,
} from '../services/api';

const emptyProgram = {
  code: '',
  name: '',
  institute_id: '',
  degree_level: 'Бакалавриат',
  duration_years: 4,
  study_form: 'Очная',
  tuition_fee: 0,
  budget_places: 0,
  paid_places: 0,
  passing_score: 0,
};

const adminCopy = {
  ru: {
    home: 'Главная',
    admin: 'Админ-панель',
    title: 'Управление программами',
    note: 'Данные сохраняются в db.json через json-server. Для курсовой структура базы описана в SQL Server-скриптах.',
    code: 'Код',
    name: 'Название',
    institute: 'Институт',
    chooseInstitute: 'Выберите институт',
    level: 'Уровень',
    duration: 'Срок обучения',
    form: 'Форма обучения',
    fee: 'Стоимость в год, ₽',
    budget: 'Бюджетные места',
    paid: 'Платные места',
    score: 'Проходной балл / ориентир',
    rowForm: 'Форма',
    rowDuration: 'Срок',
    rowBudget: 'Бюджет',
    rowPaid: 'Платные',
    rowScore: 'Балл',
    add: 'Добавить программу',
    save: 'Сохранить изменения',
    cancel: 'Отмена',
    list: 'Программы в базе',
    search: 'Поиск по коду, названию, институту',
    edit: 'Изменить',
    delete: 'Удалить',
    notFound: 'Институт не найден',
    years: ['4 года', '5 лет', '6 лет'],
    yearShort: 'г.',
  },
  en: {
    home: 'Home',
    admin: 'Admin',
    title: 'Program Management',
    note: 'Data is saved to db.json through json-server. The course database structure is described in SQL Server scripts.',
    code: 'Code',
    name: 'Program name',
    institute: 'Institute',
    chooseInstitute: 'Choose institute',
    level: 'Level',
    duration: 'Study period',
    form: 'Study format',
    fee: 'Tuition per year, RUB',
    budget: 'State-funded places',
    paid: 'Paid places',
    score: 'Passing score / reference',
    rowForm: 'Format',
    rowDuration: 'Period',
    rowBudget: 'State-funded',
    rowPaid: 'Paid',
    rowScore: 'Score',
    add: 'Add program',
    save: 'Save changes',
    cancel: 'Cancel',
    list: 'Programs in database',
    search: 'Search by code, title or institute',
    edit: 'Edit',
    delete: 'Delete',
    notFound: 'Institute not found',
    years: ['4 years', '5 years', '6 years'],
    yearShort: 'yr.',
  },
};

const adminProgramNamesEn = {
  'applied-math': 'Applied Mathematics and Computer Science',
  'big-data': 'Software Development and Big Data Processing Technologies',
  'design-tech': 'Information Technologies in Design',
  'music-sound': 'Information Technologies in Music and Sound Design',
  'music-sound-distance': 'Information Technologies in Music and Sound Design',
  math: 'Mathematics',
  'ai-education': 'Computer Science and Information Technologies in Education',
  'math-physics': 'Mathematics and Physics',
};

const adminInstituteNamesEn = {
  'Институт информационных технологий и технологического образования': 'Institute of Information Technology and Technological Education',
  'Факультет математики': 'Faculty of Mathematics',
};

const adminValueLabels = {
  'Бакалавриат': { ru: 'Бакалавриат', en: "Bachelor's degree" },
  'Специалитет': { ru: 'Специалитет', en: 'Specialist degree' },
  'Магистратура': { ru: 'Магистратура', en: "Master's degree" },
  'Аспирантура': { ru: 'Аспирантура', en: 'Postgraduate studies' },
  'Очная': { ru: 'Очная', en: 'Full-time' },
  'Заочная': { ru: 'Заочная', en: 'Part-time' },
  'Очно-заочная': { ru: 'Очно-заочная', en: 'Blended' },
};

function valueLabel(value, lang) {
  return adminValueLabels[value]?.[lang] || value;
}

function programTitle(program, lang) {
  if (lang === 'ru') {
    return program.name;
  }

  return program.nameEn || adminProgramNamesEn[program.id] || program.name;
}

function instituteTitle(institute, lang) {
  if (!institute) {
    return '';
  }

  if (lang === 'ru') {
    return institute.name;
  }

  return institute.nameEn || adminInstituteNamesEn[institute.name] || institute.name;
}

function AdminPrograms({ lang = 'ru' }) {
  const [programs, setPrograms] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const text = adminCopy[lang];

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(ProgramSchema),
    defaultValues: emptyProgram,
  });

  async function loadData() {
    const [programsData, institutesData] = await Promise.all([getPrograms(), getInstitutes()]);
    setPrograms(programsData);
    setInstitutes(institutesData);
  }

  useEffect(() => {
    let isMounted = true;

    Promise.all([getPrograms(), getInstitutes()])
      .then(([programsData, institutesData]) => {
        if (!isMounted) {
          return;
        }

        setPrograms(programsData);
        setInstitutes(institutesData);
      })
      .catch(() => {
        if (isMounted) {
          setError('Не удалось подключиться к API. Запустите npm run start.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function onSubmit(data) {
    setError('');

    try {
      if (editingId) {
        await updateProgram(editingId, { ...data, id: editingId });
      } else {
        await createProgram({
          ...data,
          id: data.id || crypto.randomUUID(),
        });
      }

      reset(emptyProgram);
      setEditingId(null);
      await loadData();
    } catch {
      setError('Не удалось сохранить программу.');
    }
  }

  function startEdit(program) {
    setEditingId(program.id);
    reset(program);
  }

  async function removeProgram(id) {
    setError('');

    try {
      await deleteProgram(id);
      await loadData();
    } catch {
      setError('Не удалось удалить программу.');
    }
  }

  function cancelEdit() {
    setEditingId(null);
    reset(emptyProgram);
  }

  const filteredPrograms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return programs;
    }

    return programs.filter((program) => {
      const institute = institutes.find((item) => Number(item.id) === Number(program.institute_id));
      return `${program.code} ${program.name} ${programTitle(program, 'en')} ${institute?.name || ''} ${instituteTitle(institute, 'en')}`
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [institutes, programs, query]);

  return (
    <main className="admin-page">
      <div className="plain-page">
        <div className="breadcrumbs">
          <a href="#about">{text.home}</a>
          <strong>{text.admin}</strong>
        </div>

        <h1>{text.title}</h1>
        <p className="admin-note">
          {text.note}
        </p>

        {error && <p className="admin-error">{error}</p>}

        <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
          <label>
            {text.code}
            <input placeholder="09.03.01" {...register('code')} />
          </label>

          <label className="admin-form-wide">
            {text.name}
            <input placeholder={text.name} {...register('name')} />
          </label>

          <label>
            {text.institute}
            <select {...register('institute_id')}>
              <option value="">{text.chooseInstitute}</option>
              {institutes.map((institute) => (
                <option key={institute.id} value={institute.id}>
                  {institute.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            {text.level}
            <select {...register('degree_level')}>
              <option value="Бакалавриат">{valueLabel('Бакалавриат', lang)}</option>
              <option value="Специалитет">{valueLabel('Специалитет', lang)}</option>
              <option value="Магистратура">{valueLabel('Магистратура', lang)}</option>
              <option value="Аспирантура">{valueLabel('Аспирантура', lang)}</option>
            </select>
          </label>

          <label>
            {text.duration}
            <select {...register('duration_years', { valueAsNumber: true })}>
              <option value={4}>{text.years[0]}</option>
              <option value={5}>{text.years[1]}</option>
              <option value={6}>{text.years[2]}</option>
            </select>
          </label>

          <label>
            {text.form}
            <select {...register('study_form')}>
              <option value="Очная">{valueLabel('Очная', lang)}</option>
              <option value="Заочная">{valueLabel('Заочная', lang)}</option>
              <option value="Очно-заочная">{valueLabel('Очно-заочная', lang)}</option>
            </select>
          </label>

          <label>
            {text.fee}
            <input min="0" step="100" type="number" placeholder="220000" {...register('tuition_fee', { valueAsNumber: true })} />
          </label>

          <label>
            {text.budget}
            <input min="0" type="number" {...register('budget_places', { valueAsNumber: true })} />
          </label>

          <label>
            {text.paid}
            <input min="0" type="number" {...register('paid_places', { valueAsNumber: true })} />
          </label>

          <label>
            {text.score}
            <input min="0" max="400" type="number" {...register('passing_score', { valueAsNumber: true })} />
          </label>

          <div className="admin-actions">
            <button type="submit">{editingId ? text.save : text.add}</button>
            {editingId && (
              <button type="button" onClick={cancelEdit}>
                {text.cancel}
              </button>
            )}
          </div>
        </form>

        <section className="admin-table">
          <div className="admin-list-header">
            <h2>{text.list}</h2>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.search} />
          </div>
          {filteredPrograms.map((program) => {
            const institute = institutes.find(
              (item) => Number(item.id) === Number(program.institute_id),
            );

            return (
              <article key={program.id}>
                <div>
                  <h3>
                    {program.code} {programTitle(program, lang)}
                  </h3>
                  <p>{institute ? instituteTitle(institute, lang) : text.notFound}</p>
                  <dl>
                    <div><dt>{text.rowForm}</dt><dd>{valueLabel(program.study_form, lang)}</dd></div>
                    <div><dt>{text.rowDuration}</dt><dd>{program.duration_years} {text.yearShort}</dd></div>
                    <div><dt>{text.rowBudget}</dt><dd>{program.budget_places}</dd></div>
                    <div><dt>{text.rowPaid}</dt><dd>{program.paid_places}</dd></div>
                    <div><dt>{text.rowScore}</dt><dd>{program.passing_score}</dd></div>
                  </dl>
                </div>
                <div className="admin-row-actions">
                  <button type="button" onClick={() => startEdit(program)}>
                    {text.edit}
                  </button>
                  <button type="button" onClick={() => removeProgram(program.id)}>
                    {text.delete}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}

export default AdminPrograms;
