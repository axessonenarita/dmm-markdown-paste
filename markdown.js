(() => {
  const escapeHtml = (s) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  function inlineFormat(text) {
    let s = escapeHtml(text);

    s = s.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g, (_m, alt, url) => {
      return `<img src="${url}" alt="${alt}" style="max-width:100%;">`;
    });

    s = s.replace(/\[image\]\((https?:\/\/[^\s)]+)\)/gi, (_m, url) => {
      return `<img src="${url}" alt="" style="max-width:100%;">`;
    });

    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, label, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    });

    s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');

    return s;
  }

  function markdownToDmmHtml(markdown) {
    const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
    const out = [];
    let listType = null;
    let listItems = [];

    const flushList = () => {
      if (!listType || listItems.length === 0) return;
      out.push(`<${listType}>${listItems.map(x => `<li>${inlineFormat(x)}</li>`).join('')}</${listType}>`);
      listType = null;
      listItems = [];
    };

    const pushBlank = () => {
      if (out[out.length - 1] !== '<div><br></div>') out.push('<div><br></div>');
    };

    for (const raw of lines) {
      const line = raw.replace(/\s+$/g, '');

      if (/^\s*$/.test(line)) {
        flushList();
        pushBlank();
        continue;
      }

      let m;
      if ((m = line.match(/^###\s+(.+)$/))) {
        flushList();
        out.push(`<h3>${inlineFormat(m[1])}</h3>`);
        continue;
      }
      if ((m = line.match(/^##\s+(.+)$/))) {
        flushList();
        out.push(`<h2>${inlineFormat(m[1])}</h2>`);
        continue;
      }
      if ((m = line.match(/^#\s+(.+)$/))) {
        flushList();
        out.push(`<h2>${inlineFormat(m[1])}</h2>`);
        continue;
      }

      if ((m = line.match(/^[-*+]\s+(.+)$/))) {
        if (listType && listType !== 'ul') flushList();
        listType = 'ul';
        listItems.push(m[1]);
        continue;
      }
      if ((m = line.match(/^\d+[.)]\s+(.+)$/))) {
        if (listType && listType !== 'ol') flushList();
        listType = 'ol';
        listItems.push(m[1]);
        continue;
      }

      if ((m = line.match(/^>\s?(.*)$/))) {
        flushList();
        out.push(`<blockquote>${inlineFormat(m[1])}</blockquote>`);
        continue;
      }

      if (/^---+$/.test(line.trim())) {
        flushList();
        out.push('<hr>');
        continue;
      }

      flushList();
      out.push(`<div>${inlineFormat(line)}</div>`);
    }

    flushList();

    while (out[0] === '<div><br></div>') out.shift();
    while (out[out.length - 1] === '<div><br></div>') out.pop();

    return out.join('');
  }

  function looksLikeMarkdown(text) {
    if (!text || text.length < 3) return false;
    return (
      /(^|\n)#{1,3}\s+\S/.test(text) ||
      /\*\*[^*]+\*\*/.test(text) ||
      /!\[[^\]]*\]\(https?:\/\//.test(text) ||
      /\[image\]\(https?:\/\//i.test(text) ||
      /(^|\n)[-*+]\s+\S/.test(text) ||
      /(^|\n)\d+[.)]\s+\S/.test(text)
    );
  }

  window.DmmMarkdownPaste = {
    markdownToDmmHtml,
    looksLikeMarkdown
  };
})();
