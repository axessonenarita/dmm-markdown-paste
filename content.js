(() => {
  const TARGET_SELECTOR = '.note-editable[contenteditable="true"]';

  function showToast(message) {
    const old = document.getElementById('dmm-md-paste-toast');
    if (old) old.remove();

    const el = document.createElement('div');
    el.id = 'dmm-md-paste-toast';
    el.textContent = message;
    Object.assign(el.style, {
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      zIndex: '2147483647',
      background: 'rgba(30,30,30,.92)',
      color: '#fff',
      padding: '10px 14px',
      borderRadius: '8px',
      fontSize: '13px',
      boxShadow: '0 4px 18px rgba(0,0,0,.25)',
      pointerEvents: 'none'
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }

  function dispatchEditorEvents(editor) {
    editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste' }));
    editor.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function insertHtmlAtCaret(editor, html) {
    editor.focus();

    const sel = window.getSelection();
    let range = null;

    if (sel && sel.rangeCount) {
      const candidate = sel.getRangeAt(0);
      if (editor.contains(candidate.commonAncestorContainer)) range = candidate;
    }

    if (!range) {
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }

    range.deleteContents();

    const template = document.createElement('template');
    template.innerHTML = html;
    const fragment = template.content;
    const lastNode = fragment.lastChild;
    range.insertNode(fragment);

    if (lastNode && sel) {
      const after = document.createRange();
      after.setStartAfter(lastNode);
      after.collapse(true);
      sel.removeAllRanges();
      sel.addRange(after);
    }

    dispatchEditorEvents(editor);
  }

  document.addEventListener('paste', (event) => {
    const editor = event.target.closest?.(TARGET_SELECTOR);
    if (!editor) return;

    const text = event.clipboardData?.getData('text/plain') || '';
    if (!window.DmmMarkdownPaste?.looksLikeMarkdown(text)) return;

    const html = window.DmmMarkdownPaste.markdownToDmmHtml(text);
    if (!html) return;

    event.preventDefault();
    event.stopPropagation();

    insertHtmlAtCaret(editor, html);
    showToast('Markdownとして貼り付けました');
  }, true);
})();
