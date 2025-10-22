
// ==============================
// 汎用的な関数
// ==============================

// ID連携のモーダル
$(".triger-line-integration-modal").on("click", function (e) {
  createModal({
    wrapClass: "c-modal-wrap-line-connection",
    customModalHtml: `<div class="c-modal-wrap-close"></div><div class="c-modal-wrap-linetitle"> <div class="c-modal-wrap-linetitle-img"><img src="https://waomirai.com/lp/assets/moodle/images/icn_line.svg"></div><div class="c-modal-wrap-linetitle-text">LINEで受講サポートの<br>通知を受け取る</div></div><div class="c-modal-wrap-qr c-sp-hidden"><img src="${ImgLiffMoodle}"></div><div class="c-modal-wrap-text">すでに友だち追加済の方も<br>会員連携のために<span class="c-sp-hidden">必ずQRを読み取って下さい</span><span class="c-pc-hidden">必ずボタンを押してください</span><br />※既にLINE連携済みの方は不要です</div><div class="c-modal-button-line c-pc-hidden"><a href="https://liff.line.me/2006716288-lL7QzGA3?loycus_urlc=NN3v"><img src="https://waomirai.com/lp/assets/moodle/images/icn_linewhite.svg"></a></div><button class="c-modal-wrap-button c-modal-wrap-button-close c-modal-wrap-close-tag">閉じる</button>`
  });
});

// メモシートのモーダル
// ボタンがクリックされた時の処理
// 3つの科目（哲学、科学リテラシー、経済）のメモシート選択モーダルを表示
$(document).on("click", ".triger-download-memosheet-modal", function (e) {
  createModal({
    close: true,
    title: "ダウンロードする<br />メモシートの種類を選択",
    buttons: [
      { text: "哲学（思考力）", url: memosheetPhilosophy, class: "btn-primary", blank: true },
      { text: "科学リテラシー", url: memosheetScience, class: "btn-primary", blank: true },
      { text: "経済（お金）", url: memosheetEconomy, class: "btn-primary", blank: true }
    ]
  });
});

// classを指定してスクロールできるように
$(".click-event-subject-comingsoon").on("click", function (e) {
  e.preventDefault(); // デフォルトの動作を防ぐ
  // モーダルを表示：セット購入の詳細情報
  createModal({
    close: true,  // モーダルを閉じるボタンを表示
    title: "この科目は開講準備中です", // モーダルのタイトル
    closetxt: "閉じる", // 閉じるボタンのテキスト
  });
});


// classを指定してスクロールできるように
$("[class*='scroll-to-']").on("click", function (e) {
  e.preventDefault();
  console.log('1. Click event triggered');
  
  var allClasses = $(this).attr("class");
  console.log('2. All classes on clicked element:', allClasses);
  
  var classArray = allClasses.split(" ");
  var className = classArray.find(cls => cls.startsWith("scroll-to-"));
  
  if (className) {
    var targetClass = className.replace("scroll-to-", "");
    var $target = $("." + targetClass);
    
    if ($target.length) {
      // DOM要素を直接取得してスクロール
      var targetElement = $target[0];
      targetElement.scrollIntoView({
        behavior: 'auto', // 'smooth' でスムーズスクロール、'auto' で即時スクロール
        block: 'start'    // 'start', 'center', 'end', 'nearest' から選択可能
      });
      
      console.log('8. Scroll executed using scrollIntoView');
    }
  }
});


// 年間スケジュールのタブ切り替え
$('.tab-level-1').addClass('active');
//  1番目のタブを表示
$('.content-level1').css('display', 'grid');


$('.enrol-section-basesubject-year-lesson-tab-child').click(function() {
  var level = $(this).index() + 1;
  
  // タブのアクティブ切り替え
  $('.enrol-section-basesubject-year-lesson-tab-child').removeClass('active');
  $(this).addClass('active');
  
  // コンテンツの表示切り替え
  $('.enrol-section-basesubject-year-lesson-content-child').hide();
  $('.content-level' + level).css('display', 'grid');
});