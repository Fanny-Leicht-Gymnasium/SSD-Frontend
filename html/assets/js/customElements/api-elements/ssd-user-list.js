import { getUserList, getUserMe } from '../../api/api.generated.js';
import { escapeHtml } from '../../util.js';
import { APIElement } from '../api-element.js';

class UserList extends APIElement {
  async fetchByContext() {
    const currentUser = await getUserMe();

    if (currentUser?.role !== 'admin') {
      return [];
    }

    const response = await getUserList();
    return Array.isArray(response) ? response : response?.users || [];
  }

  render(users) {
    if (users.length === 0) {
      return '';
    }

    return /*html*/`
      <section class="admin-user-list">
        <h2><x-trans>setting.users-list</x-trans></h2>
        <div class="admin-user-list-items">
          ${users.map(user => /*html*/`
            <div class="admin-user-list-item">
              <ssd-intra-user
                data="${escapeHtml(JSON.stringify(user))}"
                edit
              ></ssd-intra-user>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  postRender() {
    this.container.querySelectorAll('ssd-intra-user[edit]').forEach(userElement => {
      userElement.addEventListener('user-edit', (event) => {
        const user = this.getUserById(event.detail.userId);
        if (!user) {
          return;
        }

        const editor = document.createElement('ssd-user-edit');
        editor.setAttribute('admin', '');
        editor.setAttribute('aspopup', '');
        editor.setAttribute('user-id', String(user.userid));
        editor.addEventListener('form-success', () => this.load());
        document.body.appendChild(editor);
      });
    });
  }

  getUserById(userId) {
    return this.users?.find(user => String(user.userid) === String(userId));
  }

  async load() {
    const el = this.container;
    if (!el) return;

    el.innerHTML = this.renderLoading();
    el.classList.add('loading');

    try {
      this.users = await this.fetchByContext();
      el.innerHTML = this.render(this.users);
      el.classList.remove('loading');
      this.postRender();
    } catch (error) {
      el.innerHTML = this.renderError(error, false, false);
      el.classList.remove('loading');
    }
  }
}

customElements.define('ssd-user-list', UserList);
