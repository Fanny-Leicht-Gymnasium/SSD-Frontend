function createExcuse() {
    const form = document.createElement('ssd-excuse-form');

    form.setAttribute('asPopup', '');
    form.setAttribute('redirectURL', 'close');

    form.addEventListener('form-success', () => {
        console.log('form-success');
        document.querySelector("ssd-intra-excuse-list").load();
    });
    
    document.body.appendChild(form);
}
window.createExcuse =createExcuse;