// ==============================
// 購入処理：ページ内の購入ボタンやセット割引の表示、購入関連のモーダル処理
// ==============================
if (bodyId === "page-enrol-index") {
    ////////////////////////////
    // キャンペーンバナーの表示
    ////////////////////////////
    const today = new Date(); // 現在の日付を取得
    const AmazonGiftFreeCampaignEndDate = new Date(AmazonGiftFreeCampaignEnd); // AmazonGiftFreeCampaignEndをDateオブジェクトに変換

    // URLクエリパラメータを取得し、htmlCopyが含まれているかチェック
    const searchParams = new URLSearchParams(window.location.search);
    const isHtmlCopy = searchParams.has("htmlCopy") || searchParams.get("params") === "htmlCopy";

    if (!isHtmlCopy && today <= AmazonGiftFreeCampaignEnd) {
      $(function() {
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

    const subjectCategory = currentViewCourseData.key;  // 現在選択されている科目カテゴリーを取得

    ////////////////////////////
    // DayDisabledFeeで定めた日は購入ができないことを示す追従を表示
    ////////////////////////////
    if(DayDisabledFee == DayOfMonth){
      // 追従のタグを追加
      $("#page-enrol-index").append('<div class="disabled-fee-fixed"><span class="icon-disabled-fee-fixed">&#x26a0;&#xfe0f;</span>毎月' + DayDisabledFee + '日はシステムメンテナンスのため、受講登録手続きができません。<br class="br-disabled-fee-fixed">お手数ですが、翌日以降に手続きをお願いします。</div>');
      // 追従が出ていることを示すクラスをbodyタグに追加
      $('#page-enrol-index').addClass('is-disabled-fee-fixed');
      // 科目（哲学/科学/経済/英語/2,3科目セット）の購入ボタンでStripe決済のモーダルが発動しないようにする
      $(".enrol_fee_payment_region button").attr('data-action', '');
    }

    ////////////////////////////
    // moodleのページエディタでgoogleカレンダーiframeが弾かれるので、jsで埋め込み
    //////////////////////////// 

    // カレンダーの iframe の URL を決定する
    let iframeUrl = ""; // まず空の文字列で初期化

    // subjectCategory の値に応じて適切なURLを設定
    switch (subjectCategory) {
        case "philosophy":
            iframeUrl = iframeCalenderPhilosophy; // 哲学用のカレンダー
            break;
        case "science":
            iframeUrl = iframeCalenderScience; // 科学用のカレンダー
            break;
        case "economy":
            iframeUrl = iframeCalenderEconomy; // 経済用のカレンダー（※ タイポに注意）
            break;
        case "globalenglish":
            iframeUrl = iframeCalenderEnglish; // グローバル英語用のカレンダー
            break;
        default:
            // 該当するカテゴリーがない場合は何もしない
            break;
    }

    // iframeUrl が設定されている場合のみ処理を実行
    if (iframeUrl) {
        // iframe の HTML を生成（カレンダーを埋め込む）
        const iframeHtml = `<iframe src="${iframeUrl}" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>`;

        // .enrol-section-calender の中身を iframe に置き換え
        $(".enrol-section-calender").html(iframeHtml);
    }

    //英語、プログラミング以外の教科でセット割引の表現を出す
    if (["philosophy", "science", "economy","twosubjectpack","threesubjectpack"].includes(subjectCategory)) {
    // 購入ボタンの右側にセット割引情報を追加
      const $buttonElement = $(".enrol_fee_payment_region button");
      // 購入ボタンが存在する場合のみ実行
      if ($buttonElement.length) {
        // セット割引情報のHTMLを定義
        const customDivHtml = `
                    <div class="page-enrol-set-discount">
                        <p>セット受講割引でお得！</p>
                        <p><a href='#' class="view-details-link">詳細を見る</a></p>
                    </div>`;
        // ボタンの直後にセット割引情報を挿入
        $buttonElement.after(customDivHtml);
        // 「詳細を見る」リンクがクリックされたときの処理
        $(document).on('click', '.view-details-link', function (event) {
          event.stopImmediatePropagation();

          // twosubjectpack（2科目セット）とthreesubjectpack（3科目セット）のIDを取得
          const twosubjectpackId = subjects.find(subject => subject.key === 'twosubjectpack').id;  
          const threesubjectpackId = subjects.find(subject => subject.key === 'threesubjectpack').id;  

          // モーダルを表示：セット購入の詳細情報
          createModal({
            close: true,  // モーダルを閉じるボタンを表示
            title: "哲学 / 科学 / 経済の3教科は<br />まとめて受講するとお得です", // モーダルのタイトル
            buttons: [
              { text: "2教科を受講：11,000円(税)/月", url: `https://lms.waomirai.com/enrol/index.php?id=${twosubjectpackId}`, class: "btn-primary" }, // 2教科セットのリンク
              { text: "3教科を受講：15,400円(税)/月", url: `https://lms.waomirai.com/enrol/index.php?id=${threesubjectpackId}`, class: "btn-primary" }, // 3教科セットのリンク
            ]
          });
        });
    }}

    // 画面下部に料金を固定表示
    const SubjectpPrice = $('.enrol_fee_payment_region b:contains("¥")'); // 価格情報を含む要素を取得
    var SubjectPriceContent = `<div class="c-pc-hidden fixed-subject-price">${SubjectpPrice.text()} /月</div>`; // 固定表示用のHTMLを作成
    $("#page.drawers").after(SubjectPriceContent); // 画面下部に価格情報を追加

    // 科目（哲学/科学/経済/英語/2,3科目セット）の購入ボタンがクリックされたときの処理
    $(".enrol_fee_payment_region button").on("click", function (event) {

      // DayDisabledFeeで定めた日は購入ができないことを示すモーダルを表示
      if(DayDisabledFee == DayOfMonth){
        createModal({
          title: "️️毎月" + DayDisabledFee + "日はシステムメンテナンスのため<br />受講登録手続きができません。<br />お手数ですが、翌日以降に<br />手続きをお願いします。<br /><br />",
          buttons: [
            // OKボタンを追加
            { text: "確認しました", class: "btn-primary c-modal-wrap-close-tag" }
          ]
        });
        return; // 下記の処理を行わずに終了
      }
      
      // 「科目変更」専用URLからのアクセス時（URLにflagChangeSubjectが含まれている場合）は、
      // 通常の購入フローで働く「科目変更を促す抑制ロジック」をスキップして処理を続行する。
      // ※ 通常購入時は、科目変更を促す案内が表示されるが、
      // すでに科目変更済みのため、ここでは抑制しないようにしている。
      if (getUrlFlag() === "flagChangeSubject") {
        return; //抑制を止める
      }
      
      // 科目が哲学、科学、経済のいずれかの場合
      if (["philosophy", "science", "economy"].includes(subjectCategory)) {
       

        // 各科目に対応する他の科目を定義
        const otherSubjects = {
          philosophy: ["science", "economy"], // 哲学を選んだ場合、科学または経済のセットを提案
          science: ["philosophy", "economy"], // 科学を選んだ場合、哲学または経済のセットを提案
          economy: ["philosophy", "science"], // 経済を選んだ場合、哲学または科学のセットを提案
        };

        // 1科目を購入した状態で、別の1科目を購入しようとした場合
        if (checkBoughtMainSubject(otherSubjects[subjectCategory])) {
          // セット購入を提案するモーダルを表示
          event.stopImmediatePropagation();
          $("body").append(
            createModal({
              close: true,
              text: "「哲学・経済・化学」の教科で２科目以上受講する際はセット購入がお得です。セット購入の際はフォームより申し込みをお願いいたします。",
              buttons: [
                { text: "変更フォームへ", url: UrlForm, class: "btn-primary" }, // セット購入フォームへのリンク
              ]
            })
          );
        } else if (
          // 2科目または3科目セットを購入済みの場合、セット購入を防ぐ
          checkBoughtMainSubject(["twosubjectpack", "threesubjectpack"])
        ) {
          // すでにセットを購入済みであることを通知するモーダルを表示
          event.stopImmediatePropagation();
          $("body").append(
            createModal({
              close: true,
              text: "すでに複数受講できる科目セットを購入されています。受講科目の選択は「登録情報の変更ページ」で編集可能です。",
              buttons: [
                { text: "科目のレベルを設定する", url: UrlChangeSubject, class: "btn-primary" }, // 未定のリンク
              ]
            })
          );
        }
      }

      // 2科目セットまたは3科目セットを選択した場合
      if (["twosubjectpack", "threesubjectpack"].includes(subjectCategory)) {
        // 他の科目（哲学、科学、経済）を購入している場合、セット購入はできない
        
        if (checkBoughtMainSubject(["philosophy", "science", "economy"])) {
          // セット購入不可の案内モーダルを表示
          event.stopImmediatePropagation();
          $("body").append(
            createModal({
              close: true,
              text: "「哲学・化学・経済」の科目のいずれかを受講している場合、こちらのボタンからセット受講を購入することはできません。下記フォームより購入を申し込む必要がございます。",
              buttons: [
                { text: "複数科目セットの購入フォームへ", url: UrlForm, class: "btn-primary" }, // セット購入フォームへのリンク
              ]
            })
          );
        } else if (
          // すでに3科目セットを購入している場合、2科目セットへの変更を促す
          subjectCategory === "twosubjectpack" && checkBoughtMainSubject(["threesubjectpack"])
        ) {
          event.preventDefault(); // デフォルトの購入動作（フォーム送信）を防止
          $("body").append(
            createModal({
              close: true,
              text: "「３科目セット」を購入済みです。２科目セットへ受講変更したい場合はフォームよりお問い合わせをお願いいたします。",
              buttons: [
                { text: "受講変更フォームへ", url: UrlForm, class: "btn-primary" }, // 受講変更フォームへのリンク
              ]
            })
          );
        } else if (
          // すでに2科目セットを購入している場合、3科目セットへの変更を促す
          subjectCategory === "threesubjectpack" && checkBoughtMainSubject(["twosubjectpack"])
        ) {
          event.stopImmediatePropagation();
          $("body").append(
            createModal({
              close: true,
              text: "「２科目セット」を購入済みです。３科目セットへ受講変更したい場合はフォームよりお問い合わせをお願いいたします。",
              buttons: [
                { text: "受講変更フォームへ", url: UrlForm, class: "btn-primary" }, // 受講変更フォームへのリンク
              ]
            })
          );
        }
      }
  });
}

