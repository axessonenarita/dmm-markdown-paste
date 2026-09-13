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
    setTimeout(() => el.remove(), 1800);
  }

  function dispatchEditorEvents(editor) {
    editor.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      inputType: 'insertFromPaste',
      data: null
    }));
    editor.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function hasMeaningfulContent(editor) {
    const text = (editor.innerText || '').replace(/\u200B/g, '').trim();
    if (text) return true;

    return Boolean(editor.querySelector('img, video, iframe, hr, ul, ol, table, blockquote'));
  }

  function replaceEditorContent(editor, html) {
    editor.focus();
    editor.innerHTML = html;

    // Caret is moved to the end so typing can continue naturally after replacement.
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);

    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
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

    // Markdown paste is treated as a full-document import for the focused DMM editor.
    // This intentionally avoids inserting block HTML inside existing bold/list/link nodes.
    if (hasMeaningfulContent(editor)) {
      const ok = window.confirm(
        'この編集欄には既存の内容があります。\nMarkdownの内容で全文を置き換えますか？'
      );
      if (!ok) return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    replaceEditorContent(editor, html);
    showToast('Markdownで全文を置き換えました');
  }, true);
})();
