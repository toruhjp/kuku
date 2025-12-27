# 九九の練習

## 概要
小学生向けに、九九がランダムに出題されても解けるようにする練習するための小アプリ

## 公開URL
🌐 **https://toruhjp.github.io/kuku/**

横向きのスマートフォン・タブレット、またはPCで利用できます。

## 機能
- 練習したい段（1の段〜9の段）を選択
- カウントダウン後、ランダムに問題が出題
- 答えを入力して即座にフィードバック
- 全問正解で完了画面を表示

## ローカルでの実行方法
1. このリポジトリをクローン:
   ```bash
   git clone https://github.com/toruhjp/kuku.git
   cd kuku
   ```

2. `index.html` をブラウザで開く、またはローカルサーバーで起動:
   ```bash
   # Python 3の場合
   python -m http.server 8000
   
   # Node.jsの場合
   npx serve
   ```

3. ブラウザで `http://localhost:8000` を開く

## デプロイについて
このサイトはGitHub Pagesで自動デプロイされています。

### デプロイフロー
1. `main` ブランチに変更をプッシュ
2. GitHub Actionsが自動的に実行
3. 数十秒後に https://toruhjp.github.io/kuku/ に反映

### 技術構成
- **ホスティング**: GitHub Pages
- **CI/CD**: GitHub Actions
- **フロントエンド**: Vanilla JavaScript (フレームワーク不使用)
- **スタイル**: CSS3

## リポジトリ
📦 **https://github.com/toruhjp/kuku**

## 制作につかったツール類
- Roo Code
- LLM各種
    - gpt-5.1
    - claude-opus-4.5
    - claude-sonnet-4.5

## 開発フェーズ
- ✅ **Phase 1**: 基本機能実装（選択画面、カウントダウン、問題出題、完了画面）
- ✅ **Phase 2**: GitHub Pages デプロイ・公開
