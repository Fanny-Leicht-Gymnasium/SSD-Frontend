import { APIElement } from '../../api-element.js';
import {
  getApplicationId,
  getUserMe,
  postApplicationIdAction
} from '../../../api/api.generated.js';
import { escapeHtml } from '../../../util.js';

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

  async additionalLoading() {
    this.me = await getUserMe();
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
    this.id = application.id
    let isAdmin = false;
    let isMe = false;

    let canLeave = false;
    let canApprove = false;
    let canApproveLeave = false;


    if (this.me) {
      isAdmin = this.me.role === 'admin';

      isMe = (
        this.me.userid === application.user?.userid
      );
    }


    if (isMe) {
      if (application.status === 'open'||application.status === 'approved'||application.status === 'leaveDenied'  ) {
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
    var statusColor = ""
    switch (application.status) {
      case "approved":
        statusColor = "green"
        break;
      case "denied":
        statusColor = "red"
        break;
      case "inactive":
        statusColor = "gray"
        break;
      case "leaveDenied":
        statusColor = "red"
        break;
      case "leaveRequest":
        statusColor = "orange"
        break;
      case "leaved":
        statusColor = "gray"
        break;
      case "open":
        statusColor = "orange"
        break;
      case "redraw":
        statusColor = "gray"
        break;
      default:
        break;
    }
    return `

      <p>
        <ssd-icon color="${statusColor}" size=100 name="status/${escapeHtml(application.status || 'N/A')}">
          status-${escapeHtml(application.status || 'N/A')}
        </ssd-icon>
      </p>


      <p>
        <x-translation>ApplicationID</x-translation>:
        ${escapeHtml(application.id || 'N/A')}
      </p>


      <p>
        <x-translation>Startdate</x-translation>:
        <time-display 
          show-countdown="false" 
          show-date="always">
          ${escapeHtml(application.startdate || 'N/A')}
        </time-display>
      </p>


      <p>
        <x-translation>Enddate</x-translation>:
        <time-display 
          show-countdown="false" 
          show-date="always">
          ${escapeHtml(application.enddate || 'N/A')}
        </time-display>
      </p>


      ${!this.hasAttribute('hideslot')
        ?
        `<ssd-slot data='${JSON.stringify(application.slot)}'></ssd-slot>`
        :
        ''
      }


      <p>
        <x-translation>reason</x-translation>:
        ${escapeHtml(application.reason || 'N/A')}
      </p>


      <ssd-intra-user 
        data='${JSON.stringify(application.user)}'>
      </ssd-intra-user>


      <p>
        <x-translation>type</x-translation>:
        ${escapeHtml(application.type || 'N/A')}
      </p>


      <p>
        <x-translation>status</x-translation>:
        ${escapeHtml(application.status || 'N/A')}
      </p>


      ${canApprove
        ?
        `
        <button class="approve-btn">
          <x-translation>approve</x-translation>
        </button>

        <button class="deny-btn">
          <x-translation>deny</x-translation>
        </button>
        `
        :
        ''
      }


      ${canApproveLeave
        ?
        `
        <button class="approve-leave-btn">
          <x-translation>approveLeave</x-translation>
        </button>

        <button class="deny-leave-btn">
          <x-translation>denyLeave</x-translation>
        </button>
        `
        :
        ''
      }


      ${canLeave
        ?
        `
        <button class="leave-btn">
          <x-translation>leaveRequest</x-translation>
        </button>
        `
        :
        ''
      }
      <div class="errorarea"></div>
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