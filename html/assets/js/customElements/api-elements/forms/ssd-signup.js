import { postUser } from '../../../api/api.generated.js';
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
        this.form.innerHTML = `
            <h1>SSD Signup</h1>

            <input type="text" id="username" placeholder="Username" required>
            <input type="email" id="email" placeholder="Email" required>
            <input type="text" id="name" placeholder="Full Name" required>
            <input type="text" id="phonenumber" placeholder="Phone Number">
            <input type="text" id="class" placeholder="Class">

            <input type="password" id="password" placeholder="Password" required>
        `;
    }

    // -------------------------
    // UPDATE HANDLER
    // -------------------------
    async handleSend(data) {
        try {
            this.result.innerHTML = 'Creating account...';

            const payload = {
                user: {
                    username: data.username,
                    email: data.email,
                    role: "user", // default role
                    phonenumber: data.phonenumber,
                    class: data.class,
                    name: data.name
                },
                password: data.password
            };

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