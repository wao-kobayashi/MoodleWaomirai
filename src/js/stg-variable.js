// ==============================
// 科目データの定義
// ==============================

// `subjects` 配列は、各科目の情報を保持するデータセット。
// 各要素は1つの科目を表し、メイン科目と子科目が含まれる。
// 主なプロパティの説明:
// - `id`: 科目の一意の識別子（数値）
// - `name`: 科目の名前（文字列）
// - `key`: 科目を一意に識別するキー（文字列）
// - `type`: 科目の種類（"main"はメイン科目、"child"は子科目）
// - `parentKey`: 子科目が属するメイン科目を示すキー（子科目のみ）
// - `level`: 子科目のレベルを示す（"L1" ～ "L4"、子科目のみ）

const subjects = [
  // ==============================
  // メイン科目
  // ==============================

  // ID: 212, 名前: "哲学", キー: "philosophy"
  // メイン科目であり、関連する子科目が存在する。
  { id: 212, name: "哲学", key: "philosophy", type: "main" },

  // ID: 211, 名前: "科学", キー: "science"
  // メイン科目であり、関連する子科目が存在する。
  { id: 211, name: "科学", key: "science", type: "main" },

  // ID: 213, 名前: "経済", キー: "economy"
  // メイン科目であり、関連する子科目が存在する。
  { id: 213, name: "経済", key: "economy", type: "main" },

  // ID: 229, 名前: "3科目セット", キー: "threesubjectpack"
  // 複数の科目をまとめたパッケージ。特定の子科目とは直接の関連がない。
  { id: 229, name: "3科目セット", key: "threesubjectpack", type: "main" },

  // ID: 228, 名前: "2科目セット", キー: "twosubjectpack"
  // 2つの科目をまとめたパッケージ。特定の子科目とは直接の関連がない。
  { id: 228, name: "2科目セット", key: "twosubjectpack", type: "main" },

  // ID: 236, 名前: "グローバル英語", キー: "globalenglish"
  // メイン科目であり、関連する子科目が存在する。
  { id: 236, name: "グローバル英語", key: "globalenglish", type: "main" },

  // ID: 235, 名前: "プログラミング", キー: "programming"
  // メイン科目であり、現時点では子科目は定義されていない。
  { id: 235, name: "プログラミング", key: "programming", type: "main" },

  // ==============================
  // 子科目
  // ==============================

  // 子科目は特定のメイン科目に属し、それぞれ異なるレベル（L1 ～ L4）を持つ。
  // `parentKey` プロパティを使用して関連するメイン科目を指定する。

  // 哲学に関連する子科目
  { id: 221, name: "哲学 L1", key: "philosophy", parentKey: "philosophy", type: "child", level: "L1" },
  { id: 225, name: "哲学 L2", key: "philosophy", parentKey: "philosophy", type: "child", level: "L2" },
  { id: 242, name: "哲学 L3", key: "philosophy", parentKey: "philosophy", type: "child", level: "L3" },
  { id: 243, name: "哲学 L4", key: "philosophy", parentKey: "philosophy", type: "child", level: "L4" },

  // 科学に関連する子科目
  { id: 223, name: "科学 L1", key: "science", parentKey: "science", type: "child", level: "L1" },
  { id: 222, name: "科学 L2", key: "science", parentKey: "science", type: "child", level: "L2" },
  { id: 244, name: "科学 L3", key: "science", parentKey: "science", type: "child", level: "L3" },
  { id: 245, name: "科学 L4", key: "science", parentKey: "science", type: "child", level: "L4" },

  // 経済に関連する子科目
  { id: 226, name: "経済 L1", key: "economy", parentKey: "economy", type: "child", level: "L1" },
  { id: 227, name: "経済 L2", key: "economy", parentKey: "economy", type: "child", level: "L2" },
  { id: 246, name: "経済 L3", key: "economy", parentKey: "economy", type: "child", level: "L3" },
  { id: 247, name: "経済 L4", key: "economy", parentKey: "economy", type: "child", level: "L4" },

  // グローバル英語に関連する子科目
  { id: 253, name: "グローバル英語 L1", key: "globalenglish", parentKey: "globalenglish", type: "child", level: "L1" },
  { id: 254, name: "グローバル英語 L2", key: "globalenglish", parentKey: "globalenglish", type: "child", level: "L2" },
];
