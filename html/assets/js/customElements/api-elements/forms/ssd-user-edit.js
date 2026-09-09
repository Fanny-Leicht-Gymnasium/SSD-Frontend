import { createPutUserUseridBodyTemplate, getUserMe, getUserUserid, putUserUserid } from '../../../api/api.generated.js';
import { FormAPIElement } from '../../form-api-element.js';

class SSDUserEdit extends FormAPIElement {
  constructor() {
    super();
    this.defaultSubmittext = 'Save changes';
    this.defaultAlertErrors = true;
    this.userId = null;
    this.loadRequest = 0;
  }

  renderForm() {
    const roleField = this.hasAttribute('admin') ? /*html*/`
      <div class="field" input-label="Role" trans-lable="user.Role" trans-placeholder="user.Role">
        <select id="role">
          <option value="user"><x-trans>user.role.user</x-trans></option>
          <option value="admin"><x-trans>user.role.admin</x-trans></option>
           <option value="disabled"><x-trans>user.role.disabled</x-trans></option>
        </select>
      </div>
    ` : '';

    this.form.innerHTML = /*html*/`
      <h2><x-trans>setting.edit.user</x-trans></h2>
      <div class="field" input-label="Username" trans-lable="user.username" trans-placeholder="user.username" >
        <input type="text" id="username" placeholder="Username" autocomplete="username" readonly>
      </div>
      <div class="field" input-label="Email" trans-lable="user.email" trans-placeholder="user.email">
        <input type="email" id="email" placeholder="Email" autocomplete="email">
      </div>
      <div class="field" input-label="Full Name" trans-lable="user.name" trans-placeholder="user.name">
        <input type="text" id="name" placeholder="Full Name" autocomplete="name">
      </div>
      <div class="field" input-label="Phone Number" trans-lable="user.phonenumber" trans-placeholder="user.phonenumber">
        <input type="tel" id="phonenumber" placeholder="Phone Number" autocomplete="tel">
      </div>
      <div class="field" input-label="Class" trans-lable="user.class" trans-placeholder="user.class">
        <input type="text" id="class" placeholder="Class">
      </div>
      ${roleField}
    `;
  }

  async load() {
    const request = ++this.loadRequest;

    try {
      this.renderForm();

      const userId = this.getAttribute('user-id');
      const input = this.getAttribute('data');
      const user = userId
        ? await getUserUserid(userId)
        : input
          ? JSON.parse(input)
          : await getUserMe();

      if (request !== this.loadRequest) {
        return;
      }

      this.userId = user?.userid;

      if (this.userId === undefined || this.userId === null) {
        throw new Error('The current user could not be identified.');
      }

      this.render(user);
    } catch (error) {
      this.renderError(error);
    }
  }

  async handleSend(data) {
    try {
      this.result.textContent = 'Saving changes...';
      const payload = createPutUserUseridBodyTemplate({
        username: data.username,
        email: data.email,
        phonenumber: data.phonenumber,
        class: data.class,
        name: data.name,
        ...(this.hasAttribute('admin') ? { role: data.role } : {})
      })
      const updatedUser = await putUserUserid(String(this.userId), payload);

      if (!this.hasAttribute('user-id')) {
        const currentUser = JSON.parse(localStorage.getItem('me') || '{}');
        localStorage.setItem('me', JSON.stringify({
          ...currentUser,
          ...data,
          ...(updatedUser && typeof updatedUser === 'object' ? updatedUser : {})
        }));
      }
      this.result.textContent = 'Changes saved.';

      return { success: true, data: updatedUser };
    } catch (error) {
      return { success: false, error };
    }
  }
}

customElements.define('ssd-user-edit', SSDUserEdit);
