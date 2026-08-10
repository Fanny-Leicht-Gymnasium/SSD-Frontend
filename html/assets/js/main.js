document.addEventListener('click', (e) => {
    const header = e.target.closest('[collapsable] > .header');

    if (!header) return;

    const container = header.closest('[collapsable]');
    if (!container) return;

    container.toggleAttribute('open');
});
      (async () => {
        const me = await getUserMe();
        localStorage.setItem("me", JSON.stringify(me));
        console.log("----------------------------------------------------------------------------------------------------------------- Updeded ME")
      })();