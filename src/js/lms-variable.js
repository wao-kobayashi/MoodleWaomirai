$(document).ready(function () {
  const tenantIdNumber = $("html").data("tenantidnumber");

  // tenantIdNumberごとにsubjectsを定義
  let subjects = [];
  if (tenantIdNumber === "lmswaomirai") {
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

  // ID: 255, 名前: "哲学", キー: "philosophy"
  { id: 255, name: "哲学", key: "philosophy", type: "main" },

  // ID: 265, 名前: "科学", キー: "science"
  { id: 265, name: "科学", key: "science", type: "main" },

  // ID: 260, 名前: "経済", キー: "economy"
  { id: 260, name: "経済", key: "economy", type: "main" },

  // ID: 271, 名前: "3科目セット", キー: "threesubjectpack"
  { id: 271, name: "3科目セット", key: "threesubjectpack", type: "main" },

  // ID: 270, 名前: "2科目セット", キー: "twosubjectpack"
  { id: 270, name: "2科目セット", key: "twosubjectpack", type: "main" },

  // ID: 135, 名前: "グローバル英語", キー: "globalenglish"
  { id: 135, name: "グローバル英語", key: "globalenglish", type: "main" },

  // ==============================
  // 子科目
  // ==============================

  // 哲学に関連する子科目
  { id: 256, name: "哲学 L1", key: "philosophy", parentKey: "philosophy", type: "child", level: "L1" },
  { id: 257, name: "哲学 L2", key: "philosophy", parentKey: "philosophy", type: "child", level: "L2" },
  { id: 258, name: "哲学 L3", key: "philosophy", parentKey: "philosophy", type: "child", level: "L3" },
  { id: 259, name: "哲学 L4", key: "philosophy", parentKey: "philosophy", type: "child", level: "L4" },

  // 科学に関連する子科目
  { id: 266, name: "科学 L1", key: "science", parentKey: "science", type: "child", level: "L1" },
  { id: 267, name: "科学 L2", key: "science", parentKey: "science", type: "child", level: "L2" },
  { id: 268, name: "科学 L3", key: "science", parentKey: "science", type: "child", level: "L3" },
  { id: 269, name: "科学 L4", key: "science", parentKey: "science", type: "child", level: "L4" },

  // 経済に関連する子科目
  { id: 261, name: "経済 L1", key: "economy", parentKey: "economy", type: "child", level: "L1" },
  { id: 262, name: "経済 L2", key: "economy", parentKey: "economy", type: "child", level: "L2" },
  { id: 263, name: "経済 L3", key: "economy", parentKey: "economy", type: "child", level: "L3" },
  { id: 264, name: "経済 L4", key: "economy", parentKey: "economy", type: "child", level: "L4" },

  // グローバル英語に関連する子科目
  { id: 130, name: "グローバル英語 L1", key: "globalenglish", parentKey: "globalenglish", type: "child", level: "L1" },
  { id: 138, name: "グローバル英語 L2", key: "globalenglish", parentKey: "globalenglish", type: "child", level: "L2" },
];
