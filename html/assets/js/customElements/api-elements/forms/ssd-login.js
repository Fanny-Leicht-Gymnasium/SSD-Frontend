import { postLogin } from '../../../api/api.generated.js';
import { FormAPIElement } from '../../form-api-element.js';

class SSDLogin extends FormAPIElement {
    constructor() {
        super();
        this.defaultSubmittext = 'Login';
        this.defaultAlertErrors = true;
    }

    // -------------------------
    // FORM STRUCTURE
    // -------------------------
    renderForm() {
        this.form.innerHTML = `
      <h1>SSD Login</h1>
      <input type="text" id="username" placeholder="Username" required>
      <input type="password" id="password" placeholder="Password" required>
    `;

        // submit button handled by base class (submittext attribute)
    }
    async load() { }
    // -------------------------
    // UPDATE HANDLER
    // -------------------------
    async handleSend(data) {
        try {
            this.result.innerHTML = 'Logging in...';

            console.log('Submitting login with data:', data);

            const res = await postLogin({
                username: data.username,
                password: data.password
            });
            
            // IMPORTANT: store token
            if (res?.Token) {
                localStorage.setItem("jwt", res.Token);
                console.log("login data stored")
            }

            this.result.innerHTML = 'Login successful! Redirecting...';

            return { success: true, data: res };

        } catch (error) {
            return { success: false, error: error };
        }
    }
}

customElements.define('ssd-login', SSDLogin);