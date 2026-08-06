// ==============================
// enrol-index「今月の授業」自動更新
// ・日付に応じて表示月を切り替え、画像・テキスト・見出しをDOM上で上書きする
// ・テキストは同ページの「年間カリキュラム」DOMから当月分を取得する（データ重複を持たない）
// ・画像は既存imgのsrc内 monthN を当月に置換するだけ
// ・pugの currentMonth を更新し忘れても、常に日付基準で正しい月を表示する（=事故防止が目的）
// ・対象: 哲学・科学・経済（英語・セット科目はこのセクションを持たない）
// ==============================
if (bodyId === "page-enrol-index") {
  // ------------------------------
  // 締め日テーブル（メンテはここだけ・年1回）
  // until（その日まで）を過ぎたら次の行の月へ自動送りする。上から順に判定。
  // ------------------------------
  var THISMONTH_SCHEDULE = [
    { until: "2026-08-21", month: 8 },  // 〜8/21 → 8月（画像 month5）
    { until: "2026-09-18", month: 9 },  // 8/22〜9/18 → 9月（画像 month6）
    { until: "2026-10-23", month: 10 },
    { until: "2026-11-20", month: 11 },
    { until: "2026-12-19", month: 12 },
    { until: "2027-01-29", month: 1 },
    { until: "2027-02-19", month: 2 },
    { until: "2027-04-30", month: 3 },
  ];

  var $thisMonthSection = $(".enrol-section.js-thismonth");
  var $thisMonth = $thisMonthSection.find(".enrol-section-basesubject-thismonth-lesson");

  if ($thisMonthSection.length && $thisMonth.length) {
    // 1. 日付から表示すべきカレンダー月を決定
    var thisMonthToday = new Date();
    var activeMonth = THISMONTH_SCHEDULE[THISMONTH_SCHEDULE.length - 1].month; // 範囲外は末尾にフォールバック
    for (var i = 0; i < THISMONTH_SCHEDULE.length; i++) {
      // その日の23:59:59まで有効とみなす
      if (thisMonthToday <= new Date(THISMONTH_SCHEDULE[i].until + "T23:59:59")) {
        activeMonth = THISMONTH_SCHEDULE[i].month;
        break;
      }
    }
    var imageMonth = ((activeMonth + 8) % 12) + 1; // カレンダー月→画像month（4月=1 … 3月=12）

    // 2. 年間カリキュラム(DOM)から、指定レベルの当月itemを取得
    //    ※年間カリキュラムは全月をDOMに描画済みなので、テキストの二重管理が不要
    function getThisMonthYearItem(level) {
      var $item = null;
      $(".content-level" + level)
        .find(".enrol-section-basesubject-year-lesson-content-child-curriculum")
        .each(function () {
          var m = parseInt(
            $(this)
              .find(".enrol-section-basesubject-year-lesson-content-child-curriculum-month .month")
              .text(),
            10
          );
          if (m === activeMonth) {
            $item = $(this);
            return false; // break
          }
        });
      return $item;
    }

    var headingYear = null;

    // 3. thismonthの各レベル・週を、年間セクションのテキスト＋月置換した画像で上書き
    //    ※page-enrol-index.js で募集停止レベルが削除済みでも、残ったgridだけ更新される
    $thisMonth
      .find(".enrol-section-basesubject-thismonth-lesson-grid")
      .each(function () {
        var $grid = $(this);
        var level = $grid.data("level");
        var $yearItem = getThisMonthYearItem(level);
        var texts = null;

        if ($yearItem) {
          var $spans = $yearItem.find(
            ".enrol-section-basesubject-year-lesson-content-child-curriculum-detail-subcontent span"
          );
          texts = [$spans.eq(0).text(), $spans.eq(1).text(), $spans.eq(2).text()];
          // 見出し用の年もDOM（年間カリキュラム）から取得
          if (headingYear === null) {
            headingYear = $yearItem
              .find(".enrol-section-basesubject-year-lesson-content-child-curriculum-month .year")
              .text()
              .replace(/\s/g, "");
          }
        }

        $grid
          .find(".enrol-section-basesubject-thismonth-lesson-grid-lesson")
          .each(function () {
            var $lesson = $(this);
            var week = parseInt($lesson.data("week"), 10); // 1〜3

            // 画像: 既存srcの monthN を当月に置換するだけ
            var $img = $lesson.find(
              ".enrol-section-basesubject-thismonth-lesson-grid-lesson-banner img"
            );
            var src = $img.attr("src") || "";
            $img.attr("src", src.replace(/month\d+/, "month" + imageMonth));

            // テキスト: 年間カリキュラムの当月分
            if (texts && texts[week - 1] != null && texts[week - 1] !== "") {
              $lesson
                .find(".enrol-section-basesubject-thismonth-lesson-grid-lesson-text")
                .text(texts[week - 1]);
            }
          });
      });

    // 4. 見出しを更新（年もDOMから。取得できなければ月から算出: 1〜3月は翌年）
    $thisMonthSection
      .find(".enrol-title")
      .text(
        (headingYear || (activeMonth >= 4 ? 2026 : 2027)) + "年" + activeMonth + "月の授業"
      );

    // 5. 画像が全て「正常に」読み込み終わってからセクションを表示する。
    //    1枚でも読み込みエラー（404等）や読み込み未完了があれば表示しない＝壊れた/古い表示を出さない。
    //    JS未発火・データ不備時も非表示のまま。
    var $banners = $thisMonth.find(
      ".enrol-section-basesubject-thismonth-lesson-grid-lesson-banner img"
    );
    var totalBanners = $banners.length;
    var loadedBanners = 0;
    function onBannerLoaded() {
      loadedBanners++;
      // 全画像が成功したときだけ表示（エラーがあると total に届かず非表示のまま）
      if (loadedBanners >= totalBanners) $thisMonthSection.css("display", "");
    }

    if (totalBanners === 0) {
      // 画像が無い場合は内容更新済みのため表示
      $thisMonthSection.css("display", "");
    } else {
      $banners.each(function () {
        if (this.complete) {
          // 既に読み込み完了しているケース（キャッシュ等）
          if (this.naturalWidth > 0) {
            onBannerLoaded(); // 成功
          }
          // naturalWidth === 0 は読み込み失敗 → カウントせず非表示のまま
        } else {
          $(this).one("load", onBannerLoaded); // 成功時のみカウント
          // error は購読しない（=カウントしない）ので、1枚でも失敗すれば非表示のまま
        }
      });
    }
  }
}
