// ==============================
// URLフラグの取得関数
// ==============================

// クエリパラメータ "flag" の値を取得するための関数
// 該当するパラメータが存在しない場合は空文字 "" を返す

function getUrlFlag() {
  return new URLSearchParams(window.location.search).get("flag") || "";
}
