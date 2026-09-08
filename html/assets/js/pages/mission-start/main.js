import { escapeHtml } from '../../util.js';
console.log('Mission page script loaded');
window.addEventListener('form-success', (event) => {
    const data = event.detail.data;
    if (!data?.alertId) {
        return;
    }
    
    const url = `/mission/?id=${encodeURIComponent(data.alertId)}`;

    // Change the URL and add it to browser history without loading the page.
    history.pushState({}, '', url);

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        const mission = document.createElement('ssd-intra-mission');

        mission.setAttribute('id', id);
        mission.setAttribute('live', '');
        mission.setAttribute('open', '');
        mission.setAttribute('statusMode', '');
        if(data.author) mission.setAttribute('author', escapeHtml(data.author));
        if(data.injury) mission.setAttribute('injury', escapeHtml(data.injury));
        if(data.location) mission.setAttribute('location', escapeHtml(data.location));
        if(data.additionalInformation) mission.setAttribute('additionalInformation', escapeHtml(data.additionalInformation));
        document.querySelector('.fullscreen-formbox').appendChild(mission);
        document.querySelector('.fullscreen-formbox>ssd-mission-start').remove()
    }
});