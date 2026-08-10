import { APIElement } from '../../api-element.js';
import {
  getApplicationId,
  getUserMe,
  postApplicationIdAction
} from '../../../api/api.generated.js';
import { escapeHtml, getStoredUser, waitForStoredUser } from '../../../util.js';

class ApplicationViewer extends APIElement {

  static get observedAttributes() {
    return [
      'id',
      'data',
      'collapsed',
      'hideslot',
      'isadmin'
    ];
  }

  async fetchById(id) {
    this.me = await getUserMe();
    return await getApplicationId(id);
  }

  additionalLoading() {
    // Try to load the user immediately
    this.me = getStoredUser();

    // Wait up to 3 seconds if the user is not available yet
    if (!this.me) {
      (async () => {
        this.me = await waitForStoredUser(3000);
        this.load()
      })();
    }

    // Use the loaded user
    this.userId = this.me?.id ?? null;
  }

  async doAction(action) {
    try {
      await postApplicationIdAction(
        this.id,
        action,
        {
          reason: ''
        }
      );
      this.setAttribute("id", this.id)
      this.removeAttribute("data")
      await this.additionalLoading();
      await this.load();
    } catch (err) {
      console.log('err:', err);
      this.container.querySelector(".errorarea").innerHTML = this.renderError(err, alert = true);


    }
  }

  setupEvents() {

    this.container.querySelector('.approve-btn')?.addEventListener('click', () => { this.doAction('approve'); });

    this.container.querySelector('.deny-btn')?.addEventListener('click', () => { this.doAction('deny'); });

    this.container.querySelector('.approve-leave-btn')?.addEventListener('click', () => { this.doAction('approveLeave'); });

    this.container.querySelector('.deny-leave-btn')?.addEventListener('click', () => { this.doAction('denyLeave'); });

    this.container.querySelector('.leave-btn')?.addEventListener('click', () => { this.doAction('leaveRequest'); });
  }

render(application) {
  this.id = application.id;

  let isAdmin = false;
  let isMe = false;

  let canLeave = false;
  let canApprove = false;
  let canApproveLeave = false;

  if (this.me) {
    isAdmin = this.me.role === 'admin';

    isMe = this.me.userid === application.user?.userid;
  }

  if (isMe) {
    if (
      application.status === 'open' ||
      application.status === 'approved' ||
      application.status === 'leaveDenied'
    ) {
      canLeave = true;
    }
  }

  if (isAdmin) {
    if (application.status === 'open') {
      canApprove = true;
    }

    if (application.status === 'leaveRequest') {
      canApproveLeave = true;
    }
  }

  let statusColor = '';

  switch (application.status) {
    case 'approved':
      statusColor = 'green';
      break;

    case 'denied':
    case 'leaveDenied':
      statusColor = 'red';
      break;

    case 'inactive':
    case 'leaved':
    case 'redraw':
      statusColor = 'gray';
      break;

    case 'leaveRequest':
    case 'open':
      statusColor = 'orange';
      break;

    default:
      statusColor = 'gray';
      break;
  }

  const hasValue = value =>
    value !== null &&
    value !== undefined &&
    String(value).trim() !== '';

  const status = hasValue(application.status)
    ? application.status
    : null;

  const applicationId = hasValue(application.id)
    ? application.id
    : null;

  const startDate = hasValue(application.startdate)
    ? application.startdate
    : null;

  const endDate = hasValue(application.enddate)
    ? application.enddate
    : null;

  const reason = hasValue(application.reason)
    ? application.reason
    : null;

  const type = hasValue(application.type)
    ? application.type
    : null;

  return /*html*/`
    <div class="application-viewer">

      <!-- =================================================
           Status
           ================================================= -->

      ${status ? /*html*/`
        <div class="application-status">

          <ssd-icon
            color="${statusColor}"
            name="status/${escapeHtml(status)}">
          </ssd-icon>

          <span class="status-label">
            <x-translation>application.status.status</x-translation>
          </span>

          <span class="status-value">
              <x-translation>application.status.${escapeHtml(status)}</x-translation>
          </span>

        </div>
      ` : ''}


      <!-- =================================================
           Application information
           ================================================= -->

      <div class="application-info">

        ${applicationId ? /*html*/`
          <div class="application-field application-id">
            <span class="label">
              <x-translation>application.id</x-translation>
            </span>

            <span class="value">
              ${escapeHtml(String(applicationId))}
            </span>
          </div>
        ` : ''}


        ${type ? /*html*/`
          <div class="application-field application-type">
            <span class="label">
              <x-translation>application.type.type</x-translation>
            </span>

            <span class="value">
            <x-translation>application.type.${escapeHtml(String(type))}</x-translation>
            </span>
          </div>
        ` : ''}


        ${startDate ? /*html*/`
          <div class="application-field application-date">
            <span class="label">
              <x-translation>application.startdate</x-translation>
            </span>

            <time-display
              show-countdown="false"
              show-date="always">
              ${escapeHtml(String(startDate))}
            </time-display>
          </div>
        ` : ''}


        ${endDate ? /*html*/`
          <div class="application-field application-date">
            <span class="label">
              <x-translation>application.enddate</x-translation>
            </span>

            <time-display
              show-countdown="false"
              show-date="always">
              ${escapeHtml(String(endDate))}
            </time-display>
          </div>
        ` : ''}

      </div>


      <!-- =================================================
           Reason
           ================================================= -->

      ${reason ? /*html*/`
        <div class="application-reason">

          <span class="label">
            <x-translation>application.reason</x-translation>
          </span>

          <span class="value">
            ${escapeHtml(String(reason))}
          </span>

        </div>
      ` : ''}


      <!-- =================================================
           Slot
           ================================================= -->

      ${!this.hasAttribute('hideslot') && application.slot
        ? /*html*/`
          <div class="application-slot">
            <ssd-slot
              data='${JSON.stringify(application.slot)}'>
            </ssd-slot>
          </div>
        `
        : ''
      }


      <!-- =================================================
           User
           ================================================= -->

      ${application.user
        ? /*html*/`
          <div class="application-user">
            <ssd-intra-user
              data='${JSON.stringify(application.user)}'>
            </ssd-intra-user>
          </div>
        `
        : ''
      }


      <!-- =================================================
           Actions
           ================================================= -->

      ${canApprove || canApproveLeave || canLeave
        ? /*html*/`
          <div class="application-actions">

            ${canApprove ? /*html*/`
              <button
                class="approve-btn"
                type="button">
                <x-translation>application.button.approve</x-translation>
              </button>

              <button
                class="deny-btn"
                type="button">
                <x-translation>application.button.deny</x-translation>
              </button>
            ` : ''}


            ${canApproveLeave ? /*html*/`
              <button
                class="approve-leave-btn"
                type="button">
                <x-translation>application.button.approveLeave</x-translation>
              </button>

              <button
                class="deny-leave-btn"
                type="button">
                <x-translation>application.button.denyLeave</x-translation>
              </button>
            ` : ''}


            ${canLeave ? /*html*/`
              <button
                class="leave-btn"
                type="button">
                <x-translation>application.button.leaveRequest</x-translation>
              </button>
            ` : ''}

          </div>
        `
        : ''
      }


      <!-- =================================================
           Errors
           ================================================= -->

      <div class="errorarea"></div>

    </div>
  `;
}


  postRender() {
    this.setupEvents();
  }
}


customElements.define(
  'ssd-intra-application',
  ApplicationViewer
);