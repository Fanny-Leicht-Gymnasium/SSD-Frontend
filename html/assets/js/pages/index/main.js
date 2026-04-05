import { isLoggedIn } from "../../util.js";

document.addEventListener("DOMContentLoaded", async () => {
    const user = await isLoggedIn();

    if (!user) {
        // prevent duplicates
        if (document.querySelector('ssd-login')) return;

        const login = document.createElement('ssd-login');

        login.setAttribute('aspopup', '');
        login.setAttribute('redirectURL', '/');

        document.body.appendChild(login);
    }
});