/**
 * VATZ Custom Select
 * ============================================
 * A lightweight, zero-dependency custom <select>
 * replacement that matches VATZ's dark glass design.
 *
 * KEY DESIGN DECISIONS
 * ─────────────────────
 * • The real <select> is NEVER removed from the DOM — it is hidden with CSS.
 *   This means every WP form plugin (CF7, WPForms, Gravity Forms, Ninja Forms)
 *   still reads its value on submit without any extra code.
 *
 * USAGE — Vanilla HTML
 * ─────────────────────
 *   Keep your <select> exactly as-is. Load this script after main.js.
 *   Every <select> on the page is auto-upgraded unless it has [data-plain].
 *
 * USAGE — WordPress / Contact Form 7
 * ─────────────────────────────────────
 *   Use a normal [select] shortcode in CF7:
 *     [select* service "UI/UX Design" "Branding" "Web Development"]
 *
 *   Enqueue in functions.php:
 *     wp_enqueue_script('vatz-custom-select',
 *       get_theme_file_uri('js/custom-select.js'), [], '1.0.0', true);
 *
 *   CF7 injects selects after page load — the MutationObserver at the
 *   bottom of this file auto-upgrades them automatically.
 *
 * KEYBOARD SUPPORT
 * ─────────────────
 *   Space / Enter / ArrowDown  → open dropdown
 *   ArrowUp / ArrowDown        → navigate options
 *   Enter                      → confirm selection
 *   Escape / Tab               → close dropdown
 *
 * API
 * ─────
 *   new VatzSelect(selectEl)   – upgrade one element
 *   VatzSelect.init(root)      – upgrade all selects under root (default: document)
 *   VatzSelect.instances       – Map<selectEl, VatzSelect>
 *   instance.destroy()         – remove custom UI, restore native select
 */

'use strict';

class VatzSelect {

  /* ─── static registry ─── */
  static instances = new Map();

  constructor(selectEl, opts = {}) {
    if (!(selectEl instanceof HTMLSelectElement)) return;
    if (VatzSelect.instances.has(selectEl)) return; // already upgraded

    this.select   = selectEl;
    this.opts     = opts;
    this.isOpen   = false;   // state flag — deliberately NOT named _open to avoid
                             // collision with the _openList() method below
    this._bound   = {};

    this._build();
    this._sync();
    this._listen();

    VatzSelect.instances.set(selectEl, this);
  }

  /* ─────────────────────────────────────
     BUILD
  ───────────────────────────────────────*/
  _build() {
    const sel = this.select;

    /* Visually hide the native select; keep it in the DOM for form plugins */
    sel.classList.add('vatz-select-native');

    /* Outer wrapper */
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'vatz-select-wrap';
    this.wrapper.setAttribute('role', 'combobox');
    this.wrapper.setAttribute('aria-haspopup', 'listbox');
    this.wrapper.setAttribute('aria-expanded', 'false');
    this.wrapper.setAttribute('tabindex', '0');

    if (sel.getAttribute('aria-label'))
      this.wrapper.setAttribute('aria-label', sel.getAttribute('aria-label'));
    if (sel.required)
      this.wrapper.setAttribute('aria-required', 'true');

    /* Displayed text */
    this.display = document.createElement('span');
    this.display.className = 'vatz-select-display';

    /* Chevron */
    this.arrow = document.createElement('span');
    this.arrow.className = 'vatz-select-arrow';
    this.arrow.innerHTML = '<i class="fa-solid fa-chevron-down" aria-hidden="true"></i>';

    this.wrapper.append(this.display, this.arrow);

    /* Dropdown list */
    this.list = document.createElement('ul');
    this.list.className = 'vatz-select-list';
    this.list.setAttribute('role', 'listbox');
    this.list.id = `vatz-list-${Math.random().toString(36).slice(2, 8)}`;
    this.wrapper.setAttribute('aria-controls', this.list.id);

    this._buildOptions();
    this.wrapper.appendChild(this.list);

    /* Inject right after the native select */
    sel.insertAdjacentElement('afterend', this.wrapper);
  }

  _buildOptions() {
    this.list.innerHTML = '';
    Array.from(this.select.options).forEach((opt) => {
      /* Skip the empty placeholder option — it only shows in display text */
      if (opt.disabled && opt.value === '') return;

      const li = document.createElement('li');
      li.className = 'vatz-select-option';
      li.setAttribute('role', 'option');
      li.dataset.value = opt.value;
      li.textContent   = opt.textContent.trim();

      if (opt.selected && opt.value !== '') {
        li.classList.add('is-selected');
        li.setAttribute('aria-selected', 'true');
      }

      li.addEventListener('click', (e) => {
        e.stopPropagation();
        this._choose(li);
      });

      this.list.appendChild(li);
    });
  }

  /* ─────────────────────────────────────
     SYNC — mirror native select → display
  ───────────────────────────────────────*/
  _sync() {
    const sel     = this.select;
    const selOpt  = sel.options[sel.selectedIndex];
    const isEmpty = !selOpt || selOpt.disabled || selOpt.value === '';

    const placeholder =
      this.opts.placeholder ||
      sel.querySelector('option[disabled][selected]')?.textContent.trim() ||
      'Select an option...';

    this.display.textContent = isEmpty ? placeholder : selOpt.textContent.trim();
    this.wrapper.classList.toggle('is-placeholder', isEmpty);
    this.wrapper.classList.toggle('has-value', !isEmpty);

    /* aria-activedescendant */
    const activeLi = this.list.querySelector('.is-selected');
    if (activeLi) {
      if (!activeLi.id) activeLi.id = `vatz-opt-${Math.random().toString(36).slice(2, 8)}`;
      this.wrapper.setAttribute('aria-activedescendant', activeLi.id);
    }

    /* Mirror validation classes from contact.js / CF7 */
    this.wrapper.classList.toggle('input-error',   sel.classList.contains('input-error'));
    this.wrapper.classList.toggle('input-success', sel.classList.contains('input-success'));
  }

  /* ─────────────────────────────────────
     CHOOSE
  ───────────────────────────────────────*/
  _choose(li) {
    this.select.value = li.dataset.value;

    /* Dispatch native events so CF7 / jQuery validators react */
    this.select.dispatchEvent(new Event('change', { bubbles: true }));
    this.select.dispatchEvent(new Event('input',  { bubbles: true }));

    /* Update visual selection */
    this.list.querySelectorAll('.vatz-select-option').forEach(el => {
      el.classList.remove('is-selected');
      el.removeAttribute('aria-selected');
    });
    li.classList.add('is-selected');
    li.setAttribute('aria-selected', 'true');

    this._sync();
    this._closeList();
  }

  /* ─────────────────────────────────────
     OPEN / CLOSE  (named _openList/_closeList
     to avoid collision with the this.isOpen flag)
  ───────────────────────────────────────*/
  _openList() {
    if (this.isOpen) return;
    this.isOpen = true;

    /* Close any other open instance first */
    VatzSelect.instances.forEach((inst, el) => {
      if (el !== this.select && inst.isOpen) inst._closeList();
    });

    this.wrapper.classList.add('is-open');
    this.wrapper.setAttribute('aria-expanded', 'true');
    this.list.classList.add('is-visible');

    /* Flip upward if not enough room below */
    const rect  = this.wrapper.getBoundingClientRect();
    const space = window.innerHeight - rect.bottom;
    const listH = Math.min(this.list.scrollHeight, 280);
    this.list.classList.toggle('drop-up', space < listH + 12);

    /* Scroll the current selection into view */
    const selected = this.list.querySelector('.is-selected') ||
                     this.list.querySelector('.vatz-select-option');
    selected?.scrollIntoView({ block: 'nearest' });
  }

  _closeList() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.wrapper.classList.remove('is-open');
    this.wrapper.setAttribute('aria-expanded', 'false');
    this.list.classList.remove('is-visible', 'drop-up');

    /* Clear any keyboard-focus highlight */
    this.list.querySelectorAll('.kb-focus').forEach(li => li.classList.remove('kb-focus'));
  }

  _toggleList() {
    this.isOpen ? this._closeList() : this._openList();
  }

  /* ─────────────────────────────────────
     EVENTS
  ───────────────────────────────────────*/
  _listen() {
    /* Click on the wrapper — toggle open/close */
    const onWrapClick = (e) => {
      e.stopPropagation();
      this._toggleList();
    };
    this.wrapper.addEventListener('click', onWrapClick);
    this._bound.wrapClick = onWrapClick;

    /* Keyboard */
    const onKeyDown = (e) => {
      const opts   = Array.from(this.list.querySelectorAll('.vatz-select-option'));
      const curIdx = opts.findIndex(li => li.classList.contains('kb-focus'));

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (!this.isOpen) { this._openList(); break; }
          if (curIdx > -1)  { this._choose(opts[curIdx]); }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (!this.isOpen) this._openList();
          this._moveFocus(opts, curIdx, 1);
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (!this.isOpen) this._openList();
          this._moveFocus(opts, curIdx, -1);
          break;

        case 'Escape':
        case 'Tab':
          this._closeList();
          break;
      }
    };
    this.wrapper.addEventListener('keydown', onKeyDown);
    this._bound.keyDown = onKeyDown;

    /* Close when clicking anywhere outside */
    const onDocClick = () => this._closeList();
    document.addEventListener('click', onDocClick, { passive: true });
    this._bound.docClick = onDocClick;

    /* React to programmatic native-select changes (CF7 reset, etc.) */
    const onNativeChange = () => this._sync();
    this.select.addEventListener('change', onNativeChange);
    this._bound.nativeChange = onNativeChange;

    /* Mirror class changes on native select (input-error / input-success from contact.js) */
    this._classObserver = new MutationObserver(() => this._sync());
    this._classObserver.observe(this.select, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  _moveFocus(opts, curIdx, dir) {
    opts.forEach(li => li.classList.remove('kb-focus'));
    let next = curIdx + dir;
    if (next < 0)           next = opts.length - 1;
    if (next >= opts.length) next = 0;
    opts[next].classList.add('kb-focus');
    opts[next].scrollIntoView({ block: 'nearest' });
  }

  /* ─────────────────────────────────────
     DESTROY
  ───────────────────────────────────────*/
  destroy() {
    this.wrapper.remove();
    this.select.classList.remove('vatz-select-native');
    document.removeEventListener('click', this._bound.docClick);
    this.select.removeEventListener('change', this._bound.nativeChange);
    this._classObserver?.disconnect();
    VatzSelect.instances.delete(this.select);
  }

  /* ─────────────────────────────────────
     STATIC HELPERS
  ───────────────────────────────────────*/
  static init(root = document) {
    root.querySelectorAll('select:not([data-plain]):not(.vatz-select-native)').forEach(sel => {
      new VatzSelect(sel);
    });
  }
}

/* ─────────────────────────────────────────────────────
   AUTO-INIT
   Runs on DOMContentLoaded for static HTML pages.
   Also watches for dynamically injected selects
   (CF7, WPForms, Gravity Forms, page builders, etc.)
───────────────────────────────────────────────────────*/
const _vatzSelectBoot = () => {
  VatzSelect.init();

  /* MutationObserver catches selects added after page load */
  const mo = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.tagName === 'SELECT' && !node.dataset.plain) {
          new VatzSelect(node);
        }
        node.querySelectorAll?.('select:not([data-plain]):not(.vatz-select-native)')
            .forEach(sel => new VatzSelect(sel));
      });
    });
  });

  mo.observe(document.body, { childList: true, subtree: true });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _vatzSelectBoot);
} else {
  _vatzSelectBoot();
}
