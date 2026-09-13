# Chrome Web Store Listing

## Name
DMM Markdown Paste

## Short description
DMMオンラインサロンの編集欄にMarkdownを貼り付けると、自動でリッチテキストへ変換します。

## Detailed description
DMM Markdown Paste は、DMMオンラインサロン管理画面のテキスト編集を効率化する非公式Chrome拡張です。

ChatGPTや各種エディタで作成したMarkdownを、DMMオンラインサロンの「公開部分」「限定部分」の編集欄へそのまま貼り付けるだけで、見出し・太字・リンク・画像・リストなどをリッチテキストへ自動変換します。

対応記法:
- 見出し (# / ## / ###)
- 太字 (**text**)
- リンク ([text](URL))
- 画像 (![alt](URL), [image](URL))
- 箇条書き
- 番号付きリスト
- 引用
- 区切り線

Markdown記法を含まない通常テキストは、そのまま通常の貼り付けとして扱います。

本拡張機能は外部サーバーへデータを送信せず、入力内容・閲覧履歴・認証情報を収集または保存しません。処理はブラウザ内で完結します。

※本拡張機能はDMM.comおよびDMMオンラインサロンの公式製品ではありません。

## Single purpose
DMMオンラインサロン管理画面のSummernote編集欄へ貼り付けたMarkdownを、対応するリッチテキストHTMLへ変換して挿入すること。

## Permission justification
追加のChrome API権限は要求しません。コンテンツスクリプトは https://owner.lounge.dmm.com/* 上でのみ動作し、貼り付けイベントを処理します。

## Data usage
- Personally identifiable information: Not collected
- Health information: Not collected
- Financial/payment information: Not collected
- Authentication information: Not collected
- Personal communications: Not collected
- Location: Not collected
- Web history: Not collected
- Website content: Not collected or transmitted; pasted text is transformed locally in the browser and inserted into the active editor
- Analytics: None
- Advertising: None
