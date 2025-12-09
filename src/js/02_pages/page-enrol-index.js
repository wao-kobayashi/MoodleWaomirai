// ==============================
// 購入処理：ページ内の購入ボタンやセット割引の表示、購入関連のモーダル処理
// ==============================
if (bodyId === "page-enrol-index") {
  // ============================
  // 定数定義
  // ============================
  // メイン科目（哲学/科学/経済/2科目セット/3科目セット）の配列
  const MAIN_SUBJECTS = ["philosophy", "science", "economy", "twosubjectpack", "threesubjectpack"];
  
  // 日付関連の変数
  const today = new Date(); // 現在の日付
  const AmazonGiftFreeCampaignEndDate = new Date(AmazonGiftFreeCampaignEnd); // キャンペーン終了日
  const subjectCategory = currentViewCourseData.key; // 現在表示されている科目のカテゴリー

  // ============================
  // キャンペーンバナーの表示
  // ============================
  // URLパラメータをチェック（htmlCopyパラメータの有無を確認）
  const searchParams = new URLSearchParams(window.location.search);
  const isHtmlCopy = searchParams.has("htmlCopy") || searchParams.get("params") === "htmlCopy";

  // htmlCopyパラメータがなく、かつキャンペーン期間中の場合、バナーを表示
  if (!isHtmlCopy && today <= AmazonGiftFreeCampaignEndDate && !hasBoughtMainSubject) {
    $(function() {
      // SP用とPC用のバナー画像を含むHTML
      const CampaignBannerHtml = `
          <div class="c-pc-hidden">
            <img src="${ImgBannerAmazonGiftFreeCampaignSp}">
          </div>
          <div class="c-sp-hidden">
            <img src="${ImgBannerAmazonGiftFreeCampaignPc}">
          </div>
      `;      
      $('.enrol-campaign-banner').append(CampaignBannerHtml);
      $('.enrol-campaign-banner').show();
    });
  }

  // ============================
  // メンテナンス日の購入制限
  // ============================
  // メンテナンス日かどうかをチェック
  const isDisabledDay = DayDisabledFee == DayOfMonth;
  
  // 既存購入があるかをチェック
  // - メイン科目で既に購入している場合
  // - 英語科目で体験終了後の講座を購入している場合
  const hasExistingPurchase = (MAIN_SUBJECTS.includes(subjectCategory) && checkBoughtMainSubject(MAIN_SUBJECTS)) || 
                              (subjectCategory === "globalenglish" && hasBoughtTrialendSubject);
  
  // メンテナンス日で、かつ既存購入がない場合、購入制限を適用
  if(isDisabledDay && !hasExistingPurchase) {
    // ページ下部に固定の警告メッセージを追加
    $("#page-enrol-index").append('<div class="disabled-fee-fixed"><span class="icon-disabled-fee-fixed">&#x26a0;&#xfe0f;</span>毎月' + DayDisabledFee + '日はシステムメンテナンスのため、受講登録手続きができません。<br class="br-disabled-fee-fixed">お手数ですが、翌日以降に手続きをお願いします。</div>');
    // メンテナンス中を示すクラスを追加
    $('#page-enrol-index').addClass('is-disabled-fee-fixed');
    // 購入ボタンのStripe決済アクションを無効化
    $(".enrol_fee_payment_region button").attr('data-action', '');
  }

  // ============================
  // Googleカレンダーiframe埋め込み
  // ============================
  // 科目ごとのカレンダーURLマッピング
  const calendarMap = {
      philosophy: iframeCalenderPhilosophy,    // 哲学
      science: iframeCalenderScience,          // 科学
      economy: iframeCalenderEconomy,          // 経済
      globalenglish: iframeCalenderEnglish     // グローバル英語
  };

  // 現在の科目に対応するカレンダーURLを取得
  const iframeUrl = calendarMap[subjectCategory];
  if (iframeUrl) {
      // iframeのHTMLを生成してページに挿入
      const iframeHtml = `<iframe src="${iframeUrl}" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>`;
      $(".enrol-section-calender").html(iframeHtml);
  }

  // ============================
  // セット割引情報の表示
  // ============================
  // セット割引対象科目の場合、割引情報を表示
  if (MAIN_SUBJECTS.includes(subjectCategory)) {
    const $buttonElement = $(".enrol_fee_payment_region button");
    if ($buttonElement.length) {
      // セット割引の案内HTMLを生成
      const customDivHtml = `
        <div class="page-enrol-set-discount">
          <p>セット受講割引でお得!</p>
          <p><a href='#' class="view-details-link">詳細を見る</a></p>
        </div>`;
      // 購入ボタンの後に割引情報を追加
      $buttonElement.after(customDivHtml);
      
      // 「詳細を見る」リンクがクリックされた時の処理
      $(document).on('click', '.view-details-link', function (event) {
        event.stopImmediatePropagation(); // イベント伝播を停止
        
        // 2科目セットと3科目セットのコースIDを取得
        const twosubjectpackId = subjects.find(subject => subject.key === 'twosubjectpack').id;  
        const threesubjectpackId = subjects.find(subject => subject.key === 'threesubjectpack').id;  

        // セット割引の詳細モーダルを表示
        createModal({
          close: true,
          title: "哲学 / 科学 / 経済の3教科は<br />まとめて受講するとお得です",
          buttons: [
            { text: "2教科を受講：11,000円(税)/月", url: `https://lms.waomirai.com/enrol/index.php?id=${twosubjectpackId}`, class: "btn-primary" },
            { text: "3教科を受講：15,400円(税)/月", url: `https://lms.waomirai.com/enrol/index.php?id=${threesubjectpackId}`, class: "btn-primary" },
          ]
        });
      });
    }
  }

  // ============================
  // 画面下部に料金を固定表示
  // ============================
  // 料金表示部分から価格を取得（「JPY」を含む要素）
  const SubjectpPrice = $('.enrol_fee_payment_region b:contains("JPY")');
  // 「JPY」を「¥」に変換して固定表示用のHTMLを生成
  const SubjectPriceContent = `<div class="c-pc-hidden fixed-subject-price">${SubjectpPrice.text().replace('JPY', '¥')} /月</div>`;
  // ページ下部に価格を固定表示として追加
  $("#page.drawers").after(SubjectPriceContent);

  // ============================
  // 購入ボタンクリック時の処理
  // ============================
  $(".enrol_fee_payment_region button").on("click", function (event) {
    // 初月無料フラグがある、または哲学、科学、経済を持っていて哲学、科学、経済のページにいる場合
    if (hasBoughtTrialendSubject || (MAIN_SUBJECTS.includes(subjectCategory) && checkBoughtMainSubject(MAIN_SUBJECTS))) {
      window.open(UrlSubjectChangeForm, '_blank');
    }

    // メンテナンス日で既存購入がない場合
    // → 購入不可のモーダルを表示して処理を中断
    if(isDisabledDay && !hasExistingPurchase){
      createModal({
        title: "️️毎月" + DayDisabledFee + "日はシステムメンテナンスのため<br />受講登録手続きができません。<br />お手数ですが、翌日以降に<br />手続きをお願いします。<br /><br />",
        buttons: [{ text: "確認しました", class: "btn-primary c-modal-wrap-close-tag" }]
      });
      return; // これ以降の処理は実行しない
    }
    
    // 科目変更専用URLからのアクセスの場合
    // → 通常の科目変更抑制ロジックをスキップ
    if (getUrlFlag() === "flagChangeSubject") {
      return;
    }
  });

  // ============================
  // 科目変更フォームへの誘導処理（共通関数）
  // ============================
  /**
   * 既存購入者向けに、購入ボタンを「科目変更フォームへ進む」ボタンに変更する
   * - 購入処理を無効化
   * - ボタンテキストと説明文を変更
   * - スマホ表示の場合、レイアウトを調整
   */
  function setupSubjectChangeRedirect() {
    // 購入ボタンのStripe決済アクションを無効化
    $(".enrol_fee_payment_region button").attr('data-action', '');
    
    // 「登録月は無料です。」のテキストを科目変更案内に変更
    $('p:contains("登録月は無料です。")').each(function() {
      $(this).text('科目の追加は科目変更フォームから申請をお願いいたします。');
    });
    
    // ボタンのテキストを変更
    $('.enrol_fee_payment_region button strong').text('科目変更フォームへ進む'); 

    // スマホ表示の場合のレイアウト調整
    if ($(window).width() <= 768) {
      $('.fixed-subject-price').hide(); // 画面下部の固定価格表示を非表示
      // ボタンのスタイルを調整（画面下部に固定、幅90%）
      $('.enrol_fee_payment_region .btn.btn-secondary').css({
        width: '90%',
        margin: 'auto',
        left: '0',
        right: '0',
        bottom: '20px'
      }); 
    }
  }

  // ============================
  // 科目変更誘導
  // ============================

  // 初月無料フラグがある、または哲学、科学、経済を持っていて哲学、科学、経済のページにいる場合
  if (hasBoughtTrialendSubject || (MAIN_SUBJECTS.includes(subjectCategory) && checkBoughtMainSubject(MAIN_SUBJECTS))) {
    setupSubjectChangeRedirect();
  }
}