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
  const subjectCategory = currentViewCourseData.key; // 現在表示されている科目のカテゴリー

  /**
   * 現在の購入制限状態を判定する関数
   * 
   * 【処理フロー】
   * 1. 既存購入チェック → ある場合は制限なし（null返却）
   * 2. PurchaseRestrictions配列を上から順にチェック
   * 3. 最初にマッチした制限情報を返却
   * 4. どの制限にもマッチしない場合はnull返却
   * 
   * 【既存購入者の除外ロジック】
   * 以下のいずれかに該当する場合、制限は適用されません：
   * - メイン科目を既に購入している
   * - グローバル英語の体験終了講座を購入している
   * - 初月無料フラグがある
   * 
   * @returns {Object|null} 制限情報 { message: string, modalTitle: string } 
   *                        または制限なしの場合null
   */
  function getCurrentRestriction() {
    const now = new Date(); // 現在日時を取得
    
    // ----------------------------------------
    // 既存購入チェック：購入済みユーザーは制限対象外
    // ----------------------------------------
    const hasExistingPurchase = 
      // メイン科目に存在していてメイン科目（哲学/科学/経済等）を購入済み
      (MAIN_SUBJECTS.includes(subjectCategory) && checkBoughtMainSubject(MAIN_SUBJECTS)) || 
      // 英語ページに存在してメイン科目（哲学/科学/経済等）を購入済み
      (subjectCategory === "globalenglish" && hasBoughtTrialendSubject);
    
    // 既存購入がある、または初月無料フラグがある場合は制限なし
    if (hasExistingPurchase || hasBoughtTrialendSubject) {
      return null;
    }
    
    // ----------------------------------------
    // 制限設定を順にチェック（配列の上から順に確認）
    // ----------------------------------------
    for (const restriction of PurchaseRestrictions) {
      
      // タイプ1: 特定期間の制限チェック
      if (restriction.type === 'period') {
        // periods配列内の各期間をチェック
        for (const period of restriction.periods) {
          const start = new Date(period.start); // 制限開始日時
          const end = new Date(period.end);     // 制限終了日時
          
          // 現在日時が制限期間内かチェック（start <= now < end）
          if (now >= start && now < end) {
            // 制限期間内の場合、その制限情報を返却
            return {
              message: period.message,       // ページ下部表示用メッセージ
              modalTitle: period.modalTitle  // モーダル表示用タイトル
            };
          }
        }
      } 
      // タイプ2: 毎月定期メンテナンスの制限チェック
      else if (restriction.type === 'monthly') {
        // 現在の日付が指定された日（例：1日）と一致するかチェック
        if (now.getDate() === restriction.day) {
          // 該当日の場合、その制限情報を返却
          return {
            message: restriction.message,       // ページ下部表示用メッセージ
            modalTitle: restriction.modalTitle  // モーダル表示用タイトル
          };
        }
      }
    }
    
    // どの制限にもマッチしない場合はnullを返却（制限なし）
    return null;
  }

  /**
   * 購入制限のUI反映処理
   * 
   * 制限がある場合に以下の3つの処理を実行します：
   * 1. ページ下部に警告メッセージを追加表示
   * 2. ページ全体に制限中を示すCSSクラスを付与
   * 3. 購入ボタンのStripe決済アクションを無効化
   * 
   * @param {Object} restriction - 制限情報オブジェクト
   * @param {string} restriction.message - 表示するHTMLメッセージ
   */
  function applyPurchaseRestriction(restriction) {
    // 1. ページ下部に警告メッセージを追加（HTMLとして挿入）
    $("#page-enrol-index").append(restriction.message);
    
    // 2. ページ全体に制限中を示すクラスを付与（CSSで追加スタイル適用可能）
    $('#page-enrol-index').addClass('is-disabled-fee-fixed');
    
    // 3. 購入ボタンのStripe決済アクションを削除（data-action属性を空にする）
    //    → これによりボタンをクリックしても決済処理が実行されなくなる
    $(".enrol_fee_payment_region button").attr('data-action', '');
  }

  // ============================
  // キャンペーンバナーの表示
  // ============================
  // URLパラメータをチェック（htmlCopyパラメータの有無を確認）
  const searchParams = new URLSearchParams(window.location.search);
  const isHtmlCopy = searchParams.has("htmlCopy") || searchParams.get("params") === "htmlCopy";

  // htmlCopyパラメータがなく、かつキャンペーン期間中の場合、バナーを表示
  if (!isHtmlCopy && today <= AmazonGiftFreeCampaignEnd && !hasBoughtMainSubject) {
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
  // 購入制限の適用（初期化時）
  // ============================
  /**
   * ページ読み込み時に購入制限をチェックし、該当する場合はUIに反映
   * 
   * getCurrentRestriction()で現在の制限状態を取得し、
   * 制限がある場合（null以外）はapplyPurchaseRestriction()でUIを更新
   */
  const currentRestriction = getCurrentRestriction();
  if (currentRestriction) {
    applyPurchaseRestriction(currentRestriction);
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

    // ----------------------------------------
    // 購入制限チェック（クリック時に最新状態で再確認）
    // ----------------------------------------
    /**
     * ページ読み込み後に日付が変わった場合などを考慮し、
     * ボタンクリック時に改めて制限状態をチェックします。
     * 
     * 制限がある場合：
     * - モーダルで警告メッセージを表示
     * - 処理を中断（return）
     */
    const restriction = getCurrentRestriction();
    if (restriction) {
      createModal({
        title: restriction.modalTitle, // 制限情報のモーダルタイトルを表示
        buttons: [{ text: "確認しました", class: "btn-primary c-modal-wrap-close-tag" }]
      });
      return; // これ以降の処理は実行しない
    }
    
    // 既存購入者の科目変更誘導
    if (hasBoughtTrialendSubject || (MAIN_SUBJECTS.includes(subjectCategory) && checkBoughtMainSubject(MAIN_SUBJECTS))) {
      window.open(UrlSubjectChangeForm, '_blank');
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
    if (window.matchMedia('(max-width: 767px)').matches) {
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
  // 科目変更誘導の適用
  // ============================
  // 以下の条件に該当の場合に場合科目変更誘導ロジックを適用
  // -　初月無料終了
  // -　メイン科目のページにいてメイン科目いずれかを購入済み
  if (hasBoughtTrialendSubject || (MAIN_SUBJECTS.includes(subjectCategory) && checkBoughtMainSubject(MAIN_SUBJECTS))) {
    setupSubjectChangeRedirect();
  }
// ============================
// 特定科目での追加HTML表示
// ============================
// economy, twosubjectpack, threesubjectpackの場合に追加HTMLを表示
if (['economy', 'twosubjectpack', 'threesubjectpack'].includes(subjectCategory)) {
  const $buttonElement = $(".enrol_fee_payment_region .btn-secondary");
  if ($buttonElement.length) {
    // 追加するHTMLを定義
    const additionalHtml = `
   <div style="color:#999; font-size:12px; margin:10px 0 10px;">経済レベル3/4は2026年1月〜3月は募集停止中です</div>
    `
    // ボタンの直後に追加
    $buttonElement.after(additionalHtml);
  }
}
if (['economy'].includes(subjectCategory)) {
  $('.enrol-section-basesubject-thismonth-lesson > div:gt(3)').remove();
}

}