// ==============================
// 受講ページの表示ロジック
// ==============================


  // 「レベル」リンクのhrefを格納する変数（最初はnull）
  let levelLink = null;

  // 「3週目」が ol.breadcrumb li のどこかに含まれているか確認
  let hasWeek3 = false;

  $('ol.breadcrumb li').each(function() {
    const $li = $(this);
    if ($li.text().includes('3週目')||$li.text().includes('３週目') ) {
      hasWeek3 = true;
      return false; // 見つかったらループ終了
    }
  });


// 受講ページ（view, complete, report, myreport）の場合
if (bodyId === "page-mod-questionnaire-view" || bodyId === "page-mod-questionnaire-complete" || bodyId === "page-mod-questionnaire-report"|| bodyId === "page-mod-questionnaire-myreport")  {
  

  // スマートフォン版で、ページタイトルを動画の下に表示するためのロジック
  // ページヘッダー（#page-header）を複製して、スマホ用のコンテンツを作成
  const urlQuestionnaire = $('li[data-key="modulepage"] a').attr('href');
  const clonedPageHeader = $("#page-header").clone();
  const clonedCourseLessonDate = $(".course-lesson-date").clone();

  // 複製したコンテンツをラップするためのdiv要素を作成
  const spPageHeader = $("<div>", {
    id: "sp-page-header",   // 新しいdivにIDを設定（スマホ版のページヘッダー）
    class: "c-pc-hidden",   // デスクトップ版では非表示にするためのクラス（PC版では隠す）
  }).append(clonedPageHeader);  // 複製したヘッダーを新しいdivに追加

  const spCourseLessonDate = $("<div>", {  // 新しいdivにIDを設定（スマホ版のページヘッダー）
    class: "c-pc-hidden",   // デスクトップ版では非表示にするためのクラス（PC版では隠す）
  }).append(clonedCourseLessonDate);  // 複製したヘッダーを新しいdivに追加

  // スマホ版のヘッダーを#page-contentの直下に配置（コンテンツの一部として追加）
  $(".activity-description").append(spPageHeader);
  $(".page-context-header").after(spCourseLessonDate);


  // 課題提出セクションの下にリード文を挿入
  // 「授業の視聴が終わったら課題を提出しましょう」という文を、h2タグの後に追加
  const textQuestionnaireNotAnswered = "<p>授業の視聴が終わったら課題を提出しましょう<br />毎月の課題を全部提出すると、<span class='open-modal-badge'>スペシャルなバッジ</span>がゲットできます！<br /><br />今月のバッジ、ゲットできるかな？さあ、課題を提出してみましょう！</p>";
  const textQuestionnaireAnswered = "<p>課題を提出済みです。</p>";
  const textQuestionnaireButtonAnswered = "課題を再提出する";
  const textQuestionnaireTextareaPlaceholder = "ここに回答を入力してください";
  const textQuestionnaireAnswerAll = "他の人の回答を見る";
  const ButtonQuestionnaireBacktoCalender = hasWeek3 
  ? `
   <div class="mod_questionnaire_viewpage"><div class="mod_questionnaire_flex-container">
        <div class="complete"><a href="https://lms.waomirai.com/my/" class="btn btn-primary">受講カレンダーに戻る</a></div>
        <div class="complete"><a href=${urlQuestionnaire} class="btn btn-primary">授業ページに戻る</a></div>
    </div></div>
  `
  : `
   <div class="mod_questionnaire_viewpage"><div class="mod_questionnaire_flex-container">
        <div class="complete"><a href=${urlQuestionnaire} class="btn btn-primary">授業ページに戻る</a></div>
        <div class="complete"><a href="https://lms.waomirai.com/my/" class="btn btn-primary">受講カレンダーに戻る</a></div>
    </div></div>
  `;

  // 各質問コンテナごとに処理を実行
  $('.qn-container').each(function() {
    // 現在の質問コンテナ内でplaceholder-spanを検索
    var $placeholderSpan = $(this).find('.placeholder-span');
    
    // placeholder-spanが存在するか確認
    if ($placeholderSpan.length > 0) {
      // placeholder-spanのテキストを取得(パイプ文字以降)
      var placeholderText = $placeholderSpan.text().trim();
      
      // 同じコンテナ内のtextareaを検索
      var $textarea = $(this).find('.qn-answer textarea');
      
      // textareaが存在する場合、placeholderを設定
      if ($textarea.length > 0 && placeholderText) {
        $textarea.attr('placeholder', placeholderText);
      } 
    } else {
      $(".qn-answer textarea").attr("placeholder", textQuestionnaireTextareaPlaceholder); 
    }
  });


  $('.allresponses a,li[data-key="vall"] a').text(textQuestionnaireAnswerAll);

  
  //li[data-key="yourresponse"]のある場合は回答済みとして扱う
  //li[data-key="yourresponse"]は回答済みの場合、授業ページにdomとして要素が存在する
  if ($('li[data-key="yourresponse"]').length > 0) {
    $(".mod_questionnaire_viewpage h2").after(textQuestionnaireAnswered);
    $(".complete .btn-primary").text(textQuestionnaireButtonAnswered);
  } else {
    $(".mod_questionnaire_viewpage h2").after(textQuestionnaireNotAnswered);
  }

  //完了ページには提出済みの文言を追加
  if ($(".surveyTitle").text().includes("ありがとう")) {

    $(".mod_questionnaire_completepage h3").after(ButtonQuestionnaireBacktoCalender);
    if (hasWeek3) {
      $(".surveyTitle").after('<p class="surveyText">今月の課題をすべて提出できているとバッジが手に入ります！受講カレンダーで確認してみましょう。</p>')
      }
  }
}

//受講ページの最初の画面のみ(page-mod-questionnaire-view)
if (bodyId === "page-mod-questionnaire-view")  {

  //////////////////////////////////////
  // 授業のメモシートのブロックを入れる
  //////////////////////////////////////
  
  // メモシートのURLを格納する変数を用意
  // 最初は空文字で初期化しておく
  let memosheet = "";

  // 現在表示している授業データ(currentViewCourseData)のキーに応じて
  // それぞれの専用メモシートURLを代入する
  if (currentViewCourseData?.key === "philosophy") {
    memosheet = memosheetPhilosophy; // 哲学用のメモシート
  } else if (currentViewCourseData?.key === "science") {
    memosheet = memosheetScience; // 科学用のメモシート
  } else if (currentViewCourseData?.key === "economy") {
    memosheet = memosheetEconomy; // 経済用のメモシート
  }

  // jQueryのDOM読み込み完了処理
  $(function() {
    // 授業ページに動画がある場合のみ処理を実行
    // （アーカイブ時には意味が薄いため表示しない）
    if ($('.course-lesson').length) {

      // 授業ページの「main」要素の手前にメモシートのUIを追加
      $('div[role="main"]').before(`
        <div class="mod-questionnaire-worksheet">
          <!-- アイコン表示 -->
          <div class="mod-questionnaire-worksheet-icon">
            <img src="https://waomirai.com/lp/assets/moodle/icn-worksheet-wao.svg">
          </div>

          <!-- 説明テキスト -->
          <div class="mod-questionnaire-worksheet-text">
            授業中の学びを記録できる印刷用シートです。<br>
            メモがわりにご利用いただけます。
          </div>

          <!-- ダウンロードリンク部分 -->
          <div class="mod-questionnaire-worksheet-download">
           
            <div class="mod-questionnaire-worksheet-download-text">
              <!-- ここでテンプレートリテラルを使って変数を埋め込む -->
              <a href="${memosheet}" target="_blank" class="mod-questionnaire-worksheet-download-text-link">メモシートをダウンロード</a>
            </div>
             <span class="material-symbols-outlined">download</span>
          </div>
        </div>
      `);
       // 授業ページの「main」要素の手前にメモシートのUIを追加
  
    }
  });


  // 「3週目」が存在する場合のみ処理を実行
  if (hasWeek3) {
    // <ol class="breadcrumb"> 内のすべての <li> 要素を順に処理
    $('ol.breadcrumb li').each(function() {
      const $li = $(this);
    
      // <li> 内のテキストに「レベル」という文字が含まれているかチェック
      if ($li.text().includes('レベル')) {
        const $link = $li.find('a');
        if ($link.length > 0) {
          levelLink = $link.attr('href');
        }
        return false; // 最初に見つかったら終了
      }
    });

    // 🔹 levelLink が取得できた場合のみ処理を実行
    if (levelLink) {
      $('.mod_questionnaire_viewpage .complete').after(`
        <div class="lesson-summary">
          <a href="${levelLink}" target="_blank" class="btn btn-primary">
            授業のまとめシート
          </a>
        </div>
      `);
    }
  }
  //提出ボタンをわかりやすくするためにcss装飾用のclassを追加
  $('.mod_questionnaire_flex-container .complete .btn-primary').addClass('send-answer');
  //最初の提出ボタンをわかりやすくするためにcss装飾用のclassを追加
  if ($('.mod_questionnaire_flex-container .complete .btn-primary').text().includes('課題を提出する')){
    $('.mod_questionnaire_flex-container .complete .btn-primary').addClass('send-answer-first');
  }
}

$(".open-modal-badge").click(function() {
  // 確認モーダルを作成
  createModal({
    wrapClass: "c-modal-wrap-badge",
    image: ImgModalBadge,
    close: true,  // モーダルを閉じるボタンを表示するオプション
    closetxt: "閉じる", // 閉じるボタンのテキスト
  });
});
