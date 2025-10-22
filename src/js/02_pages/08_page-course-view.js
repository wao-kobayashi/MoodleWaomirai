
// ==============================
// 科目ページの処理
// ==============================
// ページIDが'page-course-view-flexsections',page-course-view-topicsかつ管理者でない場合に実行
if (
  (bodyId === "page-course-view-flexsections" || bodyId === "page-course-view-topics") 
  && !hasBoughtAdminSubject
) {

  ////////////////////////////
  // 前々月以前のトピックを削除
  ////////////////////////////

  // 正規表現で年と月を抽出するパターン
  var datePattern = /^(\d{4})年(\d{1,2})月：/;

  // 現在の日付を取得
  var now = new Date();

  // 前月の1日を計算して基準日を設定
  var cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // 各トピックでループを回す
  $('.course-section-header [data-for="sectiontoggler"]').each(function() {
    var $courseSection = $(this).closest('.course-section');  // aria-label属性の値を取得
    var ariaLabel = $(this).attr('aria-label'); // 正規表現で年月を抽出
    var match = ariaLabel.match(datePattern);
    // 年月の表記があるかチェック
    if (match) {
        var date = new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1);
        if (date < cutoffDate) {
            $courseSection.remove();
            return;
        }
    }

    //////////////////////////// 
    // 授業のまとめシートを追加
    ////////////////////////////

    // コース詳細ページが哲学、科学、経済のいずれかの場合
    // まとめシートは上記３教科のため
    if (["philosophy", "science", "economy"].includes(currentViewCourseData?.key) && 
        ariaLabel && ariaLabel.includes('年') && ariaLabel.includes('月')) {
     
      // modtype_resource 内の activity-icon の href を取得して削除
      var hrefList = $courseSection.find('.modtype_resource').map(function() {
          // 各 .modtype_resource の中から .activity-icon 要素を探し、その href 属性（ダウンロード先URLなど）を取得
          var href = $(this).find('.activity-icon').attr('href');
          // 取得した後、このリソース（.modtype_resource）自体をセクションから削除
          // 目的：標準のリソース表示を隠し、後段で用意するカスタムの「まとめシート」UIに置き換えるため
          $(this).remove();
          // 取得できた場合はそのURLを返し、取得できなければ null を返す（後で .get() で配列化）
          return href || null;
      }).get(); // jQuery の map() からプレーンな配列に変換

      // 現在処理中のコースセクション内から、実際にリストアイテム（アクティビティ群）を挿入する .section を取得
      var $section = $courseSection.find('.section');

      // .section が存在する＆問いが存在する場合、カスタムUIの挿入を行う
      if ($section.length && $section.find('li.modtype_questionnaire').length) {
          if (hrefList.length) {
              $courseSection.addClass('subject-page-added');
              // 1件以上のリソース（mod）が存在する場合：ダウンロード可能な「まとめシート」を表示
              // 先頭のURL（hrefList[0]）をダウンロードボタンのリンク先に使用
              var modHtml = `
              <li class="subject-page-added-note published">
                  <div class="subject-page-added-note-head">
                      <div class="subject-page-added-note-head-title">授業の<br>まとめシート</div>
                      <div class="subject-page-added-note-head-icon"></div>
                  </div>
                  <div class="subject-page-added-note-content">
                      授業の復習にご活用ください！ファイリングして、あなただけの「未来塾ノート」を作ってみてくださいね！
                  </div>
                  <a class="subject-page-added-note-content-download" href="${hrefList[0]}" target="_blank">
                      <span class="material-symbols-outlined">download</span>
                      <div class="subject-page-added-note-content-download-text">ダウンロードする</div>
                  </a>
              </li>`;
              // 生成した「まとめシート」要素を当該 .section の末尾に追加
              $section.append(modHtml);
              // デバッグ用ログ：追加したURLリストを出力
              console.log(".section に href を追加しました:", hrefList);
          } 
      }
    }
});



  ////////////////////////////
  // メイン3科目または2科目、3科目パック購入後のリダイレクト処理
  ////////////////////////////

  // 現在表示しているページがメイン科目（哲学、科学などのトップページ）かチェック
  if (currentViewCourseData?.type === "main") {
    // 現在表示中のメイン科目のキー（例：science, philosophy）を取得
    const currentMainSubjectKey = currentViewCourseData.key;
    
    // 現在表示中のメイン科目の情報（ID含む）を取得
    const currentMainSubject = subjects.find(
      (subject) => 
        subject.key === currentMainSubjectKey && 
        subject.type === "main"
    );

    // ユーザーが現在のメイン科目の受講権限を持っているかチェック
    // bodyClassesには、ユーザーが受講権限を持つ全コースのIDが含まれている
    const hasMainSubjectAccess = bodyClasses.includes(currentMainSubject.id);

    // メイン科目の受講権限がない場合は処理を終了
    // 例：科学のページを見ているが、科学の受講権限を持っていない
    if (!hasMainSubjectAccess) {
      console.log(`${currentMainSubjectKey}のメイン科目の受講権限がありません`);
      return;
    }

    // 2科目パックや3科目パックの場合の特別処理
    // これらはレベル設定が必要ないため、即座にモーダルを表示して終了
    if (currentMainSubjectKey === "twosubjectpack" || currentMainSubjectKey === "threesubjectpack") {
       showModalAfterCardRegistration();
      return;
    }

    // ユーザーが受講中の子科目（L1～L4）を検索
    // 例：科学L1、科学L2など
    const enrolledChildCourse = subjects.find(
      (subject) => 
        // 同じ科目系統（科学なら科学）
        subject.key === currentMainSubjectKey && 
        // タイプが子科目
        subject.type === "child" && 
        // その子科目の受講権限を持っている
        bodyClasses.includes(subject.id)
    );

    // 子科目を受講している場合（例：科学L1を受講中）
    if (enrolledChildCourse) {
      // 該当の子科目ページ（例：科学L1のページ）にリダイレクト
      window.location.href = `https://lms.waomirai.com/course/view.php?id=${enrolledChildCourse.id}`;
    } else {
      // 子科目を受講していない場合（例：科学は受講可能だが、L1～L4のレベルを設定していない）
      // カード登録後にモーダルを表示する関数
      // 機能：
      // 1. キャンペーン期間中（2025年9月15日まで）かつ初回表示の場合
      //    → キャンペーンモーダルを表示（無料受講案内 + Amazonギフト券プレゼント案内）
      // 2. それ以外の場合
      //    → レベル設定モーダルを表示（科目のレベル設定ページへの誘導）
      // 3. モーダル表示履歴はCookieに保存（365日有効）
      showModalAfterCardRegistration();
    }
  }
}





// カード登録後にモーダルを表示する関数
function showModalAfterCardRegistration() {
  var now = new Date(); // 現在の日付を取得
  var cookieValue = $.cookie("levelSettingModalShown"); // Cookieにモーダル表示の履歴があるか確認
  var subjectCategory = currentViewCourseData.key;  // 現在選択されている科目カテゴリーを取得

  // ".c-modal-level-setting"クラスの要素がクリックされた場合にレベル設定モーダルを表示
  $(document).on("click", ".c-modal-level-setting", function () {
    showLevelSettingModal();
  });

  // キャンペーン期間中かつモーダルが未表示の場合
  if (now <= AmazonGiftFreeCampaignEnd && !cookieValue) {
    // キャンペーンモーダルを表示
    showCampaignModal();

    // モーダルが表示されたことをCookieに記録（365日有効）
    $.cookie("levelSettingModalShown", "true", { expires: 365, path: "/" });
    return; // キャンペーンモーダルが表示された後は処理を終了
  }

  // それ以外の場合はレベル設定モーダルを表示
  showLevelSettingModal();
}


// 2025年9月キャンペーンのモーダル関数
function showCampaignModal() {
  createModal({
    title: "おめでとうございます！",
    wrapClass: "c-modal-wrap-wrap-campaign",
    text: "<b>キャンペーンを<br />適用させていただきます。</b><br /><br />2025年10・11月は無料で受講いただけます。<br />2025年11月も受講いただけたら<br />Amazonギフト券5000円プレゼントいたします。<br />",
    buttons: [
      { text: "OKです", class: "btn-primary c-modal-level-setting c-modal-wrap-close-tag" }
    ]
  });
}

// レベル変更のモーダル関数
function showLevelSettingModal() {
  createModal({
    image: "https://waomirai.com/lp/assets/moodle/images/modal_subject.png",
    imageClass: "c-modal-wrap-subject-img",
    wrapClass: "c-modal-wrap-subject",
    buttons: [
      { text: "科目のレベルを設定する", url: UrlChangeSubject, class: "btn-primary" }
    ]
  });
}
