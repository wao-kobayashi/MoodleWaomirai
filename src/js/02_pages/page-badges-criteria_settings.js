if (bodyId === "page-badges-criteria_settings") {
    // 年度の開始月（4月始まりなら4）
    const startMonth = 4;

    // 最初のグループの基準年
    let baseYear = 2025;

    // 「翌年月（1〜3月）」に入ったことを記録するフラグ
    let enteredNextYear = false;

    $('label.form-check-inline').each(function() {

    // ラベルのテキストから「○月」を取り出す
    const match = $(this).text().match(/(\d+)月/);
    if (!match) return; // 月が見つからなければスキップ

    const month = parseInt(match[1], 10);

    // 一度「翌年月（1〜3月）」に入った後、再び「開始月以降（4月〜）」が来たら
    // 新しい年度グループが始まったと判断して基準年を1つ繰り上げる
    if (enteredNextYear && month >= startMonth) {
        baseYear++;
        enteredNextYear = false;
    }

    // 開始月より小さい月（1〜3月）に入ったらフラグを立てる
    if (month < startMonth) {
        enteredNextYear = true;
    }

    // 開始月以降（4〜12月）なら基準年、それより前（1〜3月）なら翌年を割り当てる
    const year = month >= startMonth ? baseYear : baseYear + 1;

    // ラベル内のテキストノードだけを対象に（input要素は触らない）
    $(this).contents().filter(function() {
        return this.nodeType === 3 && $(this).text().trim();
    }).first().replaceWith(function() {
        // 「○月」の直後に「（○○○○年）」を挿入して置き換える
        return this.textContent.replace(/(\d+月)/, `$1（${year}年）`);
    });
    });
  // id_aggregationcontainer 内の「選択したすべての活動を完了する」を含むラベルのinputにチェック
  $('#id_aggregationcontainer label').filter(function() {
    return $(this).text().trim() === '選択したすべての活動を完了する';
  }).find('input[type="radio"]').prop('checked', true);
}
