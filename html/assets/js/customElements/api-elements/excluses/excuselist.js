import { APIElement } from '../../api-element.js';

import {
  getExcuseList,
  getExcuseListAdmin
} from '../../../api/api.generated.js';

import { escapeHtml } from '../../../util.js';
import { readCachedData, readLatestCachedData, setOfflineMode, writeCachedData } from '../../../offline-cache.js';

class ExcuseList extends APIElement {

  static get observedAttributes() {
    return [
      'startdate',
      'enddate',
      'filter',
      'users',
      'page',
      'page_size',
      'isadmin'
    ];
  }

  async fetchByContext() {
    const startdate = this.getAttribute('startdate') || undefined;
    const enddate = this.getAttribute('enddate') || undefined;
    const filter = this.getAttribute('filter') || undefined;
    const users = this.getAttribute('users') || undefined;

    const page = Number(this.getAttribute('page') || 1);
    const page_size = Number(this.getAttribute('page_size') || 20);

    const isAdmin = this.hasAttribute('isadmin');

    const cacheKey = `excuses:${isAdmin}:${startdate || ''}:${enddate || ''}:${filter || ''}:${users || ''}:${page}:${page_size}`;

    try {
      const data = isAdmin
        ? await getExcuseListAdmin(startdate, enddate, filter, users, page, page_size)
        : await getExcuseList(startdate, enddate, filter, page, page_size);
      writeCachedData(cacheKey, data);
      setOfflineMode(false);
      return data;
    } catch (error) {
      const cached = readCachedData(cacheKey) || readLatestCachedData('excuses:');
      if (cached) {
        setOfflineMode(true, cached.updatedAt);
        return cached.data;
      }
      throw error;
    }
  }

  setPage(newPage) {
    this.setAttribute('page', String(newPage));

    console.log('Page attribute set to', newPage);
  }

  connectedCallback() {
    super.connectedCallback?.();

    console.log(
      'ExcuseList connected, admin:',
      this.hasAttribute('isadmin')
    );

    this.root.addEventListener('page-change', (e) => {
      const newPage = e.detail.page;

      this.setPage(newPage);

      console.log('Page changed to', newPage);
    });
  }

  render(excuseList) {
    const page =
      excuseList?.page ||
      Number(this.getAttribute('page') || 1);

    const totalPages =
      excuseList?.total_pages || 1;

    const excuses = excuseList?.excuses || [];

    return /*html*/`

      <div class="excuse-list">

        ${
          excuses.length === 0
            ? /*html*/`<p><x-trans>excuse.noExcuseFound</x-trans></p>`
            : ''
        }

        ${excuses.map(excuse => /*html*/`

          <ssd-intra-excuse
            id="${escapeHtml(excuse.excuseId || '')}"
            data="${escapeHtml(JSON.stringify(excuse))}"
          ></ssd-intra-excuse>

        `).join('')}

        <ssd-pagination
          page="${page}"
          page_count="${totalPages}"
        ></ssd-pagination>

      </div>

    `;
  }

}

customElements.define('ssd-intra-excuse-list', ExcuseList);