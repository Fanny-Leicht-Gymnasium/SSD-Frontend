class SimplePagination extends HTMLElement {
  static get observedAttributes() {
    return ['page', 'page_count'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get page() {
    return Number(this.getAttribute('page') || 1);
  }

  get pageCount() {
    return Number(this.getAttribute('page_count') || 1);
  }

  setPage(newPage) {
    this.setAttribute('page', String(newPage));
    this.dispatchEvent(new CustomEvent('page-change', {
      detail: { page: newPage },
      bubbles: true
    }));
  }

  render() {
    const page = this.page;
    const pageCount = this.pageCount;

    this.innerHTML = `
      <div class="pagination">
        <button ${page <= 1 ? 'disabled' : ''} data-action="prev">Prev</button>

        <span>Page ${page} / ${pageCount}</span>

        <button ${page >= pageCount ? 'disabled' : ''} data-action="next">Next</button>
      </div>
    `;

    this.querySelector('[data-action="prev"]')?.addEventListener('click', () => {
      if (page > 1) this.setPage(page - 1);
      console.log('Previous page clicked');
    });

    this.querySelector('[data-action="next"]')?.addEventListener('click', () => {
      if (page < pageCount) this.setPage(page + 1);
      console.log('Next page clicked');
    });
  }
}

customElements.define('ssd-pagination', SimplePagination);