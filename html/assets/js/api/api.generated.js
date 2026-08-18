// AUTO GENERATED FILE - DO NOT EDIT

const API_BASE = `${window.location.protocol}//${window.location.hostname}:8080`;

async function apiFetch(endpoint, options = {}, params = {}) {
  const token = localStorage.getItem("jwt");

  const url =
    typeof endpoint === "function"
      ? `${API_BASE}${endpoint(params)}`
      : `${API_BASE}${endpoint}`;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status == 204){
    return {}
  }
  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
  return res.json();
  }

  return {};
}


function buildQueryString(queryParams) {
  return Object.entries(queryParams)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}


export async function postLogin(body) {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/login`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'POST',
      body,
    },
    pathParams
  );
}


export async function postLogout(body) {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/logout`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'POST',
      body,
    },
    pathParams
  );
}


export async function getUserMe() {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user/me`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function getUserMeAlerts() {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user/me/alerts`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function postUser(body) {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'POST',
      body,
    },
    pathParams
  );
}


export async function getUserList() {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user/list`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function getUserUserid(userID) {
  const pathParams = {
    userID,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user/${p.userID}`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function putUserUserid(userID, body) {
  const pathParams = {
    userID,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user/${p.userID}`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'PUT',
      body,
    },
    pathParams
  );
}


export async function deleteUserUserid(userID) {
  const pathParams = {
    userID,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user/${p.userID}`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'DELETE',
    },
    pathParams
  );
}


export async function getUserUseridTestcall(userID) {
  const pathParams = {
    userID,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user/${p.userID}/testcall`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function getScheduleYearWeek(year, week) {
  const pathParams = {
    year,
    week,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/schedule/${p.year}/${p.week}/`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function getScheduleYearWeekSlotSlotid(year, week, slotID) {
  const pathParams = {
    year,
    week,
    slotID,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/schedule/${p.year}/${p.week}/slot/${p.slotID}`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function putScheduleYearWeekSlotSlotidInfo(year, week, slotID, body) {
  const pathParams = {
    year,
    week,
    slotID,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/schedule/${p.year}/${p.week}/slot/${p.slotID}/info`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'PUT',
      body,
    },
    pathParams
  );
}


export async function postScheduleYearWeekSlotSlotidReplacementApply(year, week, slotID, body) {
  const pathParams = {
    year,
    week,
    slotID,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/schedule/${p.year}/${p.week}/slot/${p.slotID}/replacement/apply`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'POST',
      body,
    },
    pathParams
  );
}


export async function postScheduleYearWeekSlotSlotidReplacementRedraw(year, week, slotID, body) {
  const pathParams = {
    year,
    week,
    slotID,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/schedule/${p.year}/${p.week}/slot/${p.slotID}/replacement/redraw`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'POST',
      body,
    },
    pathParams
  );
}


export async function postScheduleYearWeekSlotSlotidApply(year, week, slotID, body) {
  const pathParams = {
    year,
    week,
    slotID,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/schedule/${p.year}/${p.week}/slot/${p.slotID}/apply`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'POST',
      body,
    },
    pathParams
  );
}


export async function postScheduleYearWeekSlotSlotidLeave(year, week, slotID, body) {
  const pathParams = {
    year,
    week,
    slotID,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/schedule/${p.year}/${p.week}/slot/${p.slotID}/leave`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'POST',
      body,
    },
    pathParams
  );
}


export async function getApplication(filter, startdate, enddate, userid) {
  const pathParams = {};
  const queryParams = {
    filter,
    startdate,
    enddate,
    userid,
  };

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/application`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function getApplicationId(id) {
  const pathParams = {
    id,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/application/${p.id}`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function postApplicationIdAction(id, action, body) {
  const pathParams = {
    id,
    action,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/application/${p.id}/${p.action}`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'POST',
      body,
    },
    pathParams
  );
}


export async function getScheduleSlot(w, year) {
  const pathParams = {};
  const queryParams = {
    w,
    year,
  };

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/schedule/slot`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function postScheduleSlot(body) {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/schedule/slot`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'POST',
      body,
    },
    pathParams
  );
}


export async function getScheduleSlotId(id) {
  const pathParams = {
    id,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/schedule/slot/${p.id}`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function putScheduleSlotId(id, body) {
  const pathParams = {
    id,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/schedule/slot/${p.id}`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'PUT',
      body,
    },
    pathParams
  );
}


export async function deleteScheduleSlotId(id) {
  const pathParams = {
    id,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/schedule/slot/${p.id}`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'DELETE',
    },
    pathParams
  );
}


export async function postExcuse(body) {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/excuse`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'POST',
      body,
    },
    pathParams
  );
}


export async function getExcuseList(startdate, enddate, filter, page, page_size) {
  const pathParams = {};
  const queryParams = {
    startdate,
    enddate,
    filter,
    page,
    page_size,
  };

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/excuse/list`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function getExcuseListAdmin(startdate, enddate, filter, users, page, page_size) {
  const pathParams = {};
  const queryParams = {
    startdate,
    enddate,
    filter,
    users,
    page,
    page_size,
  };

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/excuse/list/admin`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function getExcuseId(id) {
  const pathParams = {
    id,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/excuse/${p.id}/`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function postExcuseIdAction(id, action, body) {
  const pathParams = {
    id,
    action,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/excuse/${p.id}/${p.action}`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'POST',
      body,
    },
    pathParams
  );
}


export async function getMissionList(startdate, enddate, ids_only, page, page_size) {
  const pathParams = {};
  const queryParams = {
    startdate,
    enddate,
    ids_only,
    page,
    page_size,
  };

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/mission/list`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function getMissionId(id) {
  const pathParams = {
    id,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/mission/${p.id}`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function getMissionActive() {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/mission/active`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function postMissionSubscribe(body) {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/mission/subscribe`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'POST',
      body,
    },
    pathParams
  );
}


export async function postMissionStart(body) {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/mission/start`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'POST',
      body,
    },
    pathParams
  );
}


export async function getMissionIdStatus(id) {
  const pathParams = {
    id,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/mission/${p.id}/status`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function getMissionIdStatusSubscribe(id) {
  const pathParams = {
    id,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/mission/${p.id}/status/subscribe`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function getSystemHealth() {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/system/health`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function getSystemHealthModule() {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/system/health/module`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function getSystemHealthDb() {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/system/health/db`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function getSystemHealthApi() {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/system/health/api`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}


export async function getSystemModulews() {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/system/moduleWS`;
    return queryString ? `${base}?${queryString}` : base;
  };

  return apiFetch(
    url,
    {
      method: 'GET',
    },
    pathParams
  );
}

