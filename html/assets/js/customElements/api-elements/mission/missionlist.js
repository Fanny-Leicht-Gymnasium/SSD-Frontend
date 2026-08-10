import { APIElement } from '../../api-element.js';
import { getMissionList } from '../../../api/api.generated.js';
import { escapeHtml } from '../../../util.js';

class MissionList extends APIElement {
  static get observedAttributes() {
    return [
      'startdate',
      'enddate',
      'ids_only',
      'page',
      'page_size',
      'total_pages'
    ];
  }

  async fetchByContext() {
    const startdate = this.getAttribute('startdate') || undefined;
    const enddate = this.getAttribute('enddate') || undefined;

    const ids_only = this.getAttribute('ids_only') === 'true';
    const page = Number(this.getAttribute('page') || 1);
    const page_size = Number(this.getAttribute('page_size') || 50);

    return await getMissionList(
      startdate,
      enddate,
      ids_only,
      page,
      page_size
    );
  }

setPage(newPage) {
  this.setAttribute('page', String(newPage));
  console.log('Page attribute set to', newPage);
}

  connectedCallback() {
    super.connectedCallback?.();
    console.log('MissionList connected, initializing load');
    this.root.addEventListener('page-change', (e) => {
      const newPage = e.detail.page;
      this.setPage(newPage);
      console.log('Page changed to', newPage);
    });
  }

  render(missionList) {

    const page = missionList?.page || Number(this.getAttribute('page') || 1);
    const pageSize = missionList?.pageSize || Number(this.getAttribute('page_size') || 50);

    // naive page estimate (replace with backend total if available)
    const totalPages = missionList?.totalPages
    const hasData = missionList?.missions && missionList.missions[0].author? true : false;
    return /*html*/`
      <div class="mission-list">
        ${missionList.missions.length === 0 ? /*html*/`<p>No missions found</p>` : ''}

        ${missionList.missions.map(m => /*html*/`
          <ssd-intra-mission id="${m.alertId}" ${hasData?/*html*/`data="${JSON.stringify(m).replaceAll("\"", "'")}"`:""}></ssd-intra-mission>
        `).join('')}

        <ssd-pagination
          page="${page}"
          page_count="${totalPages}">
        </ssd-pagination>
      </div>
    `;
  }
}

customElements.define('ssd-intra-mission-list', MissionList);