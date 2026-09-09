import { createPostUserBodyTemplate, postUser } from '../../../api/api.generated.js';
import { FormAPIElement } from '../../form-api-element.js';

class SSDSignup extends FormAPIElement {
    constructor() {
        super();
        this.defaultSubmittext = 'Sign Up';
        this.defaultAlertErrors = true;
    }

    // -------------------------
    // FORM STRUCTURE
    // -------------------------
    renderForm() {
        this.form.innerHTML = /*html*/`
            <h1>SSD Signup</h1>
            <div class="field" input-label="Username" trans-lable="user.username" trans-placeholder="user.username">
            <input type="text" id="username" placeholder="Username" required>
            </div>
            <div class="field" input-label="Email" trans-lable="user.email" trans-placeholder="user.email">
            <input type="email" id="email" placeholder="Email" required>
            </div>
            <div class="field" input-label="Full Name" trans-lable="user.name" trans-placeholder="user.name">
            <input type="text" id="name" placeholder="Full Name" required>
            </div>
            <div class="field" input-label="Phone Number" trans-lable="user.phonenumber" trans-placeholder="user.phonenumber">
            <input type="text" id="phonenumber" placeholder="Phone Number">
            </div>
            <div class="field" input-label="Class" trans-lable="user.class" trans-placeholder="user.class">
            <input type="text" id="class" placeholder="Class">
            </div>
            <div class="field" input-label="Password" trans-lable="user.password" trans-placeholder="user.password">
            <input type="password" id="password" placeholder="Password" required>
            </div>
        `;
    }

    // -------------------------
    // UPDATE HANDLER
    // -------------------------
    async handleSend(data) {
        try {
            this.result.innerHTML = 'Creating account...';
            const user = createPutUserUseridBodyTemplate({
                    username: data.username,
                    email: data.email,
                    role: "user", // default role
                    phonenumber: data.phonenumber,
                    class: data.class,
                    name: data.name
                })
            const payload = createPostUserBodyTemplate({
                user: user,
                password: data.password
            });
            console.log('Signup payload:', payload);
            
            await postUser(payload);

            this.result.innerHTML = 'Signup successful! Redirecting...';

            // redirect (same behavior as login)
            setTimeout(() => {
                const redirect = this.getAttribute('redirect') || '/';

                if (window.parent !== window) {
                    window.parent.postMessage({ action: 'closeModal' }, '*');
                    window.parent.location.href = redirect;
                } else {
                    window.location.href = redirect;
                }
            }, 1000);

            return { success: true };

        } catch (error) {
            return { success: false, error: error };
        }
    }
}

customElements.define('ssd-signup', SSDSignup);