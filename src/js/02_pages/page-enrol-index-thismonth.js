// ==============================
// enrol-index「今月の授業」自動更新
//
// ・日付から表示対象月を決定
// ・画像URL内の monthN を対象月へ置換
// ・授業名は年間カリキュラムDOMから取得
// ・現在表示中の授業名を照合して対象レベルを特定
// ・各週はDOMの並び順で対応
//
// ※data-level / data-week は使用しない
// ==============================
if (bodyId === "page-enrol-index") {
  // 各月を表示する締め日
  var THISMONTH_SCHEDULE = [
    { until: "2026-08-21", month: 8 },
    { until: "2026-09-18", month: 9 },
    { until: "2026-10-23", month: 10 },
    { until: "2026-11-20", month: 11 },
    { until: "2026-12-19", month: 12 },
    { until: "2027-01-29", month: 1 },
    { until: "2027-02-19", month: 2 },
    { until: "2027-04-30", month: 3 },
  ];

  var $section = $(".enrol-section.js-thismonth");
  var $thisMonth = $section.find(
    ".enrol-section-basesubject-thismonth-lesson"
  );

  if ($section.length && $thisMonth.length) {
    var curriculumSelector =
      ".enrol-section-basesubject-year-lesson-content-child-curriculum";

    var monthSelector =
      ".enrol-section-basesubject-year-lesson-content-child-curriculum-month";

    var detailSelector =
      ".enrol-section-basesubject-year-lesson-content-child-curriculum-detail-subcontent span";

    var gridSelector =
      ".enrol-section-basesubject-thismonth-lesson-grid";

    var lessonSelector =
      ".enrol-section-basesubject-thismonth-lesson-grid-lesson";

    var imageSelector =
      ".enrol-section-basesubject-thismonth-lesson-grid-lesson-banner img";

    var textSelector =
      ".enrol-section-basesubject-thismonth-lesson-grid-lesson-text";

    // ----------------------------------
    // 表示対象月を決定
    // ----------------------------------
    var today = new Date();
    var activeMonth =
      THISMONTH_SCHEDULE[THISMONTH_SCHEDULE.length - 1].month;

    for (var i = 0; i < THISMONTH_SCHEDULE.length; i++) {
      var until = new Date(
        THISMONTH_SCHEDULE[i].until + "T23:59:59"
      );

      if (today <= until) {
        activeMonth = THISMONTH_SCHEDULE[i].month;
        break;
      }
    }

    // 4月=month1、5月=month2、…、3月=month12
    var imageMonth = ((activeMonth + 8) % 12) + 1;
    var headingYear = null;

    // 比較時に空白や改行の差を無視する
    function normalizeText(text) {
      return String(text || "").replace(/\s+/g, "");
    }

    // 年間カリキュラムから授業名を取得
    function getCurriculumTexts($item) {
      var texts = [];

      $item.find(detailSelector).each(function () {
        texts.push(normalizeText($(this).text()));
      });

      return texts;
    }

    // 年間カリキュラムを持つcontent-levelN要素を収集
    var yearLevels = [];
    var usedLevels = {};

    $("[class*='content-level']").each(function () {
      var $level = $(this);
      var className = $level.attr("class") || "";
      var match = className.match(
        /(?:^|\s)content-level(\d+)(?=\s|$)/
      );

      if (!match || !$level.find(curriculumSelector).length) {
        return;
      }

      // 同じlevelの重複登録を防ぐ
      if (!usedLevels[match[1]]) {
        usedLevels[match[1]] = true;
        yearLevels.push($level);
      }
    });

    // 現在表示されている授業名と一致するlevelを探す
    function findYearLevel($grid, gridIndex, gridCount) {
      var currentTexts = [];

      $grid.find(lessonSelector).each(function () {
        currentTexts.push(
          normalizeText($(this).find(textSelector).text())
        );
      });

      var $bestLevel = null;
      var bestScore = 0;

      $.each(yearLevels, function () {
        var $level = this;
        var levelScore = 0;

        // 年間カリキュラム内の全月から現在の授業名を探す
        $level.find(curriculumSelector).each(function () {
          var curriculumTexts = getCurriculumTexts($(this));
          var score = 0;

          for (var i = 0; i < currentTexts.length; i++) {
            if (
              currentTexts[i] &&
              currentTexts[i] === curriculumTexts[i]
            ) {
              // 「フィードバック」は共通しやすいため低得点
              score +=
                currentTexts[i] === "フィードバック" ? 1 : 10;
            }
          }

          levelScore = Math.max(levelScore, score);
        });

        if (levelScore > bestScore) {
          bestScore = levelScore;
          $bestLevel = $level;
        }
      });

      // 固有の授業名が1件以上一致した場合
      if (bestScore >= 10) {
        return $bestLevel;
      }

      // 全グリッドが残っている場合のみ、並び順を予備判定に使う
      if (
        gridCount === yearLevels.length &&
        yearLevels[gridIndex]
      ) {
        return yearLevels[gridIndex];
      }

      return null;
    }

    // 指定されたlevelから対象月のカリキュラムを取得
    function getActiveMonthItem($level) {
      var $item = null;

      $level.find(curriculumSelector).each(function () {
        var month = parseInt(
          $(this)
            .find(monthSelector + " .month")
            .text()
            .replace(/\s/g, ""),
          10
        );

        if (month === activeMonth) {
          $item = $(this);
          return false;
        }
      });

      return $item;
    }

    var $grids = $thisMonth.find(gridSelector);

    // ----------------------------------
    // 画像・テキストを更新
    // ----------------------------------
    $grids.each(function (gridIndex) {
      var $grid = $(this);
      var $lessons = $grid.find(lessonSelector);

      // 画像はlevelを特定できなくても必ず更新
      $lessons.each(function () {
        var $img = $(this).find(imageSelector);
        var src = $img.attr("src") || "";

        if (src) {
          $img.attr(
            "src",
            src.replace(/month\d+/, "month" + imageMonth)
          );
        }
      });

      // 現在の授業名から対応する年間カリキュラムを特定
      var $yearLevel = findYearLevel(
        $grid,
        gridIndex,
        $grids.length
      );

      if (!$yearLevel || !$yearLevel.length) {
        return;
      }

      var $yearItem = getActiveMonthItem($yearLevel);

      if (!$yearItem || !$yearItem.length) {
        return;
      }

      // 対象月の授業名を取得
      var texts = [];

      $yearItem.find(detailSelector).each(function () {
        texts.push($(this).text().trim());
      });

      // DOMの並び順に合わせてテキストを反映
      $lessons.each(function (index) {
        var newText = texts[index];
        var $target = $(this).find(textSelector);

        if ($target.length && newText) {
          $target.text(newText);
        }
      });

      // 見出し用の年を取得
      if (headingYear === null) {
        headingYear = $yearItem
          .find(monthSelector + " .year")
          .text()
          .replace(/\s/g, "");
      }
    });

    // ----------------------------------
    // 見出しを更新
    // ----------------------------------
    var fallbackYear = activeMonth >= 4 ? 2026 : 2027;

    $section
      .find(".enrol-title")
      .text(
        (headingYear || fallbackYear) +
          "年" +
          activeMonth +
          "月の授業"
      );

    // ----------------------------------
    // 全画像の読み込み成功後に表示
    // ----------------------------------
    var $banners = $thisMonth.find(imageSelector);
    var total = $banners.length;
    var loaded = 0;

    function showWhenReady() {
      loaded++;

      if (loaded >= total) {
        setTimeout(function () {
          $section.css("display", "");
        }, 650);
      }
    }

    // 画像がない場合はそのまま表示
    if (total === 0) {
      $section.css("display", "");
    } else {
      $banners.each(function () {
        // キャッシュなどですでに読み込み済みの場合
        if (this.complete) {
          if (this.naturalWidth > 0) {
            showWhenReady();
          }
        } else {
          // これから読み込まれる場合
          $(this).one("load", showWhenReady);

          // 読み込み失敗時はカウントしないため非表示のまま
        }
      });
    }
  }
}