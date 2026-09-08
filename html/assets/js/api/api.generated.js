// AUTO GENERATED FILE - DO NOT EDIT

const API_BASE = `{APIENDPOINT}`;

export function getApiUrl(endpoint) {
  return `${API_BASE}${endpoint}`;
}

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


// ---- Request/response body type definitions ----

/**
 * @typedef {Object} PostLoginBody
 * @property {string} [username]
 * @property {string} [password]
 */
/**
 * @typedef {Object} PostUserBody
 * @property {User} user
 * @property {string} password
 */
/**
 * @typedef {Object} User
 * @property {number} userid
 * @property {string} username
 * @property {string} [email]
 * @property {UserRole} role
 * @property {string} [phonenumber]
 * @property {string} [class]
 * @property {string} [name]
 */
/**
 * @typedef {Object} UserRole
 */
/**
 * @typedef {Object} PutUserUseridBody
 * @property {string} [username]
 * @property {string} [email]
 * @property {UserRole} [role]
 * @property {string} [phonenumber]
 * @property {string} [class]
 * @property {string} [name]
 */
/**
 * @typedef {Object} PutScheduleYearWeekSlotSlotidInfoBody
 * @property {string} [info]
 */
/**
 * @typedef {Object} PostScheduleYearWeekSlotSlotidReplacementApplyBody
 * @property {string} [reason]
 */
/**
 * @typedef {Object} PostScheduleYearWeekSlotSlotidReplacementRedrawBody
 * @property {string} [reason]
 */
/**
 * @typedef {Object} PostScheduleYearWeekSlotSlotidApplyBody
 * @property {string} [reason]
 * @property {ApplicationType} [type]
 */
/**
 * @typedef {Object} ApplicationType
 */
/**
 * @typedef {Object} PostScheduleYearWeekSlotSlotidLeaveBody
 * @property {string} [reason]
 */
/**
 * @typedef {Object} PostApplicationIdActionBody
 * @property {string} [reason]
 */
/**
 * @typedef {Object} PostScheduleSlotBody
 * @property {number} weekday
 * @property {number} after - index where to insert (-1 for start)
 * @property {string} starttime
 * @property {string} endtime
 * @property {boolean} required
 * @property {string} slotName
 */
/**
 * @typedef {Object} Slot
 * @property {number} [slotId]
 * @property {number} [slotPosition]
 * @property {string} [starttime]
 * @property {string} [endtime]
 * @property {number} [weekday] - 0-7 (Mo-So)
 * @property {boolean} [required]
 * @property {string} [slotName]
 */
/**
 * @typedef {Object} PostExcuseBody
 * @property {string} [starttimestamp]
 * @property {string} [endtimestamp]
 * @property {string} [reason]
 */
/**
 * @typedef {Object} PostMissionSubscribeBody
 * @property {string} [userid]
 */
/**
 * @typedef {Object} PostMissionStartBody
 * @property {string} [Injury]
 * @property {string} [location]
 * @property {string} [Author]
 * @property {string} [additionalInformation]
 */


// ---- Request body scaffolds (call to get an editable object) ----

/**
 * Generates request body: {@link PostLoginBody}. Fields are named,
 * this coerces each field to its declared schema type
 * (e.g. a number passed for a string field becomes a string).
 * @param {Object} params
 * @param {string} [params.username]
 * @param {string} [params.password]
 * @returns {PostLoginBody}
 */
export function createPostLoginBodyTemplate({
  username = "", // optional (string)
  password = "", // optional (string)
} = {}) {
  return { username: (username == null ? username : String(username)), password: (password == null ? password : String(password)) };
}
/**
 * Generates request body: {@link string}. Fields are named,
 * this coerces each field to its declared schema type
 * (e.g. a number passed for a string field becomes a string).
 * @param {Object} params
 * @returns {string}
 */
export function createStringTemplate(params = {}) {
  return {};
}
/**
 * Generates request body: {@link PostUserBody}. Fields are named,
 * this coerces each field to its declared schema type
 * (e.g. a number passed for a string field becomes a string).
 * @param {Object} params
 * @param {User} params.user
 * @param {string} params.password
 * @returns {PostUserBody}
 */
export function createPostUserBodyTemplate({
  user, // required (User)
  password, // required (string)
} = {}) {
  return { user, password: (password == null ? password : String(password)) };
}
/**
 * Generates request body: {@link PutUserUseridBody}. Fields are named,
 * this coerces each field to its declared schema type
 * (e.g. a number passed for a string field becomes a string).
 * @param {Object} params
 * @param {string} [params.username]
 * @param {string} [params.email]
 * @param {UserRole} [params.role]
 * @param {string} [params.phonenumber]
 * @param {string} [params.class]
 * @param {string} [params.name]
 * @returns {PutUserUseridBody}
 */
export function createPutUserUseridBodyTemplate({
  username = "", // optional (string)
  email = "", // optional (string, email)
  role = "user", // optional (UserRole)
  phonenumber = "", // optional (string)
  class: class_ = "", // optional (string)
  name = "", // optional (string)
} = {}) {
  return { username: (username == null ? username : String(username)), email: (email == null ? email : String(email)), role, phonenumber: (phonenumber == null ? phonenumber : String(phonenumber)), class: (class_ == null ? class_ : String(class_)), name: (name == null ? name : String(name)) };
}
/**
 * Generates request body: {@link PutScheduleYearWeekSlotSlotidInfoBody}. Fields are named,
 * this coerces each field to its declared schema type
 * (e.g. a number passed for a string field becomes a string).
 * @param {Object} params
 * @param {string} [params.info]
 * @returns {PutScheduleYearWeekSlotSlotidInfoBody}
 */
export function createPutScheduleYearWeekSlotSlotidInfoBodyTemplate({
  info = "", // optional (string)
} = {}) {
  return { info: (info == null ? info : String(info)) };
}
/**
 * Generates request body: {@link PostScheduleYearWeekSlotSlotidReplacementApplyBody}. Fields are named,
 * this coerces each field to its declared schema type
 * (e.g. a number passed for a string field becomes a string).
 * @param {Object} params
 * @param {string} [params.reason]
 * @returns {PostScheduleYearWeekSlotSlotidReplacementApplyBody}
 */
export function createPostScheduleYearWeekSlotSlotidReplacementApplyBodyTemplate({
  reason = "", // optional (string)
} = {}) {
  return { reason: (reason == null ? reason : String(reason)) };
}
/**
 * Generates request body: {@link PostScheduleYearWeekSlotSlotidReplacementRedrawBody}. Fields are named,
 * this coerces each field to its declared schema type
 * (e.g. a number passed for a string field becomes a string).
 * @param {Object} params
 * @param {string} [params.reason]
 * @returns {PostScheduleYearWeekSlotSlotidReplacementRedrawBody}
 */
export function createPostScheduleYearWeekSlotSlotidReplacementRedrawBodyTemplate({
  reason = "", // optional (string)
} = {}) {
  return { reason: (reason == null ? reason : String(reason)) };
}
/**
 * Generates request body: {@link PostScheduleYearWeekSlotSlotidApplyBody}. Fields are named,
 * this coerces each field to its declared schema type
 * (e.g. a number passed for a string field becomes a string).
 * @param {Object} params
 * @param {string} [params.reason]
 * @param {ApplicationType} [params.type]
 * @returns {PostScheduleYearWeekSlotSlotidApplyBody}
 */
export function createPostScheduleYearWeekSlotSlotidApplyBodyTemplate({
  reason = "", // optional (string)
  type = "base", // optional (ApplicationType)
} = {}) {
  return { reason: (reason == null ? reason : String(reason)), type };
}
/**
 * Generates request body: {@link PostScheduleYearWeekSlotSlotidLeaveBody}. Fields are named,
 * this coerces each field to its declared schema type
 * (e.g. a number passed for a string field becomes a string).
 * @param {Object} params
 * @param {string} [params.reason]
 * @returns {PostScheduleYearWeekSlotSlotidLeaveBody}
 */
export function createPostScheduleYearWeekSlotSlotidLeaveBodyTemplate({
  reason = "", // optional (string)
} = {}) {
  return { reason: (reason == null ? reason : String(reason)) };
}
/**
 * Generates request body: {@link PostApplicationIdActionBody}. Fields are named,
 * this coerces each field to its declared schema type
 * (e.g. a number passed for a string field becomes a string).
 * @param {Object} params
 * @param {string} [params.reason]
 * @returns {PostApplicationIdActionBody}
 */
export function createPostApplicationIdActionBodyTemplate({
  reason = "", // optional (string)
} = {}) {
  return { reason: (reason == null ? reason : String(reason)) };
}
/**
 * Generates request body: {@link PostScheduleSlotBody}. Fields are named,
 * this coerces each field to its declared schema type
 * (e.g. a number passed for a string field becomes a string).
 * @param {Object} params
 * @param {number} params.weekday
 * @param {number} params.after
 * @param {string} params.starttime
 * @param {string} params.endtime
 * @param {boolean} params.required
 * @param {string} params.slotName
 * @returns {PostScheduleSlotBody}
 */
export function createPostScheduleSlotBodyTemplate({
  weekday, // required (integer)
  after, // required (integer)
  starttime, // required (string, date-time)
  endtime, // required (string, date-time)
  required, // required (boolean)
  slotName, // required (string)
} = {}) {
  return { weekday: (weekday == null ? weekday : Number(weekday)), after: (after == null ? after : Number(after)), starttime: (starttime == null ? starttime : String(starttime)), endtime: (endtime == null ? endtime : String(endtime)), required: (required == null ? required : Boolean(required)), slotName: (slotName == null ? slotName : String(slotName)) };
}
/**
 * Generates request body: {@link Slot}. Fields are named,
 * this coerces each field to its declared schema type
 * (e.g. a number passed for a string field becomes a string).
 * @param {Object} params
 * @param {number} [params.slotId]
 * @param {number} [params.slotPosition]
 * @param {string} [params.starttime]
 * @param {string} [params.endtime]
 * @param {number} [params.weekday]
 * @param {boolean} [params.required]
 * @param {string} [params.slotName]
 * @returns {Slot}
 */
export function createSlotTemplate({
  slotId = 0, // optional (integer)
  slotPosition = 0, // optional (integer)
  starttime = "", // optional (string, date-time)
  endtime = "", // optional (string, date-time)
  weekday = 0, // optional (integer)
  required = false, // optional (boolean)
  slotName = "", // optional (string)
} = {}) {
  return { slotId: (slotId == null ? slotId : Number(slotId)), slotPosition: (slotPosition == null ? slotPosition : Number(slotPosition)), starttime: (starttime == null ? starttime : String(starttime)), endtime: (endtime == null ? endtime : String(endtime)), weekday: (weekday == null ? weekday : Number(weekday)), required: (required == null ? required : Boolean(required)), slotName: (slotName == null ? slotName : String(slotName)) };
}
/**
 * Generates request body: {@link PostExcuseBody}. Fields are named,
 * this coerces each field to its declared schema type
 * (e.g. a number passed for a string field becomes a string).
 * @param {Object} params
 * @param {string} [params.starttimestamp]
 * @param {string} [params.endtimestamp]
 * @param {string} [params.reason]
 * @returns {PostExcuseBody}
 */
export function createPostExcuseBodyTemplate({
  starttimestamp = "", // optional (string, date-time)
  endtimestamp = "", // optional (string, date-time)
  reason = "", // optional (string)
} = {}) {
  return { starttimestamp: (starttimestamp == null ? starttimestamp : String(starttimestamp)), endtimestamp: (endtimestamp == null ? endtimestamp : String(endtimestamp)), reason: (reason == null ? reason : String(reason)) };
}
/**
 * Generates request body: {@link PostMissionSubscribeBody}. Fields are named,
 * this coerces each field to its declared schema type
 * (e.g. a number passed for a string field becomes a string).
 * @param {Object} params
 * @param {string} [params.userid]
 * @returns {PostMissionSubscribeBody}
 */
export function createPostMissionSubscribeBodyTemplate({
  userid = "", // optional (string)
} = {}) {
  return { userid: (userid == null ? userid : String(userid)) };
}
/**
 * Generates request body: {@link PostMissionStartBody}. Fields are named,
 * this coerces each field to its declared schema type
 * (e.g. a number passed for a string field becomes a string).
 * @param {Object} params
 * @param {string} [params.Injury]
 * @param {string} [params.location]
 * @param {string} [params.Author]
 * @param {string} [params.additionalInformation]
 * @returns {PostMissionStartBody}
 */
export function createPostMissionStartBodyTemplate({
  Injury = "", // optional (string)
  location = "", // optional (string)
  Author = "", // optional (string)
  additionalInformation = "", // optional (string)
} = {}) {
  return { Injury: (Injury == null ? Injury : String(Injury)), location: (location == null ? location : String(location)), Author: (Author == null ? Author : String(Author)), additionalInformation: (additionalInformation == null ? additionalInformation : String(additionalInformation)) };
}


// ---- Endpoints ----

/**
 * POST /login
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L185 - endpoint definition in the OpenAPI spec
 * @param {PostLoginBody} body - see {@link PostLoginBody} for generation: {@link createPostLoginBodyTemplate()}
 * @returns {Promise<any>}
 */
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


/**
 * POST /logout
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L207 - endpoint definition in the OpenAPI spec
 * @returns {Promise<any>}
 */
export async function postLogout() {
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
    },
    pathParams
  );
}


/**
 * GET /user/me
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L216 - endpoint definition in the OpenAPI spec
 * @returns {Promise<any>}
 */
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


/**
 * GET /user/me/alerts
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L229 - endpoint definition in the OpenAPI spec
 * @returns {Promise<any>}
 */
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


/**
 * GET /user/me/setting/
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L244 - endpoint definition in the OpenAPI spec
 * @returns {Promise<any>}
 */
export async function getUserMeSetting() {
  const pathParams = {};
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user/me/setting/`;
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


/**
 * GET /user/me/setting/{setting}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L265 - endpoint definition in the OpenAPI spec
 * @param {string} setting
 * @returns {Promise<any>}
 */
export async function getUserMeSettingSetting(setting) {
  const pathParams = {
    setting,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user/me/setting/${p.setting}`;
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


/**
 * POST /user/me/setting/{setting}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L277 - endpoint definition in the OpenAPI spec
 * @param {string} setting
 * @param {string} body - see {@link string} for generation: {@link createStringTemplate()}
 * @returns {Promise<any>}
 */
export async function postUserMeSettingSetting(setting, body) {
  const pathParams = {
    setting,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user/me/setting/${p.setting}`;
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


/**
 * DELETE /user/me/setting/{setting}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L290 - endpoint definition in the OpenAPI spec
 * @param {string} setting
 * @returns {Promise<any>}
 */
export async function deleteUserMeSettingSetting(setting) {
  const pathParams = {
    setting,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user/me/setting/${p.setting}`;
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


/**
 * POST /user
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L299 - endpoint definition in the OpenAPI spec
 * @param {PostUserBody} body - see {@link PostUserBody} for generation: {@link createPostUserBodyTemplate()}
 * @returns {Promise<any>}
 */
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


/**
 * GET /user/list
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L323 - endpoint definition in the OpenAPI spec
 * @returns {Promise<any>}
 */
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


/**
 * GET /user/{userID}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L345 - endpoint definition in the OpenAPI spec
 * @param {string} userID
 * @returns {Promise<any>}
 */
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


/**
 * PUT /user/{userID}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L357 - endpoint definition in the OpenAPI spec
 * @param {string} userID
 * @param {PutUserUseridBody} body - see {@link PutUserUseridBody} for generation: {@link createPutUserUseridBodyTemplate()}
 * @returns {Promise<any>}
 */
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


/**
 * DELETE /user/{userID}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L384 - endpoint definition in the OpenAPI spec
 * @param {string} userID
 * @returns {Promise<any>}
 */
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


/**
 * GET /user/{userID}/testcall
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L399 - endpoint definition in the OpenAPI spec
 * @param {string} userID
 * @returns {Promise<any>}
 */
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


/**
 * GET /user/{userID}/setting/
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L414 - endpoint definition in the OpenAPI spec
 * @param {string} userID
 * @returns {Promise<any>}
 */
export async function getUserUseridSetting(userID) {
  const pathParams = {
    userID,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user/${p.userID}/setting/`;
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


/**
 * GET /user/{userID}/setting/{setting}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L440 - endpoint definition in the OpenAPI spec
 * @param {string} userID
 * @param {string} setting
 * @returns {Promise<any>}
 */
export async function getUserUseridSettingSetting(userID, setting) {
  const pathParams = {
    userID,
    setting,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user/${p.userID}/setting/${p.setting}`;
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


/**
 * POST /user/{userID}/setting/{setting}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L452 - endpoint definition in the OpenAPI spec
 * @param {string} userID
 * @param {string} setting
 * @param {string} body - see {@link string} for generation: {@link createStringTemplate()}
 * @returns {Promise<any>}
 */
export async function postUserUseridSettingSetting(userID, setting, body) {
  const pathParams = {
    userID,
    setting,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user/${p.userID}/setting/${p.setting}`;
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


/**
 * DELETE /user/{userID}/setting/{setting}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L465 - endpoint definition in the OpenAPI spec
 * @param {string} userID
 * @param {string} setting
 * @returns {Promise<any>}
 */
export async function deleteUserUseridSettingSetting(userID, setting) {
  const pathParams = {
    userID,
    setting,
  };
  const queryParams = {};

  const queryString = buildQueryString(queryParams);

  const url = (p) => {
    const base = `/user/${p.userID}/setting/${p.setting}`;
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


/**
 * GET /schedule/{year}/{week}/
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L485 - endpoint definition in the OpenAPI spec
 * @param {string} year
 * @param {string} week
 * @returns {Promise<any>}
 */
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


/**
 * GET /schedule/{year}/{week}/slot/{slotID}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L519 - endpoint definition in the OpenAPI spec
 * @param {string} year
 * @param {string} week
 * @param {string} slotID
 * @returns {Promise<any>}
 */
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


/**
 * PUT /schedule/{year}/{week}/slot/{slotID}/info
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L548 - endpoint definition in the OpenAPI spec
 * @param {string} year
 * @param {string} week
 * @param {string} slotID
 * @param {PutScheduleYearWeekSlotSlotidInfoBody} body - see {@link PutScheduleYearWeekSlotSlotidInfoBody} for generation: {@link createPutScheduleYearWeekSlotSlotidInfoBodyTemplate()}
 * @returns {Promise<any>}
 */
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


/**
 * POST /schedule/{year}/{week}/slot/{slotID}/replacement/apply
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L582 - endpoint definition in the OpenAPI spec
 * @param {string} year
 * @param {string} week
 * @param {string} slotID
 * @param {PostScheduleYearWeekSlotSlotidReplacementApplyBody} body - see {@link PostScheduleYearWeekSlotSlotidReplacementApplyBody} for generation: {@link createPostScheduleYearWeekSlotSlotidReplacementApplyBodyTemplate()}
 * @returns {Promise<any>}
 */
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


/**
 * POST /schedule/{year}/{week}/slot/{slotID}/replacement/redraw
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L615 - endpoint definition in the OpenAPI spec
 * @param {string} year
 * @param {string} week
 * @param {string} slotID
 * @param {PostScheduleYearWeekSlotSlotidReplacementRedrawBody} body - see {@link PostScheduleYearWeekSlotSlotidReplacementRedrawBody} for generation: {@link createPostScheduleYearWeekSlotSlotidReplacementRedrawBodyTemplate()}
 * @returns {Promise<any>}
 */
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


/**
 * POST /schedule/{year}/{week}/slot/{slotID}/apply
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L648 - endpoint definition in the OpenAPI spec
 * @param {string} year
 * @param {string} week
 * @param {string} slotID
 * @param {PostScheduleYearWeekSlotSlotidApplyBody} body - see {@link PostScheduleYearWeekSlotSlotidApplyBody} for generation: {@link createPostScheduleYearWeekSlotSlotidApplyBodyTemplate()}
 * @returns {Promise<any>}
 */
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


/**
 * POST /schedule/{year}/{week}/slot/{slotID}/leave
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L692 - endpoint definition in the OpenAPI spec
 * @param {string} year
 * @param {string} week
 * @param {string} slotID
 * @param {PostScheduleYearWeekSlotSlotidLeaveBody} body - see {@link PostScheduleYearWeekSlotSlotidLeaveBody} for generation: {@link createPostScheduleYearWeekSlotSlotidLeaveBodyTemplate()}
 * @returns {Promise<any>}
 */
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


/**
 * GET /application
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L711 - endpoint definition in the OpenAPI spec
 * @param {string} [filter]
 * @param {string} [startdate]
 * @param {string} [enddate]
 * @param {string} [userid]
 * @returns {Promise<any>}
 */
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


/**
 * GET /application/{id}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L752 - endpoint definition in the OpenAPI spec
 * @param {string} id
 * @returns {Promise<any>}
 */
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


/**
 * POST /application/{id}/{action}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L777 - endpoint definition in the OpenAPI spec
 * @param {string} id
 * @param {string} action
 * @param {PostApplicationIdActionBody} body - see {@link PostApplicationIdActionBody} for generation: {@link createPostApplicationIdActionBodyTemplate()}
 * @returns {Promise<any>}
 */
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


/**
 * GET /schedule/slot
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L795 - endpoint definition in the OpenAPI spec
 * @param {number} [w]
 * @param {number} [year]
 * @returns {Promise<any>}
 */
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


/**
 * POST /schedule/slot
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L818 - endpoint definition in the OpenAPI spec
 * @param {PostScheduleSlotBody} body - see {@link PostScheduleSlotBody} for generation: {@link createPostScheduleSlotBodyTemplate()}
 * @returns {Promise<any>}
 */
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


/**
 * GET /schedule/slot/{id}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L856 - endpoint definition in the OpenAPI spec
 * @param {string} id
 * @returns {Promise<any>}
 */
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


/**
 * PUT /schedule/slot/{id}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L868 - endpoint definition in the OpenAPI spec
 * @param {string} id
 * @param {Slot} body - see {@link Slot} for generation: {@link createSlotTemplate()}
 * @returns {Promise<any>}
 */
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


/**
 * DELETE /schedule/slot/{id}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L885 - endpoint definition in the OpenAPI spec
 * @param {string} id
 * @returns {Promise<any>}
 */
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


/**
 * POST /excuse
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L895 - endpoint definition in the OpenAPI spec
 * @param {PostExcuseBody} body - see {@link PostExcuseBody} for generation: {@link createPostExcuseBodyTemplate()}
 * @returns {Promise<any>}
 */
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


/**
 * GET /excuse/list
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L923 - endpoint definition in the OpenAPI spec
 * @param {string} [startdate]
 * @param {string} [enddate]
 * @param {string} [filter]
 * @param {number} [page]
 * @param {number} [page_size]
 * @returns {Promise<any>}
 */
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


/**
 * GET /excuse/list/admin
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L987 - endpoint definition in the OpenAPI spec
 * @param {string} [startdate]
 * @param {string} [enddate]
 * @param {string} [filter]
 * @param {string} [users]
 * @param {number} [page]
 * @param {number} [page_size]
 * @returns {Promise<any>}
 */
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


/**
 * GET /excuse/{id}/
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L1062 - endpoint definition in the OpenAPI spec
 * @param {string} id
 * @returns {Promise<any>}
 */
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


/**
 * POST /excuse/{id}/{action}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L1088 - endpoint definition in the OpenAPI spec
 * @param {string} id
 * @param {string} action
 * @returns {Promise<any>}
 */
export async function postExcuseIdAction(id, action) {
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
    },
    pathParams
  );
}


/**
 * GET /mission/list
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L1100 - endpoint definition in the OpenAPI spec
 * @param {string} [startdate]
 * @param {string} [enddate]
 * @param {boolean} [ids_only]
 * @param {number} [page]
 * @param {number} [page_size]
 * @returns {Promise<any>}
 */
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


/**
 * GET /mission/{id}
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L1177 - endpoint definition in the OpenAPI spec
 * @param {string} id
 * @returns {Promise<any>}
 */
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


/**
 * GET /mission/active
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L1188 - endpoint definition in the OpenAPI spec
 * @returns {Promise<any>}
 */
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


/**
 * POST /mission/subscribe
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L1201 - endpoint definition in the OpenAPI spec
 * @param {PostMissionSubscribeBody} body - see {@link PostMissionSubscribeBody} for generation: {@link createPostMissionSubscribeBodyTemplate()}
 * @returns {Promise<any>}
 */
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


/**
 * POST /mission/start
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L1218 - endpoint definition in the OpenAPI spec
 * @param {PostMissionStartBody} body - see {@link PostMissionStartBody} for generation: {@link createPostMissionStartBodyTemplate()}
 * @returns {Promise<any>}
 */
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


/**
 * GET /mission/{id}/status
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L1247 - endpoint definition in the OpenAPI spec
 * @param {string} id
 * @returns {Promise<any>}
 */
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


/**
 * GET /mission/{id}/status/subscribe
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L1265 - endpoint definition in the OpenAPI spec
 * @param {string} id
 * @returns {Promise<any>}
 */
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


/**
 * GET /system/health
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L1279 - endpoint definition in the OpenAPI spec
 * @returns {Promise<any>}
 */
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


/**
 * GET /system/health/module
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L1290 - endpoint definition in the OpenAPI spec
 * @returns {Promise<any>}
 */
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


/**
 * GET /system/health/db
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L1297 - endpoint definition in the OpenAPI spec
 * @returns {Promise<any>}
 */
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


/**
 * GET /system/health/api
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L1304 - endpoint definition in the OpenAPI spec
 * @returns {Promise<any>}
 */
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


/**
 * GET /system/moduleWS
 * @see  https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/15f2a48851b3d52c20e04cfae681d1fd20df916c/swagger.yml#L1312 - endpoint definition in the OpenAPI spec
 * @returns {Promise<any>}
 */
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

