class TimeDisplay extends HTMLElement {
  static get observedAttributes() {
    return [
      "date-format",
      "time-format",
      "show-date",
      "show-countdown"
    ];
  }

  constructor() {
    super();

    this._timer = null;
    this._targetDate = null;
  }

  connectedCallback() {
    this.parseTime();
    this.start();
  }

  disconnectedCallback() {
    this.stop();
  }

  attributeChangedCallback() {
    this.update();
  }

  // =========================
  // ATTRIBUTES
  // =========================

  get dateFormat() {
    return this.getAttribute("date-format") || "dd.MM.yyyy";
  }

  get timeFormat() {
    return this.getAttribute("time-format") || "HH:mm";
  }

  get showDate() {
    return this.getAttribute("show-date") || "always";
  }

  get showCountdown() {
    return this.getAttribute("show-countdown") === "true";
  }

  // =========================
  // INIT
  // =========================

  parseTime() {
    const text = this.textContent.trim();
    const date = new Date(text);

    if (isNaN(date.getTime())) {
      // console.error("Invalid date:", text);
      return;
    }

    this._targetDate = date;
  }

start() {
  if (!this._targetDate) return;

  this._lastRendered = "";

  this.observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        this.startTicker();
      } else {
        this.stopTicker();
      }
    }
  });

  this.observer.observe(this);
}
  startTicker() {
    if (this._timer) return;

    this.update(); // initial render

    this._timer = setInterval(() => {
      this.update();
    }, 1000);
  }

  stopTicker() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }
  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  // =========================
  // MAIN LOGIC
  // =========================

  update() {
    if (!this._targetDate) return;

    const now = new Date();
    const diff = this._targetDate - now;

    const isToday =
      this._targetDate.toDateString() === now.toDateString();
    const shouldCountdown = this.shouldShowCountdown(diff);

    let result = "";

    if (shouldCountdown) {
      result = this.formatCountdown(diff);
    } else {
      result = this.formatDateTime(isToday);
    }

    this.textContent = result;
  }

  // =========================
  // RULES
  // =========================

  shouldShowCountdown(diff) {
    if (!this.showCountdown) return false;

    const hours = diff / (1000 * 60 * 60);
    return hours <= 2 && hours > -2;
  }

  // =========================
  // FORMATTING
  // =========================

  formatDateTime(isToday) {
    const dateStr = this.formatDate(this._targetDate);
    const timeStr = this.formatTime(this._targetDate);

    let parts = [];

    const showDate =
      this.showDate === "always" ||
      ((this.showDate === "nottoday" || this.showDate === "notToday")&& !isToday);

    if (showDate) parts.push(dateStr);

    parts.push(timeStr);

    return parts.join(" ").trim();
  }

  formatDate(date) {
    return this.applyFormat(date, this.dateFormat, true);
  }

  formatTime(date) {
    return this.applyFormat(date, this.timeFormat, false);
  }

  // =========================
  // FORMAT ENGINE
  // =========================

  applyFormat(date, format, isDate) {
    const pad = (n) => String(n).padStart(2, "0");

    const map = {
      // date
      dd: pad(date.getDate()),
      MM: pad(date.getMonth() + 1),
      yyyy: date.getFullYear(),

      // time
      HH: pad(date.getHours()),
      mm: pad(date.getMinutes()),
      ss: pad(date.getSeconds())
    };

    return format.replace(/dd|MM|yyyy|HH|mm|ss/g, (m) => map[m] ?? m);
  }

  formatCountdown(ms) {
  const isPast = ms < 0;
  const abs = Math.abs(ms);

  const totalSeconds = Math.floor(abs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let parts = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (hours === 0 && minutes === 0) parts.push(`${seconds}s`);

  const text = parts.join(" ");

  return isPast ? `${text} ago` : `in ${text}`;
}
}

customElements.define("time-display", TimeDisplay);