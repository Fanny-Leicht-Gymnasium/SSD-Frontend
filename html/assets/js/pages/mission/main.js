const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (id) {
    const mission = document.createElement('ssd-intra-mission');
    mission.setAttribute('id', id);
    mission.setAttribute('live', '');
    mission.setAttribute('open', '');
    mission.setAttribute('statusMode', '');
    document.querySelector('main').appendChild(mission);
}