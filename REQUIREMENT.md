# GitHub Copilot用プロンプト

## プロジェクト概要

世界地図上に旅行記録をマッピングし、訪問した場所での感情や感想を記録・共有できるWebアプリケーションを作成してください。

**目的**: 訪れた国や地域で何を感じたのかを記録し、その感情を他の人と共有する

## 技術スタック

- **フロントエンド**: React + TypeScript
- **地図ライブラリ**: Leaflet（シンプルで軽量、無料）
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks（useState, useEffect）
- **データ保存**: LocalStorage（MVP版）

## MVP機能要件

### 1. インタラクティブな世界地図

- 世界地図を表示
- 日本は都道府県単位で分割表示
- その他の国は国単位で表示
- 訪問済みの場所は色付けまたはマーカー表示

### 2. 旅行記録の作成（最小限）

- 地図上の場所をクリックして記録を追加
- 記録できる項目：
    - **場所名**（国名または都道府県名）
    - **訪問日**（単一の日付）
    - **感想・感じたこと**（テキストエリア、自由記述）

### 3. 記録の表示

- 地図上の場所をクリックすると、その場所の記録を表示
- 記録一覧をサイドバーまたは下部に表示

### 4. データの永続化

- LocalStorageに保存（シンプルなJSON形式）

## データモデル

```tsx
interface TravelRecord {
  id: string;
  locationName: string; // 国名または都道府県名
  locationType: 'country' | 'prefecture'; // 場所の種類
  visitDate: string; // ISO 8601形式 (YYYY-MM-DD)
  feelings: string; // 感想・感じたこと
  coordinates: {
    lat: number;
    lng: number;
  };
}
```

## UI要件

### レイアウト

- メインエリア：地図表示（画面の70-80%）
- サイドパネル：記録一覧表示（画面の20-30%）

### 地図の表示

- ズーム・パン操作可能
- 訪問済みの場所はマーカーまたは色付けで視覚的に区別
- 未訪問の場所はデフォルトの色

### 記録追加フロー

1. 地図上の場所をクリック
2. モーダルまたはフォームが表示される
3. 必須項目（場所名、訪問日、感想）を入力
4. 「保存」ボタンで記録を保存

### 記録表示フロー

- 地図上のマーカーをクリックすると、ポップアップまたはサイドパネルに詳細を表示
- サイドパネルの一覧から選択すると、地図上の該当場所にフォーカス

## 将来的な拡張機能（今回は実装不要）

- 滞在期間（日付範囲）
- 旅費・予算
- 写真のアップロード
- ユーザー認証・共有機能
- バックエンドAPI（データベース連携）

## 技術的な注意点

### 日本の都道府県分割

- GeoJSON形式の日本都道府県境界データを使用
- 推奨データソース: `japan.geojson`（オープンデータ）

### パフォーマンス

- 記録数が増えても動作が重くならないよう、地図上のマーカー数を最適化
- 必要に応じてクラスタリングを検討（将来的な拡張）

## 開発の優先順位

1. 基本的な地図表示（Leafletの導入）
2. 場所クリック時の記録追加フォーム
3. LocalStorageへのデータ保存・読み込み
4. 記録一覧の表示
5. 訪問済み場所の視覚的なハイライト
6. 日本の都道府県境界の実装

---

## GitHub Copilotへの指示例

"Create a React TypeScript application with Leaflet to display an interactive world map where users can click on locations to add travel records. Each record should include location name, visit date, and personal feelings/impressions. Use localStorage for data persistence. Japan should be divided into prefectures, while other countries are shown as single entities. Style with Tailwind CSS."
