import { getUserMe, putUserUserid } from '../../../api/api.generated.js';
import { FormAPIElement } from '../../form-api-element.js';

class SSDUserEdit extends FormAPIElement {
  constructor() {
    super();
    this.defaultSubmittext = 'Save changes';
    this.defaultAlertErrors = true;
    this.userId = null;
  }

  renderForm() {
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
    `;
  }

  async load() {
    try {
      const user = await getUserMe();
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

      const updatedUser = await putUserUserid(String(this.userId), {
        username: data.username,
        email: data.email,
        phonenumber: data.phonenumber,
        class: data.class,
        name: data.name
      });

      const currentUser = JSON.parse(localStorage.getItem('me') || '{}');
      localStorage.setItem('me', JSON.stringify({
        ...currentUser,
        ...data,
        ...(updatedUser && typeof updatedUser === 'object' ? updatedUser : {})
      }));
      this.result.textContent = 'Changes saved.';

      return { success: true, data: updatedUser };
    } catch (error) {
      return { success: false, error };
    }
  }
}

customElements.define('ssd-user-edit', SSDUserEdit);
