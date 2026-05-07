import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import AdminPrograms from './pages/AdminPrograms';
import { getPrograms } from './services/api';
import 'leaflet/dist/leaflet.css';
import './App.css';

const sections = ['about', 'admission', 'life', 'graduates', 'faq'];

const defaultPrograms = [
  {
    id: 'applied-math',
    code: '01.03.02',
    name: 'Прикладная математика и информатика',
    nameEn: 'Applied Mathematics and Computer Science',
    score: 233,
    budget: 5,
    paid: true,
    form: 'Очная',
    formEn: 'Full-time',
    degree: 'Бакалавриат',
    degreeEn: "Bachelor's degree",
    price: 206280,
    subjects: ['Русский язык', 'Математика', 'Информатика или физика'],
    subjectsEn: ['Russian language', 'Mathematics', 'Computer science or physics'],
  },
  {
    id: 'big-data',
    code: '09.03.01',
    name: 'Технологии разработки программного обеспечения и обработки больших данных',
    nameEn: 'Software Development and Big Data Processing Technologies',
    score: 259,
    budget: 10,
    paid: true,
    form: 'Очная',
    formEn: 'Full-time',
    degree: 'Бакалавриат',
    degreeEn: "Bachelor's degree",
    price: 220000,
    subjects: ['Русский язык', 'Математика', 'Информатика или физика'],
    subjectsEn: ['Russian language', 'Mathematics', 'Computer science or physics'],
  },
  {
    id: 'design-tech',
    code: '09.03.02',
    name: 'Информационные технологии в дизайне',
    nameEn: 'Information Technologies in Design',
    score: 254,
    budget: 5,
    paid: true,
    form: 'Очная',
    formEn: 'Full-time',
    degree: 'Бакалавриат',
    degreeEn: "Bachelor's degree",
    price: 266200,
    subjects: ['Русский язык', 'Математика', 'Информатика или физика'],
    subjectsEn: ['Russian language', 'Mathematics', 'Computer science or physics'],
  },
  {
    id: 'music-sound',
    code: '09.03.02',
    name: 'Информационные технологии в музыке и саунд-дизайне',
    nameEn: 'Information Technologies in Music and Sound Design',
    score: 120,
    budget: 0,
    paid: true,
    form: 'Очная',
    formEn: 'Full-time',
    degree: 'Бакалавриат',
    degreeEn: "Bachelor's degree",
    price: 220000,
    subjects: ['Русский язык', 'Математика', 'Информатика или физика'],
    subjectsEn: ['Russian language', 'Mathematics', 'Computer science or physics'],
  },
  {
    id: 'music-sound-distance',
    code: '09.03.02',
    name: 'Информационные технологии в музыке и саунд-дизайне',
    nameEn: 'Information Technologies in Music and Sound Design',
    score: 120,
    budget: 0,
    paid: true,
    form: 'Заочная',
    formEn: 'Part-time',
    degree: 'Бакалавриат',
    degreeEn: "Bachelor's degree",
    price: 80000,
    subjects: ['Русский язык', 'Математика', 'Информатика или физика'],
    subjectsEn: ['Russian language', 'Mathematics', 'Computer science or physics'],
  },
  {
    id: 'math',
    code: '44.03.01',
    name: 'Математика',
    nameEn: 'Mathematics',
    score: 249,
    budget: 64,
    paid: true,
    form: 'Очная',
    formEn: 'Full-time',
    degree: 'Бакалавриат',
    degreeEn: "Bachelor's degree",
    price: 217200,
    subjects: ['Русский язык', 'Математика', 'Обществознание или информатика или физика'],
    subjectsEn: ['Russian language', 'Mathematics', 'Social studies or computer science or physics'],
  },
  {
    id: 'ai-education',
    code: '44.03.01',
    name: 'Информатика и информационные технологии в образовании',
    nameEn: 'Computer Science and Information Technologies in Education',
    score: 249,
    budget: 15,
    paid: true,
    form: 'Очная',
    formEn: 'Full-time',
    degree: 'Бакалавриат',
    degreeEn: "Bachelor's degree",
    price: 190000,
    subjects: ['Русский язык', 'Обществознание', 'Математика или информатика'],
    subjectsEn: ['Russian language', 'Social studies', 'Mathematics or computer science'],
  },
  {
    id: 'math-physics',
    code: '44.03.05',
    name: 'Математика, физика',
    nameEn: 'Mathematics and Physics',
    score: 249,
    budget: 25,
    paid: true,
    form: 'Очная',
    formEn: 'Full-time',
    degree: 'Бакалавриат',
    degreeEn: "Bachelor's degree",
    price: 217200,
    subjects: ['Русский язык', 'Математика', 'Физика'],
    subjectsEn: ['Russian language', 'Mathematics', 'Physics'],
  },
];

const programDetailsById = {
  'applied-math': {
    direction: '01.03.02 Прикладная математика и информатика',
    profile: 'Прикладная математика и информатика',
    institute: 'Факультет математики',
    durationText: '4 года',
    paidPlaces: 25,
    price: 206280,
    sourceUrl: 'https://www.herzen.spb.ru/abiturients/obrazovatelnye-programmy/bachelor/31/10832/',
    description:
      'Программа сочетает фундаментальную математику и практические IT-навыки: численные методы, алгоритмы, компьютерное моделирование, машинное обучение и анализ данных.',
    skills: ['Математический анализ', 'Алгоритмы и структуры данных', 'Компьютерное моделирование', 'Машинное обучение'],
    careers: ['Программист', 'Системный аналитик', 'Специалист по данным', 'Математический моделист'],
    subjects: ['Русский язык', 'Математика', 'Информатика или физика'],
    subjectsEn: ['Russian language', 'Mathematics', 'Computer science or physics'],
  },
  'big-data': {
    direction: '09.03.01 Информатика и вычислительная техника',
    profile: 'Технологии разработки программного обеспечения и обработки больших данных',
    institute: 'Институт информационных технологий и технологического образования',
    durationText: '4 года',
    paidPlaces: 30,
    price: 220000,
    sourceUrl: 'https://www.herzen.spb.ru/abiturients/obrazovatelnye-programmy/bachelor/31/10849/',
    description:
      'Программа готовит разработчиков и специалистов по данным: студенты изучают проектирование ПО, веб-разработку, базы данных, Data Science и машинное обучение.',
    skills: ['Проектирование ПО', 'Работа с большими данными', 'Основы Data Science', 'Тестирование и отладка'],
    careers: ['Разработчик ПО', 'Data analyst', 'Администратор баз данных', 'Руководитель IT-проектов'],
    subjects: ['Русский язык', 'Математика', 'Информатика или физика'],
    subjectsEn: ['Russian language', 'Mathematics', 'Computer science or physics'],
  },
  'design-tech': {
    direction: '09.03.02 Информационные системы и технологии',
    profile: 'Информационные технологии в дизайне',
    institute: 'Институт информационных технологий и технологического образования',
    durationText: '4 года',
    dormPlaces: 757,
    paidPlaces: 30,
    price: 266200,
    sourceUrl: 'https://www.herzen.spb.ru/abiturients/obrazovatelnye-programmy/bachelor/31/10850/',
    description:
      'Программа готовит специалистов для создания цифровых продуктов на стыке IT и дизайна: от frontend-разработки и UX/UI до 3D-графики, анимации и интерактивных визуализаций.',
    skills: ['Основы композиции', 'Веб-технологии', '3D-моделирование', 'Фотограмметрия'],
    careers: ['UX/UI-дизайнер', 'Frontend-разработчик', '2D/3D-художник', 'Моушн-дизайнер'],
    subjects: ['Русский язык', 'Математика', 'Информатика или физика'],
    subjectsEn: ['Russian language', 'Mathematics', 'Computer science or physics'],
  },
  'music-sound': {
    direction: '09.03.02 Информационные системы и технологии',
    profile: 'Информационные технологии в музыке и саунд-дизайне',
    institute: 'Институт информационных технологий и технологического образования',
    durationText: '4 года',
    paidPlaces: 30,
    price: 220000,
    sourceUrl: 'https://www.herzen.spb.ru/abiturients/obrazovatelnye-programmy/bachelor/31/10888/',
    description:
      'Программа объединяет информатику, музыку, акустику, программирование и медиа-дизайн. Студенты осваивают цифровые аудиостанции, аудиоплагины и технологии звука для кино, игр и ТВ.',
    skills: ['Информационные технологии в музыке', 'Музыкально-компьютерные технологии', 'Саунд-дизайн', 'Цифровой продакшен'],
    careers: ['Саунд-дизайнер', 'Звукорежиссёр', 'Медиаспециалист', 'Специалист аудиоиндустрии'],
    subjects: ['Русский язык', 'Математика', 'Информатика или физика'],
    subjectsEn: ['Russian language', 'Mathematics', 'Computer science or physics'],
  },
  'music-sound-distance': {
    direction: '09.03.02 Информационные системы и технологии',
    profile: 'Информационные технологии в музыке и саунд-дизайне',
    institute: 'Институт информационных технологий и технологического образования',
    durationText: '5 лет',
    paidPlaces: 30,
    price: 80000,
    sourceUrl: 'https://www.herzen.spb.ru/abiturients/obrazovatelnye-programmy/bachelor/31/10888/',
    description:
      'Заочная версия программы для тех, кто хочет совмещать обучение с работой и развиваться в сфере музыкально-компьютерных технологий, медиа и цифрового звука.',
    skills: ['Основы математики', 'Информационные технологии в музыке', 'Проектная работа', 'Саунд-дизайн'],
    careers: ['Саунд-дизайнер', 'Звукорежиссёр', 'Медиаспециалист', 'Специалист аудиоиндустрии'],
    subjects: ['Русский язык', 'Математика', 'Информатика или физика'],
    subjectsEn: ['Russian language', 'Mathematics', 'Computer science or physics'],
  },
  math: {
    direction: '44.03.01 Педагогическое образование',
    profile: 'Математика',
    institute: 'Факультет математики',
    durationText: '4 года',
    paidPlaces: 25,
    price: 217200,
    sourceUrl: 'https://www.herzen.spb.ru/abiturients/obrazovatelnye-programmy/bachelor/33/10831/',
    description:
      'Программа готовит будущих учителей математики, которые владеют предметом и современными педагогическими технологиями.',
    skills: ['Математический анализ', 'Методика обучения математике', 'Педагогика школы', 'Цифровые инструменты учителя'],
    careers: ['Учитель математики', 'Методист', 'Педагог дополнительного образования', 'Тьютор'],
    subjects: ['Русский язык', 'Математика', 'Обществознание или информатика или физика'],
    subjectsEn: ['Russian language', 'Mathematics', 'Social studies or computer science or physics'],
  },
  'ai-education': {
    direction: '44.03.01 Педагогическое образование',
    profile: 'Информатика и информационные технологии в образовании',
    institute: 'Институт информационных технологий и технологического образования',
    durationText: '4 года',
    paidPlaces: 25,
    price: 190000,
    sourceUrl: 'https://www.herzen.spb.ru/abiturients/obrazovatelnye-programmy/bachelor/31/10848/',
    description:
      'Педагогическая программа по информатике и образовательным технологиям: акцент на методике преподавания, цифровых сервисах и проектировании учебных материалов.',
    skills: ['Методика обучения информатике', 'Образовательные технологии', 'Программирование', 'Проектирование цифровых курсов'],
    careers: ['Учитель информатики', 'Методист EdTech', 'Разработчик учебных материалов', 'Педагог дополнительного образования'],
    subjects: ['Русский язык', 'Обществознание', 'Математика или информатика'],
    subjectsEn: ['Russian language', 'Social studies', 'Mathematics or computer science'],
  },
  'math-physics': {
    direction: '44.03.05 Педагогическое образование с двумя профилями',
    profile: 'Математика, Физика',
    institute: 'Факультет математики',
    durationText: '5 лет',
    paidPlaces: 25,
    price: 217200,
    sourceUrl: 'https://www.herzen.spb.ru/abiturients/obrazovatelnye-programmy/bachelor/33/',
    description:
      'Двухпрофильная педагогическая программа для подготовки учителей математики и физики с сильной предметной базой.',
    skills: ['Математика', 'Физика', 'Методика преподавания', 'Лабораторный практикум'],
    careers: ['Учитель математики', 'Учитель физики', 'Методист', 'Педагог проектной деятельности'],
    subjects: ['Русский язык', 'Математика', 'Физика'],
    subjectsEn: ['Russian language', 'Mathematics', 'Physics'],
  },
};

const dormitories = [
  {
    id: 'ligovsky',
    address: 'Лиговский пр., д. 275',
    addressEn: '275 Ligovsky Ave.',
    note: 'аспирантское общежитие',
    noteEn: 'postgraduate dormitory',
    contact: '8 (812) 712-83-78',
    district: 'Фрунзенский район',
    districtEn: 'Frunzensky District',
    metro: 'Обводный канал',
    metroEn: 'Obvodny Kanal',
    travel: '25-30 минут до главного кампуса',
    travelEn: '25-30 minutes to the main campus',
    lat: 59.9043604,
    lng: 30.3415325,
    x: 39,
    y: 65,
  },
  {
    id: 'stachek',
    address: 'Пр. Стачек, д. 30',
    addressEn: '30 Stachek Ave.',
    note: 'студенческое общежитие',
    noteEn: 'student dormitory',
    contact: '8 (812) 786-78-22',
    district: 'Кировский район',
    districtEn: 'Kirovsky District',
    metro: 'Нарвская',
    metroEn: 'Narvskaya',
    travel: '30-35 минут до главного кампуса',
    travelEn: '30-35 minutes to the main campus',
    lat: 59.8886965,
    lng: 30.27317,
    x: 22,
    y: 72,
  },
  {
    id: 'novo5',
    address: 'Новоизмайловский пр., д. 5',
    addressEn: '5 Novoizmailovsky Ave.',
    note: 'студенческое общежитие',
    noteEn: 'student dormitory',
    contact: '8 (812) 369-28-74',
    district: 'Московский район',
    districtEn: 'Moskovsky District',
    metro: 'Парк Победы',
    metroEn: 'Park Pobedy',
    travel: '35-40 минут до главного кампуса',
    travelEn: '35-40 minutes to the main campus',
    lat: 59.8736808,
    lng: 30.3030981,
    x: 53,
    y: 77,
  },
  {
    id: 'moika',
    address: 'наб. р. Мойки, 48, корп. 7',
    addressEn: '48 Moika River Embankment, bld. 7',
    note: 'рядом с главным кампусом',
    noteEn: 'near the main campus',
    contact: '8 (812) 312-48-89',
    district: 'Центральный район',
    districtEn: 'Central District',
    metro: 'Невский проспект',
    metroEn: 'Nevsky Prospekt',
    travel: '5 минут пешком до главного кампуса',
    travelEn: '5 minutes on foot to the main campus',
    lat: 59.9348596,
    lng: 30.3204488,
    x: 62,
    y: 34,
  },
];

const partnerLogos = [
  { name: 'Лазерный центр', src: '/partners/laser-center.png' },
  { name: 'Академия талантов', src: '/partners/academy-talents.png' },
  { name: 'Кванториум РГПУ', src: '/partners/kvantorium.png' },
  { name: 'GIRTEK', src: '/partners/girtek.png' },
  { name: 'Алфёровский университет', src: '/partners/alferov.png' },
  { name: 'GREENFX', src: '/partners/greenfx.png' },
];

const reviewCards = [
  {
    name: 'Ольга Кублик',
    nameEn: 'Olga Kublik',
    image: '/review-olga-kublik.jpg',
    text: 'Я выбрала Герцен за сильную программу и понятную траекторию поступления. Здесь быстро появляется уверенность: знаешь, что делаешь и куда растёшь.',
    textEn: 'I chose Herzen for a strong program and a clear admission path. It quickly gives you confidence: you understand what you do and where you grow.',
  },
  {
    name: 'Варвара Лещевич',
    nameEn: 'Varvara Leshchevich',
    image: '/review-varvara-leshchevich.jpg',
    text: 'Больше всего ценю практику: проекты, командная работа и преподаватели, которые реально помогают собрать портфолио уже во время учёбы.',
    textEn: 'I value the practical side most: projects, teamwork and teachers who help build a portfolio while you study.',
  },
  {
    name: 'Ольга Белоусова',
    nameEn: 'Olga Belousova',
    image: '/review-olga-belousova.jpg',
    text: 'Герцен дал мне ощущение, что университет — это не только пары, а среда. Можно пробовать себя, ошибаться, выигрывать конкурсы и собирать свой успех.',
    textEn: 'Herzen showed me that university is not only classes, but an environment where you can try, make mistakes, win competitions and build your success.',
  },
];

const conditionCards = {
  ru: [
    { title: 'Сроки подачи', text: 'Следите за календарём приёмной комиссии: даты зависят от формы обучения, бюджета и платных мест.' },
    { title: 'Индивидуальные достижения', text: 'Достижения могут добавить конкурсные баллы: олимпиады, волонтёрство, аттестат с отличием и портфолио.' },
    { title: 'Без ЕГЭ', text: 'Выпускники колледжей могут поступать по внутренним вступительным испытаниям университета.' },
  ],
  en: [
    { title: 'Application Dates', text: 'Check the admission calendar: dates depend on study format, state-funded and paid places.' },
    { title: 'Individual Achievements', text: 'Achievements may add competitive points: olympiads, volunteering, honors certificate and portfolio.' },
    { title: 'Without USE', text: 'College graduates may apply using internal university entrance exams.' },
  ],
};

const directionNamesEn = {
  '01.03.02': 'Applied Mathematics and Computer Science',
  '09.03.01': 'Computer Science and Computer Engineering',
  '09.03.02': 'Information Systems and Technologies',
  '44.03.01': 'Pedagogical Education',
  '44.03.05': 'Pedagogical Education with Two Profiles',
};

const dictionaries = {
  ru: {
    languageButton: 'en',
    brand: 'РГПУ им. А. И. Герцена',
    foreign: 'Иностранным гражданам',
    home: 'Главная',
    applicants: 'Абитуриентам',
    chooseProgram: 'Выбрать программу',
    apply: 'Подать документы',
    nav: {
      about: 'Об университете',
      admission: 'Поступление 2026',
      life: 'Студенческая жизнь',
      graduates: 'Наши выпускники',
      faq: 'Частые вопросы',
    },
    heroTitle: 'Герценовский университет',
    heroText:
      'Педагогический вуз, воплощающий лучшие традиции классического преподавания, а также отечественных научных и педагогических школ. Значительная часть наших программ связана с образованием и гуманитарными науками, но отражает весь спектр знаний о мире.',
    stats: ['Факультеты', 'Институты', 'Малые факультеты'],
    statsMore: 'Подробнее',
    admissionTitle: 'Гайд поступление 2026',
    admissionSteps: ['Выбери направление', 'Проверь баллы и вступительные', 'Нажми “Подать документы” и отправляй сканы'],
    lifeTitle: 'Студенческая жизнь',
    lifeCards: ['Возможности Герцена', 'Студенческие объединения', 'Общежитие'],
    graduateNames: ['Дарья Л.', 'Максим Я.', 'Яна Н.', 'Даниил П.', 'Юлия Р.'],
    questions: ['Можно ли поступить без ЕГЭ?', 'Есть ли бюджетные места?', 'Предоставляют ли общежитие?'],
    answers: [
      'Да, выпускники колледжей могут сдавать внутренние вступительные испытания.',
      'Да. Количество бюджетных мест указано в карточках программ.',
      'Да, иногородние студенты могут подать заявление на общежитие.',
    ],
    ask: 'Задать вопрос',
    askPlaceholder: 'Не нашли ответ? Напишите сюда',
    send: 'отправить',
    programPageTitle: 'Выбрать программу',
    tabs: ['Специалитет', 'Магистратура', 'Аспирантура', 'СПО'],
    filters: 'Фильтры',
    educationLevel: 'Уровень образования',
    specialty: 'Специалитет',
    studyForm: 'Форма обучения',
    scoreSubject: 'Предметы ЕГЭ',
    sorting: 'Сортировка',
    searchPlaceholder: 'Поиск программы',
    filterTitle: 'Поиск программы по фильтрам:',
    subjectsPrompt: 'Укажите предметы ЕГЭ:',
    found: 'Количество найденных программ',
    budgetPlaces: 'Бюджетные места',
    paidPlaces: 'Внебюджетные места',
    passingScore: 'Проходной балл',
    details: 'Подробнее',
    sortScoreDesc: 'По баллам: сначала высокие',
    sortScoreAsc: 'По баллам: сначала низкие',
    sortBudgetDesc: 'По бюджетным местам',
    sortPriceAsc: 'По стоимости',
    conditions: 'Условия поступления 2026',
    conditionLinks: ['Сроки подачи', 'Индивидуальные достижения', 'Без ЕГЭ'],
    exams: 'Экзамены',
    entrance: 'Вступительные',
    institute: 'Институт',
    instituteName: 'Институт информационных технологий и технологического образования',
    description: 'Описание программы',
    descriptionText:
      'Программа готовит специалистов для создания современных цифровых продуктов на стыке информационных технологий и дизайна. Студенты осваивают полный технологический стек: от проектирования и frontend-разработки до визуализации, трехмерной графики и обработки данных.',
    whatStudy: 'Что будем изучать?',
    skills: ['Навыки презентации и командной работы', 'Управление проектами в Agile-среде', 'Адаптивность и гибкость мышления', 'Перейти к учебному плану →'],
    career: 'Карьерные перспективы',
    careers: ['Работать UX/UI-дизайнером', 'Работать Frontend-разработчиком', 'Работать 2D/3D-художником', 'Работать специалистом по визуализации данных'],
    partners: 'Партнеры',
    contacts: 'Контакты',
    reviews: 'Отзывы о программе',
    costYear: 'Стоимость в год',
    back: 'Назад к выбору',
  },
  en: {
    languageButton: 'ru',
    brand: 'Herzen University',
    foreign: 'For international applicants',
    home: 'Home',
    applicants: 'Applicants',
    chooseProgram: 'Choose a Program',
    apply: 'Submit Documents',
    nav: {
      about: 'About the University',
      admission: 'Admission 2026',
      life: 'Student Life',
      graduates: 'Alumni',
      faq: 'FAQ',
    },
    heroTitle: 'Herzen University',
    heroText:
      'A pedagogical university combining strong academic traditions with modern research and educational practices. Programs cover education, humanities, technology and creative fields.',
    stats: ['Faculties', 'Institutes', 'Small Faculties'],
    statsMore: 'Details',
    admissionTitle: 'Admission Guide 2026',
    admissionSteps: ['Choose your field', 'Check scores and exams', 'Submit documents and scans'],
    lifeTitle: 'Student Life',
    lifeCards: ['Herzen Opportunities', 'Student Communities', 'Dormitory'],
    graduateNames: ['Daria L.', 'Maxim Y.', 'Yana N.', 'Daniil P.', 'Julia R.'],
    questions: ['Can I apply without the Unified State Exam?', 'Are there state-funded places?', 'Is dormitory housing available?'],
    answers: [
      'Yes, college graduates may take internal entrance exams.',
      'Yes. State-funded places are shown in program cards.',
      'Yes, nonresident students can apply for dormitory housing.',
    ],
    ask: 'Ask a question',
    askPlaceholder: 'Did not find an answer? Write here',
    send: 'send',
    programPageTitle: 'Choose a Program',
    tabs: ['Specialist', 'Master', 'Postgraduate', 'College'],
    filters: 'Filters',
    educationLevel: 'Education level',
    specialty: 'Specialist',
    studyForm: 'Study format',
    scoreSubject: 'Exam subjects',
    sorting: 'Sorting',
    searchPlaceholder: 'Search program',
    filterTitle: 'Find a program by filters:',
    subjectsPrompt: 'Choose exam subjects:',
    found: 'Programs found',
    budgetPlaces: 'State-funded places',
    paidPlaces: 'Paid places',
    passingScore: 'Passing score',
    details: 'Details',
    sortScoreDesc: 'Score: high to low',
    sortScoreAsc: 'Score: low to high',
    sortBudgetDesc: 'State-funded places',
    sortPriceAsc: 'Price',
    conditions: 'Admission Requirements 2026',
    conditionLinks: ['Application dates', 'Individual achievements', 'Without USE'],
    exams: 'Exams',
    entrance: 'Entrance exams',
    institute: 'Institute',
    instituteName: 'Institute of Information Technology and Technological Education',
    description: 'Program Description',
    descriptionText:
      'The program trains specialists for modern digital products at the intersection of technology and design. Students study frontend development, visualization, 3D graphics and data processing.',
    whatStudy: 'What will we study?',
    skills: ['Presentation and teamwork skills', 'Agile project management', 'Adaptability and flexible thinking', 'Open curriculum →'],
    career: 'Career Prospects',
    careers: ['UX/UI designer', 'Frontend developer', '2D/3D artist', 'Data visualization specialist'],
    partners: 'Partners',
    contacts: 'Contacts',
    reviews: 'Program Reviews',
    costYear: 'Cost per year',
    back: 'Back to programs',
  },
};

function getRoute() {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'admin') {
    return { page: 'admin' };
  }
  if (hash === 'programs') {
    return { page: 'programs' };
  }
  if (hash.startsWith('program/')) {
    return { page: 'program', programId: hash.replace('program/', '') };
  }
  return { page: 'home' };
}

function normalizeProgram(program) {
  const fallback = defaultPrograms.find((item) => item.id === program.id);
  const details = programDetailsById[program.id] || {};
  const subjects = program.subjects || details.subjects || fallback?.subjects || ['Русский язык', 'Математика', 'Информатика или физика'];
  const subjectsEn = program.subjectsEn || details.subjectsEn || fallback?.subjectsEn || ['Russian language', 'Mathematics', 'Computer science or physics'];

  return {
    ...program,
    ...details,
    code: program.code || fallback?.code || '',
    name: program.name || fallback?.name || '',
    nameEn: program.nameEn || fallback?.nameEn || program.name || '',
    score: Number(program.score ?? program.passing_score ?? 0),
    budget: Number(program.budget ?? program.budget_places ?? 0),
    paid: Boolean(program.paid ?? Number(program.paid_places ?? 0) > 0),
    form: program.form || program.study_form || fallback?.form || 'Очная',
    formEn: program.formEn || fallback?.formEn || 'Full-time',
    degree: program.degree || program.degree_level || fallback?.degree || 'Бакалавриат',
    degreeEn: program.degreeEn || fallback?.degreeEn || "Bachelor's degree",
    paidPlaces: Number(program.paidPlaces ?? program.paid_places ?? details.paidPlaces ?? 0),
    price: Number(program.price ?? program.tuition_fee ?? details.price ?? 0),
    subjects,
    subjectsEn,
  };
}

function money(value) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
}

function programName(program, lang) {
  return lang === 'ru' ? (program.profile || program.name) : (program.nameEn || program.name);
}

function programDirection(program, lang) {
  if (lang === 'ru') {
    return program.direction || program.name;
  }

  return `${program.code} ${directionNamesEn[program.code] || program.nameEn || program.name}`;
}

function durationLabel(program, lang) {
  const years = Number(program.duration_years || program.durationYears || 0);
  if (!years) {
    return lang === 'ru' ? program.durationText : program.durationTextEn;
  }

  if (lang === 'ru') {
    return years === 5 ? '5 лет' : `${years} года`;
  }

  return `${years} years`;
}

function DormMap({ dorm, lang, dorms = [], onSelect }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const isInteractive = dorms.length > 0 && typeof onSelect === 'function';
  const visibleDorms = useMemo(() => (isInteractive ? dorms : [dorm]), [dorm, dorms, isInteractive]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) {
      return;
    }

    mapInstanceRef.current = L.map(mapRef.current, {
      attributionControl: false,
      center: [59.914, 30.315],
      scrollWheelZoom: true,
      zoom: 11,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const markerIcon = (active) => L.divIcon({
      className: active ? 'leaflet-dorm-marker active' : 'leaflet-dorm-marker',
      html: '<span></span>',
      iconAnchor: [13, 26],
      iconSize: [26, 26],
    });

    visibleDorms.forEach((item) => {
      const label = lang === 'ru' ? item.address : item.addressEn;
      const popup = `
        <b>${label}</b><br />
        ${lang === 'ru' ? item.metro : item.metroEn}<br />
        ${lang === 'ru' ? item.travel : item.travelEn}
      `;
      const marker = L.marker([item.lat, item.lng], {
        icon: markerIcon(item.id === dorm.id),
        title: label,
      }).addTo(map);

      marker.bindPopup(popup);
      marker.on('click', () => {
        if (isInteractive) {
          onSelect(item.id);
        }
      });
      markersRef.current.push(marker);
    });

    const selectedLatLng = [dorm.lat, dorm.lng];
    map.setView(selectedLatLng, isInteractive ? 12 : 15, { animate: true });
  }, [dorm, isInteractive, lang, onSelect, visibleDorms]);

  return (
    <div className="leaflet-map-shell">
      <div
        aria-label={lang === 'ru' ? 'Интерактивная карта общежитий' : 'Interactive dormitory map'}
        className="leaflet-map"
        ref={mapRef}
      />
      <div className="map-caption">
        <b>{lang === 'ru' ? dorm.address : dorm.addressEn}</b>
        <span>{lang === 'ru' ? dorm.travel : dorm.travelEn}</span>
      </div>
    </div>
  );
}

function Button({ children, href = '#programs', className = '' }) {
  return (
    <a className={`button ${className}`} href={href}>
      {children}
    </a>
  );
}

function Header({ lang, setLang, text }) {
  const titleLines = lang === 'ru'
    ? ['Российский государственный', 'педагогический университет', 'им. А.И. Герцена']
    : ['Herzen State', 'Pedagogical University', 'of Russia'];

  return (
    <header className="top-banner">
      <a className="brand" href="#about">
        <img src="/herzen-crest.png" alt="" />
        <span className="brand-text">
          {titleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </span>
      </a>
      <nav className="top-actions" aria-label="Верхнее меню">
        <a className="guide-link" href="#question">{text.foreign}</a>
        <button className="language-button" type="button" onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}>
          {text.languageButton}
        </button>
      </nav>
    </header>
  );
}

function HomePage({ lang, text, activeSection }) {
  const isRu = lang === 'ru';
  const [selectedDormId, setSelectedDormId] = useState('moika');
  const [showMoveIn, setShowMoveIn] = useState(false);
  const selectedDorm = dormitories.find((dorm) => dorm.id === selectedDormId) || dormitories[0];
  const statCards = [
    { title: text.stats[0], caption: isRu ? '85+ программ' : '85+ programs' },
    { title: text.stats[1], caption: isRu ? '12 институтов 30+ профилей' : '12 institutes 30+ profiles' },
    { title: text.stats[2], caption: isRu ? '7 направлений 25 профессий' : '7 fields 25 professions' },
  ];
  const lifeCards = [
    { title: isRu ? 'Культурный центр' : 'Culture Center', caption: isRu ? '85+ программ' : '85+ programs' },
    { title: isRu ? 'Спортклубы' : 'Sport Clubs', caption: isRu ? '85+ программ' : '85+ programs' },
    { title: isRu ? 'Студсовет' : 'Student Council', caption: isRu ? '85+ программ' : '85+ programs' },
  ];
  return (
    <main className="page home-page">
      <aside className="side-nav" aria-label="Разделы страницы">
        <a className={activeSection === 'about' ? 'active' : ''} href="#about">{text.nav.about}</a>
        <a className={activeSection === 'admission' ? 'active' : ''} href="#admission">{text.nav.admission}</a>
        <a className={activeSection === 'life' ? 'active' : ''} href="#life">{text.nav.life}</a>
        <a className={activeSection === 'graduates' ? 'active' : ''} href="#graduates">{text.nav.graduates}</a>
        <a className={activeSection === 'faq' ? 'active' : ''} href="#faq">{text.nav.faq}</a>
      </aside>

      <div className="content">
        <div className="breadcrumbs">
          <span>{text.home}</span>
          <strong>{text.applicants}</strong>
        </div>

        <section className="hero" id="about">
          <h1>{text.applicants}</h1>
          <div className="hero-layout">
            <div className="hero-card">
              <h2>{isRu ? 'Герценовский университет — выбор будущего педагога, исследователя, лидера' : 'Herzen University is a choice for future educators, researchers and leaders'}</h2>
              <p>{text.heroText}</p>
              <div className="hero-actions">
                <Button href="#programs">{text.chooseProgram}</Button>
                <Button>{text.apply}</Button>
              </div>
            </div>
          </div>
        </section>

        <Button className="wide-cta">{text.apply}</Button>

        <section className="info-panel">
          <div className="cards-grid">
            {statCards.map((card) => (
              <article className="icon-card" key={card.title}>
                <img src="/cap-white.png" alt="" />
                <h3>{card.title}</h3>
                <p>{card.caption}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="admission-plan" id="admission">
          <h2 className="section-title">{isRu ? 'Как поступить в РГПУ в 2026 году?' : 'How to apply to Herzen University in 2026?'}</h2>
          <div className="steps">
            {text.admissionSteps.map((step, index) => (
              <div className="step-fragment" key={step}>
                <span>{step}</span>
                {index < text.admissionSteps.length - 1 && <b>→</b>}
              </div>
            ))}
          </div>
          <Button href="#programs">{text.chooseProgram}</Button>
        </section>

        <section className="life-section" id="life">
          <div className="cards-grid">
            {lifeCards.map((card) => (
              <article className="icon-card" key={card.title}>
                <img src="/cap-white.png" alt="" />
                <h3>{card.title}</h3>
                <p>{card.caption}</p>
              </article>
            ))}
          </div>

          <section className="dormitory-panel">
            <h2 className="section-title">{isRu ? 'Общежитие' : 'Dormitory'}</h2>
            <div className="dormitory-grid">
              <article>
                <h3>{isRu ? 'Выбранное общежитие:' : 'Selected dormitory:'}</h3>
                <p className="selected-dorm-address">{isRu ? selectedDorm.address : selectedDorm.addressEn}</p>
                <dl className="dorm-info">
                  <div><dt>{isRu ? 'Тип' : 'Type'}</dt><dd>{isRu ? selectedDorm.note : selectedDorm.noteEn}</dd></div>
                  <div><dt>{isRu ? 'Метро' : 'Metro'}</dt><dd>{isRu ? selectedDorm.metro : selectedDorm.metroEn}</dd></div>
                  <div><dt>{isRu ? 'Дорога' : 'Route'}</dt><dd>{isRu ? selectedDorm.travel : selectedDorm.travelEn}</dd></div>
                  <div><dt>{isRu ? 'Контакт' : 'Contact'}</dt><dd>{selectedDorm.contact}</dd></div>
                </dl>
                <p>{isRu ? 'Выберите адрес в списке или маркер на карте: информация обновится сразу.' : 'Choose an address in the list or a map marker: the details update instantly.'}</p>
              </article>
              <article>
                <h3>{isRu ? 'Расположение:' : 'Location:'}</h3>
                <DormMap
                  dorm={selectedDorm}
                  dorms={dormitories}
                  lang={lang}
                  onSelect={setSelectedDormId}
                />
              </article>
            </div>
            <div className="dorm-list">
              {dormitories.map((dorm) => (
                <button
                  className={dorm.id === selectedDormId ? 'active' : ''}
                  key={dorm.id}
                  type="button"
                  onClick={() => setSelectedDormId(dorm.id)}
                >
                  <b>{isRu ? dorm.address : dorm.addressEn}</b>
                  <span>{isRu ? dorm.metro : dorm.metroEn}</span>
                </button>
              ))}
            </div>
            <button className="button button-flat dorm-toggle" type="button" onClick={() => setShowMoveIn((value) => !value)}>
              {isRu ? 'Узнать как заселиться' : 'How to move in'}
            </button>
            {showMoveIn && (
              <div className="move-in-card">
                <h3>{isRu ? 'Как заселиться' : 'Move-in steps'}</h3>
                <ol>
                  <li>{isRu ? 'Дождаться приказа о зачислении.' : 'Wait for the admission order.'}</li>
                  <li>{isRu ? 'Подать заявление на общежитие в личном кабинете или приёмной комиссии.' : 'Submit a dormitory application.'}</li>
                  <li>{isRu ? 'Получить направление и дату заселения.' : 'Receive a referral and move-in date.'}</li>
                  <li>{isRu ? 'Приехать с документами и заключить договор проживания.' : 'Arrive with documents and sign the housing agreement.'}</li>
                </ol>
              </div>
            )}
          </section>
        </section>

        <section className="graduates" id="graduates">
          <h2 className="section-title">{text.nav.graduates}</h2>
          <div className="home-review-grid">
            {reviewCards.map((review) => (
              <article key={review.name}>
                <img src={review.image} alt={isRu ? review.name : review.nameEn} />
                <h3>{isRu ? review.name : review.nameEn}</h3>
                <p>{isRu ? review.text : review.textEn}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="faq" id="faq">
          <h2 className="section-title">{text.nav.faq}</h2>
          {text.questions.map((question, index) => (
            <details key={question} open={index === 2}>
              <summary>{question}</summary>
              <p>{text.answers[index]}</p>
            </details>
          ))}
        </section>

        <section className="question-form" id="question">
          <h2 className="section-title">{text.ask}</h2>
          <form>
            <label>
              <span>{text.ask}</span>
              <input type="text" placeholder={text.askPlaceholder} />
            </label>
            <button type="submit" aria-label={text.send}>↗</button>
          </form>
        </section>

        <Button className="wide-cta">{text.apply}</Button>
      </div>
    </main>
  );
}

function ProgramsPage({ lang, text, programs }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('score-desc');
  const [subjects, setSubjects] = useState([]);
  const [scores, setScores] = useState({});
  const [form, setForm] = useState('all');
  const [activeFilter, setActiveFilter] = useState('subjects');
  const filterLinks = [
    { id: 'subjects', label: text.scoreSubject },
    { id: 'form', label: text.studyForm },
    { id: 'sort', label: text.sorting },
  ];
  const subjectNames = lang === 'ru'
    ? ['Русский язык', 'Математика', 'Литература', 'История', 'Информатика или физика', 'Физика', 'Творческое испытание']
    : ['Russian language', 'Mathematics', 'Literature', 'History', 'Computer science or physics', 'Physics', 'Creative exam'];

  const filteredPrograms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filledScores = Object.entries(scores)
      .map(([subject, value]) => [subject, Number(value)])
      .filter(([, value]) => Number.isFinite(value) && value > 0);
    const totalScore = filledScores.reduce((sum, [, value]) => sum + value, 0);

    return programs
      .filter((program) => {
        const name = lang === 'ru' ? program.name : program.nameEn;
        const programSubjects = lang === 'ru' ? program.subjects : program.subjectsEn;
        const matchesQuery = !normalizedQuery || `${program.code} ${name}`.toLowerCase().includes(normalizedQuery);
        const matchesForm = form === 'all' || (lang === 'ru' ? program.form : program.formEn) === form;
        const matchesSubjects = subjects.length === 0 || subjects.every((subject) => programSubjects.includes(subject));
        const matchesScoreSubjects = filledScores.every(([subject]) => programSubjects.includes(subject));
        const matchesTotalScore = totalScore === 0 || totalScore >= program.score;
        return matchesQuery && matchesForm && matchesSubjects && matchesScoreSubjects && matchesTotalScore;
      })
      .sort((a, b) => {
        if (sort === 'score-asc') return a.score - b.score;
        if (sort === 'budget-desc') return b.budget - a.budget;
        if (sort === 'price-asc') return a.price - b.price;
        return b.score - a.score;
      });
  }, [form, lang, programs, query, scores, sort, subjects]);

  function toggleSubject(subject) {
    setSubjects((current) => current.includes(subject) ? current.filter((item) => item !== subject) : [...current, subject]);
  }

  function changeScore(subject, value) {
    setScores((current) => ({
      ...current,
      [subject]: value,
    }));
  }

  function resetFilters() {
    setQuery('');
    setSort('score-desc');
    setSubjects([]);
    setScores({});
    setForm('all');
  }

  function focusFilter(id) {
    setActiveFilter(id);
  }

  const enteredTotal = Object.values(scores).reduce((sum, value) => {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? sum + numberValue : sum;
  }, 0);

  return (
    <main className="programs-page">
      <div className="plain-page">
        <div className="breadcrumbs">
          <a href="#about">{text.home}</a>
          <span>{text.applicants}</span>
          <strong>{text.chooseProgram}</strong>
        </div>
        <h1>{text.programPageTitle}</h1>
        <p className="page-lead">
          {lang === 'ru'
            ? 'Выберите предметы, укажите свои баллы и сравните программы по проходному баллу, местам и стоимости.'
            : 'Choose subjects, enter your scores and compare programs by score, places and tuition fee.'}
        </p>

        <div className="degree-tabs">
          {text.tabs.map((tab, index) => (
            <button className={index === 0 ? 'active' : ''} type="button" key={tab}>{tab}</button>
          ))}
        </div>

        <div className="program-search-layout">
          <aside className="filter-nav">
            <strong>{text.filters}</strong>
            {filterLinks.map((item) => (
              <button
                className={activeFilter === item.id ? 'active' : ''}
                key={item.id}
                onClick={() => focusFilter(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </aside>

          <section className="filter-panel">
            <div className="search-row">
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.searchPlaceholder} />
              <button type="button">⌕</button>
            </div>

            <div className="filter-heading">
              <div>
                <h2>{text.filterTitle}</h2>
                <p>{lang === 'ru' ? 'Фильтры применяются сразу: отметьте предметы, введите баллы, выберите форму и сортировку.' : 'Filters apply instantly: choose subjects, enter scores, select format and sorting.'}</p>
              </div>
              <button type="button" onClick={resetFilters}>{lang === 'ru' ? 'Сбросить' : 'Reset'}</button>
            </div>
            {activeFilter === 'subjects' && (
              <section className="filter-block" id="filter-subjects">
                <h3>{text.subjectsPrompt}</h3>
                <div className="checkbox-grid">
                  {subjectNames.map((subject) => (
                    <div className="subject-score" key={subject}>
                      <label>
                        <input checked={subjects.includes(subject)} type="checkbox" onChange={() => toggleSubject(subject)} />
                        <span>{subject}</span>
                      </label>
                      <input
                        aria-label={`${subject}: ${lang === 'ru' ? 'баллы' : 'score'}`}
                        min="0"
                        max="100"
                        type="number"
                        value={scores[subject] || ''}
                        onChange={(event) => changeScore(subject, event.target.value)}
                        placeholder={lang === 'ru' ? 'баллы' : 'score'}
                      />
                    </div>
                  ))}
                </div>
                <div className="score-summary">
                  <span>{lang === 'ru' ? 'Сумма введенных баллов' : 'Entered total score'}:</span>
                  <b>{enteredTotal}</b>
                </div>
              </section>
            )}

            {activeFilter === 'form' && (
              <section className="filter-block" id="filter-form">
                <h3>{text.studyForm}</h3>
                <div className="filter-choice-grid">
                  {[
                    { value: 'all', label: lang === 'ru' ? 'Все формы' : 'All formats' },
                    { value: lang === 'ru' ? 'Очная' : 'Full-time', label: lang === 'ru' ? 'Очная' : 'Full-time' },
                    { value: lang === 'ru' ? 'Заочная' : 'Part-time', label: lang === 'ru' ? 'Заочная' : 'Part-time' },
                  ].map((item) => (
                    <button
                      className={form === item.value ? 'active' : ''}
                      key={item.value}
                      onClick={() => setForm(item.value)}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {activeFilter === 'sort' && (
              <section className="filter-block" id="filter-sort">
                <h3>{text.sorting}</h3>
                <div className="filter-choice-grid">
                  {[
                    { value: 'score-desc', label: text.sortScoreDesc },
                    { value: 'score-asc', label: text.sortScoreAsc },
                    { value: 'budget-desc', label: text.sortBudgetDesc },
                    { value: 'price-asc', label: text.sortPriceAsc },
                  ].map((item) => (
                    <button
                      className={sort === item.value ? 'active' : ''}
                      key={item.value}
                      onClick={() => setSort(item.value)}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </section>
        </div>

        <section className="program-results">
          <h2>{text.found}: {filteredPrograms.length}</h2>
          <div className="program-card-grid">
            {filteredPrograms.map((program) => (
              <article className="program-card" key={program.id}>
                <header>
                  <span className="program-code">{program.code}</span>
                  <span className={enteredTotal > 0 && enteredTotal >= program.score ? 'program-fit good' : 'program-fit'}>
                    {enteredTotal > 0
                      ? (enteredTotal >= program.score ? (lang === 'ru' ? 'проходите' : 'eligible') : (lang === 'ru' ? 'нужно больше' : 'higher score needed'))
                      : (lang === 'ru' ? 'бакалавриат' : 'bachelor')}
                  </span>
                </header>
                <h3>{programName(program, lang)}</h3>
                <p>{programDirection(program, lang)}</p>
                <dl>
                  <div><dt>{text.passingScore}:</dt><dd>{program.score}</dd></div>
                  <div><dt>{text.budgetPlaces}:</dt><dd>{program.budget}</dd></div>
                  <div><dt>{text.paidPlaces}:</dt><dd>{program.paidPlaces || (program.paid ? (lang === 'ru' ? 'Есть' : 'Yes') : (lang === 'ru' ? 'Нет' : 'No'))}</dd></div>
                  <div><dt>{lang === 'ru' ? 'Стоимость' : 'Price'}:</dt><dd>{money(program.price)}</dd></div>
                </dl>
                <footer>
                  <span>{durationLabel(program, lang)} · {lang === 'ru' ? program.form : program.formEn}</span>
                  <a href={`#program/${program.id}`}>{text.details}</a>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <section className="conditions">
          <h2>{text.conditions}</h2>
          <div className="condition-card-grid">
            {conditionCards[lang].map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function ProgramDetailPage({ lang, text, programId, programs }) {
  const program = programs.find((item) => item.id === programId) || programs[0];
  const subjects = lang === 'ru' ? program.subjects : program.subjectsEn;
  const skills = program.skills || text.skills;
  const careers = program.careers || text.careers;

  return (
    <main className="program-detail-page">
      <div className="plain-page">
        <div className="breadcrumbs">
          <a href="#about">{text.home}</a>
          <a href="#programs">{text.chooseProgram}</a>
          <strong>{lang === 'ru' ? program.name : program.nameEn}</strong>
        </div>
        <h1>{program.code} {programName(program, lang)}</h1>
        <p className="page-lead">{programDirection(program, lang)}</p>

        <section className="program-hero-grid">
          <div className="metric-card"><span>{text.passingScore}:</span><b>{program.score}</b></div>
          <div className="metric-card"><span>{text.budgetPlaces}:</span><b>{program.budget}</b></div>
          <div className="metric-card"><span>{text.paidPlaces}:</span><b>{program.paidPlaces || (program.paid ? (lang === 'ru' ? 'Есть' : 'Yes') : 'No')}</b></div>
          <div className="metric-stack"><span>{lang === 'ru' ? program.form : program.formEn}</span><span>{durationLabel(program, lang)}</span></div>
          <Button>{text.apply}</Button>
        </section>

        <section className="program-info-grid">
          <article><h2>{text.exams}</h2>{subjects.map((subject) => <p key={subject}>{subject}</p>)}<small>{lang === 'ru' ? 'Средний мин. балл' : 'Average min score'}</small></article>
          <article><h2>{text.entrance}</h2>{subjects.map((subject) => <p key={subject}>{subject}</p>)}<small>{lang === 'ru' ? 'К перечню вступительных испытаний' : 'To entrance exams list'}</small></article>
          <article><h2>{text.institute}</h2><p>{program.institute || text.instituteName}</p><small>{lang === 'ru' ? 'Учебное подразделение' : 'Academic unit'}</small></article>
        </section>

        <section className="description-row">
          <article>
            <h2>{text.description}</h2>
            <p>{program.description || text.descriptionText}</p>
          </article>
          <aside><span>{text.costYear}</span><b>{money(program.price)}</b></aside>
        </section>

        <CardRow title={text.whatStudy} items={skills} />
        <CardRow title={text.career} items={careers} />

        <section className="partners">
          <h2>{text.partners}</h2>
          <div className="partner-logo-grid">
            {partnerLogos.map((partner) => (
              <span key={partner.name}>
                <img src={partner.src} alt={partner.name} />
              </span>
            ))}
          </div>
        </section>

        <section className="campus-grid">
          <article>
            <h2>{text.lifeTitle}</h2>
            <div className="dorm-photo">17 студенческий дом</div>
            <p>{lang === 'ru' ? 'Общежитие: адреса и заселение уточняются в отделе по работе в общежитиях.' : 'Dormitory: addresses and move-in details are confirmed by the dormitory office.'}</p>
          </article>
          <article>
            <h2>{lang === 'ru' ? 'Расположение в сердце Санкт-Петербурга' : 'Location in the heart of Saint Petersburg'}</h2>
            <p>{lang === 'ru' ? 'Университет располагает несколькими кампусами в разных частях Санкт-Петербурга.' : 'The university has several campuses in different parts of Saint Petersburg.'}</p>
            <DormMap dorm={dormitories[3]} lang={lang} />
          </article>
        </section>

        <section className="dormitories-detail">
          <h2>{lang === 'ru' ? 'Общежития' : 'Dormitories'}</h2>
          <p>{lang === 'ru' ? 'Основные адреса общежитий РГПУ им. А. И. Герцена. Количество мест по каждому зданию на официальной странице не опубликовано.' : 'Main Herzen dormitory addresses. Per-building capacity is not published on the official dormitory page.'}</p>
          <div>
            {dormitories.map((dorm) => (
              <article key={dorm.address}>
                <b>{dorm.address}</b>
                <span>{lang === 'ru' ? dorm.metro : dorm.metroEn}</span>
                <small>{lang === 'ru' ? dorm.note : dorm.noteEn}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="contacts-card">
          <h2>{text.contacts}</h2>
          <p>{lang === 'ru' ? 'Свяжитесь с нами!' : 'Contact us!'}</p>
          <b>+7 (812) 571-10-03</b>
          <span>icsto@yandex.ru</span>
        </section>

        <section className="reviews">
          <h2>{text.reviews}</h2>
          <div className="review-card-grid">
            {reviewCards.map((review) => (
              <article key={review.name}>
                <img src={review.image} alt={lang === 'ru' ? review.name : review.nameEn} />
                <div>
                  <h3>{lang === 'ru' ? review.name : review.nameEn}</h3>
                  <p>{lang === 'ru' ? review.text : review.textEn}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="detail-actions">
          <a className="back-link" href="#programs">{text.back}</a>
          <Button>{text.apply}</Button>
        </div>
      </div>
    </main>
  );
}

function CardRow({ title, items }) {
  return (
    <section className="simple-row">
      <h2>{title}</h2>
      <div>
        {items.map((item) => <article key={item}>{item}</article>)}
      </div>
    </section>
  );
}

function App() {
  const [lang, setLang] = useState('ru');
  const [route, setRoute] = useState(getRoute);
  const [activeSection, setActiveSection] = useState('about');
  const [programs, setPrograms] = useState(defaultPrograms);
  const text = dictionaries[lang];

  useEffect(() => {
    let isMounted = true;

    getPrograms()
      .then((data) => {
        if (isMounted) {
          setPrograms(data.map(normalizeProgram));
        }
      })
      .catch(() => {
        if (isMounted) {
          setPrograms(defaultPrograms);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const updateRoute = () => setRoute(getRoute());
    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);

  useEffect(() => {
    const updateActive = () => {
      if (getRoute().page !== 'home') return;
      const nextSection = sections.reduce((current, section) => {
        const element = document.getElementById(section);
        if (!element) return current;
        return element.getBoundingClientRect().top < 220 ? section : current;
      }, 'about');
      setActiveSection(nextSection);
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('hashchange', updateActive);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('hashchange', updateActive);
    };
  }, []);

  return (
    <div className="site">
      <Header lang={lang} setLang={setLang} text={text} />
      {route.page === 'home' && <HomePage lang={lang} text={text} activeSection={activeSection} />}
      {route.page === 'programs' && <ProgramsPage lang={lang} text={text} programs={programs} />}
      {route.page === 'program' && <ProgramDetailPage lang={lang} text={text} programId={route.programId} programs={programs} />}
      {route.page === 'admin' && <AdminPrograms lang={lang} />}
      <footer className="footer">
        <div>
          <h2>{text.applicants}</h2>
          <p>{text.brand}</p>
        </div>
        <div>
          <p>{lang === 'ru' ? 'Приемная комиссия' : 'Admissions Office'}</p>
          <a href="tel:+78126437730">+7 (812) 643-77-30</a>
        </div>
        <div>
          <p>{lang === 'ru' ? 'Правила приема 2026' : 'Admission rules 2026'}</p>
          <p>© 2026</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
