DROP TABLE IF EXISTS program_exams;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS programs;
DROP TABLE IF EXISTS exams;
DROP TABLE IF EXISTS institutes;
GO

CREATE TABLE institutes (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(255) NOT NULL UNIQUE
);
GO

CREATE TABLE programs (
  id INT IDENTITY(1,1) PRIMARY KEY,
  institute_id INT NOT NULL,
  code NVARCHAR(20) NOT NULL,
  name NVARCHAR(255) NOT NULL,
  degree_level NVARCHAR(50) NOT NULL,
  duration_years INT NOT NULL,
  study_form NVARCHAR(20) NOT NULL,
  tuition_fee INT NULL,
  budget_places INT NOT NULL DEFAULT 0,
  paid_places INT NOT NULL DEFAULT 0,
  passing_score INT NOT NULL,

  CONSTRAINT FK_programs_institutes
    FOREIGN KEY (institute_id) REFERENCES institutes(id),
  CONSTRAINT CK_programs_duration
    CHECK (duration_years > 0),
  CONSTRAINT CK_programs_study_form
    CHECK (study_form IN (N'Очная', N'Заочная', N'Очно-заочная')),
  CONSTRAINT CK_programs_tuition_fee
    CHECK (tuition_fee IS NULL OR tuition_fee >= 0),
  CONSTRAINT CK_programs_budget_places
    CHECK (budget_places >= 0),
  CONSTRAINT CK_programs_paid_places
    CHECK (paid_places >= 0),
  CONSTRAINT CK_programs_passing_score
    CHECK (passing_score BETWEEN 0 AND 400)
);
GO

CREATE TABLE exams (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  level NVARCHAR(40) NOT NULL,
  CONSTRAINT UQ_exams_name_level UNIQUE (name, level)
);
GO

CREATE TABLE program_exams (
  program_id INT NOT NULL,
  exam_id INT NOT NULL,
  min_score INT NOT NULL,

  CONSTRAINT PK_program_exams
    PRIMARY KEY (program_id, exam_id),
  CONSTRAINT FK_program_exams_programs
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  CONSTRAINT FK_program_exams_exams
    FOREIGN KEY (exam_id) REFERENCES exams(id),
  CONSTRAINT CK_program_exams_min_score
    CHECK (min_score BETWEEN 0 AND 100)
);
GO

CREATE TABLE events (
  id INT IDENTITY(1,1) PRIMARY KEY,
  institute_id INT NOT NULL,
  name NVARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  description NVARCHAR(MAX) NULL,

  CONSTRAINT FK_events_institutes
    FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_programs_institute_id ON programs(institute_id);
CREATE INDEX IX_programs_passing_score ON programs(passing_score);
CREATE INDEX IX_programs_study_form ON programs(study_form);
CREATE INDEX IX_program_exams_exam_id ON program_exams(exam_id);
GO
