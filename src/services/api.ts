const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getPrograms() {
  return request('/programs');
}

export async function getProgram(id: string | number) {
  return request(`/programs/${id}`);
}

export async function createProgram(data: unknown) {
  return request('/programs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateProgram(id: string | number, data: unknown) {
  return request(`/programs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteProgram(id: string | number) {
  return request(`/programs/${id}`, {
    method: 'DELETE',
  });
}

export async function getInstitutes() {
  return request('/institutes');
}

export async function getExams() {
  return request('/exams');
}

export async function getProgramExams() {
  return request('/program_exams');
}
