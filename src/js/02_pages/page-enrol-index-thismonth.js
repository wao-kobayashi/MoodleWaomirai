

// ==============================
// enrol-index「今月の授業」自動更新
// ・日付に応じて表示月を切り替え、画像・テキスト・見出しをDOM上で上書きする
// ・pugの currentMonth を更新し忘れても、常に日付基準で正しい月を表示する（=事故防止が目的）
// ・対象カテゴリ: 哲学・科学・経済のみ（英語・セット科目は対象外）
// ==============================
if (bodyId === "page-enrol-index") {
  // ------------------------------
  // 締め日テーブル（メンテはここだけ・年1回）
  // until（その日まで）を過ぎたら次の行の月へ自動送りする。上から順に判定。
  // ※現状は8・9月分のみ。10月以降は追記してください（年度末は 2027-03-xx）
  // ------------------------------
  var THISMONTH_SCHEDULE = [
    { until: "2026-08-21", month: 8 }, // 〜8/21 → 8月（画像 month5）
    { until: "2026-09-18", month: 9 }, // 8/22〜9/18 → 9月（画像 month6）
    { until: "2026-10-23", month: 10 },
    { until: "2026-11-20", month: 11 },
    { until: "2026-12-19", month: 12 },
    { until: "2027-01-29", month: 1 },
    { until: "2027-02-19", month: 2 },
    { until: "2027-03-19", month: 3 }
  ];


  // カテゴリ → 画像ファイル名プレフィックス
  var THISMONTH_PREFIX = {
    philosophy: "phi",
    science: "sci",
    economy: "eco",
  };

  // 日付から表示すべきカレンダー月を求める
  function getActiveThisMonth(today, schedule) {
    for (var i = 0; i < schedule.length; i++) {
      // その日の23:59:59まで有効とみなす
      if (today <= new Date(schedule[i].until + "T23:59:59")) {
        return schedule[i].month;
      }
    }
    // テーブル範囲外（想定外の未来日）は最後の月にフォールバック
    return schedule[schedule.length - 1].month;
  }

  // カレンダー月 → 画像month番号（4月=1 … 3月=12 で一巡）
  function toImageMonth(calendarMonth) {
    return ((calendarMonth + 8) % 12) + 1;
  }

  // 指定レベル・月の3週分テキストを取得
  function getThisMonthTexts(curriculum, level, month) {
    var levelData = curriculum["level" + level];
    if (!levelData) return null;
    var monthData = levelData.find(function (item) {
      return item.month === month;
    });
    if (!monthData) return null;
    return [monthData.subcontents1, monthData.subcontents2, monthData.subcontents3];
  }

  // ------------------------------
  // メイン処理
  // ------------------------------
  var enrolData = window.WAO_ENROL; // pugから露出した現在カテゴリのカリキュラム
  var $thisMonth = $(".enrol-section-basesubject-thismonth-lesson");

  // 対象カテゴリ（哲学・科学・経済）かつデータ・DOMが揃っている時のみ実行
  if (enrolData && $thisMonth.length && THISMONTH_PREFIX[enrolData.category]) {
    var activeMonth = getActiveThisMonth(new Date(), THISMONTH_SCHEDULE);
    var imageMonth = toImageMonth(activeMonth);
    var prefix = THISMONTH_PREFIX[enrolData.category];
    // 学年度は4月始まりのため、1〜3月は翌年扱い（例: 年度2026 → 2027年1月）
    var displayYear = activeMonth >= 4 ? enrolData.year : enrolData.year + 1;

    // 1. 見出しを更新（同一セクション内の .enrol-title のみ対象）
    $thisMonth
      .closest(".enrol-section")
      .find(".enrol-title")
      .text(displayYear + "年" + activeMonth + "月の授業");

    // 2. レベルごと・週ごとに画像とテキストを差し替え（構造は保持＝中身だけ上書き）
    //    ※page-enrol-index.js で募集停止レベルが削除済みでも、残ったgridだけ更新される
    $thisMonth
      .find(".enrol-section-basesubject-thismonth-lesson-grid")
      .each(function () {
        var $grid = $(this);
        var level = $grid.data("level");
        var texts = getThisMonthTexts(enrolData.curriculum, level, activeMonth);

        $grid
          .find(".enrol-section-basesubject-thismonth-lesson-grid-lesson")
          .each(function () {
            var $lesson = $(this);
            var week = $lesson.data("week"); // 1〜3

            // 画像URLを規則生成して差し替え
            var url =
              enrolData.thumbBase +
              prefix +
              "_lv" + level +
              "_month" + imageMonth +
              "_week" + week +
              ".png";
            $lesson
              .find(".enrol-section-basesubject-thismonth-lesson-grid-lesson-banner img")
              .attr("src", url);

            // テキストを差し替え
            if (texts && texts[week - 1] != null) {
              $lesson
                .find(".enrol-section-basesubject-thismonth-lesson-grid-lesson-text")
                .text(texts[week - 1]);
            }
          });
      });
  }
}
