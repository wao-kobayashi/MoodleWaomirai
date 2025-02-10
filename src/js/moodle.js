// ==============================
// 各種変数
// ==============================

const UrlForm = "https://go.waomirai.com/changeform"; // フォームURL 
const UrlChangeSubject = "https://lms.waomirai.com/user/edit.php"; // 受講変更ページ  

// ==============================
// ページ判定とコースIDの取得
// ==============================

// body要素のIDを取得
// IDは現在のページを特定するために利用される。
// ページごとに一意のIDが付与されていることを前提。
const bodyId = $("body").attr("id");

// 現在のページで使用されているコースIDを取得する関数
// body要素のクラス属性に含まれる「course-数字」の形式からIDを抽出する。
function getCurrentCourseId() {
  const bodyClass = document.body.className; // body要素のクラス名（全体）を取得
  const match = bodyClass.match(/course-(\d+)/); // 正規表現で「course-数字」を検索
  // 検索結果が存在する場合は、数字部分を整数として返す
  // 存在しない場合はnullを返す。
  return match ? parseInt(match[1], 10) : null;
}

// 現在のページに関連するコースデータを取得
// 全ての科目データ(subjects)から、現在のコースIDと一致するデータを検索する。
const currentViewCourseData = subjects.find(
  (subject) => subject.id === getCurrentCourseId()
);

// コースデータが見つからない場合のエラーハンドリング
if (!currentViewCourseData) {
  // エラーが発生した場合、適切にログを出力する
  console.error("コースIDが見つかりませんでした。");
}

// body要素のクラスリストから、「course-id-」プレフィックスを持つクラスを解析
// 各クラスを数値に変換し、リスト化する。
const bodyClasses = $("body")
  .attr("class") // bodyのクラス属性を文字列として取得
  .split(" ") // 文字列をスペースで分割して配列化
  .map((cls) => parseInt(cls.replace("course-id-", "").trim())); // 各クラスから「course-id-」を除去して数値に変換



// ==============================
// グループチェック関数
// ==============================

// 特定の条件を満たす科目が現在のページに関連付けられているかを判定する汎用関数
// 条件はfilterFnで動的に指定可能。
function checkGroup(filterFn) {
  // 全科目データ(subjects)から、条件に一致する科目を抽出
  return subjects
    .filter(filterFn)
    // 抽出された科目のIDが、現在のページに関連付けられているか確認
    .some((subject) => bodyClasses.includes(subject.id));
}

// メイン科目（typeが"main"）に関連付けられているかを判定
// 条件は「typeが'main'」であること。
const hasBoughtMainSubject = checkGroup((subject) => subject.type === "main");

// 子科目（typeが"child"）に関連付けられているかを判定
// 条件は「typeが'child'」であること。
const hasBoughtChildSubject = checkGroup((subject) => subject.type === "child");

// adminグループに関連付けられているかを判定
 //受講者と管理者ユーザーで挙動を変えたい部分があるので、この講座を持っている人はadminの扱いにする。
    //この講座は表に出ないので一般ユーザーは絶対に受講できない講座
const hasBoughtAdminSubject= checkGroup((subject) => subject.key === "admin");

// ==============================
// 科目の特定レベルチェック関数
// ==============================

// 複数のメイン科目キーが、現在のページに関連付けられているか判定する関数
// subjectKeys: 判定対象となる科目のキー配列
// isAllRequired: trueの場合、全てのキーが一致する必要あり（AND条件）
// falseの場合、一つでも一致すればよい（OR条件）
function checkBoughtMainSubject(subjectKeys, isAllRequired = false) {
  const checkMethod = isAllRequired ? "every" : "some";
  
  // result に直接メソッドの結果を代入する
  return subjectKeys[checkMethod]((subjectKey) => {
    const subject = subjects.find((item) => item.key === subjectKey && item.type === "main");
    
    if (!subject) {
      return false;
    }
    
    return bodyClasses.includes(subject.id);
  });
}
// 特定の子科目キーとレベルが、現在のページに関連付けられているか判定する関数
// subjectKey: 判定対象の科目キー
// levels: 判定対象となるレベルの配列
function checkBoughtChildSubject(subjectKey, levels) {
  return subjects
    .filter(
      (subject) =>
        subject.type === "child" && // 子科目であること
        subject.key === subjectKey && // 科目キーが一致すること
        levels.includes(subject.level) // レベルが一致すること
    )
    .some((subject) => bodyClasses.includes(subject.id)); // bodyクラスに科目IDが含まれているか
}

// ==============================
// モーダルのコンポーネント
// ==============================

// 動的にモーダルを生成するための関数
// optionsオブジェクトでモーダルの見た目や動作をカスタマイズ可能
function createModal(options = {}) {
  var scrollPosition; // モーダル表示時のスクロール位置を保持するための変数

  // ボタンHTMLを生成するためのヘルパー関数
  const generateButtons = (buttons) => {
    if (!buttons || buttons.length === 0) return ""; // ボタンが指定されていない場合は空文字を返す
    return buttons
      .map(
        (button) =>
          `<a href="${button.url || "#"}" class="c-modal-wrap-button ${
            button.class || ""
          }">${button.text}</a>` // ボタンのHTMLを動的に生成
      )
      .join(""); // ボタンを連結して返す
  };

  // モーダル全体のHTML構造を動的に生成
  const modal = `
    <div class="c-modal">
      <div class="c-modal-wrap ${options.wrapClass || ""}">
        ${options.close ? '<div class="c-modal-wrap-close"></div>' : ""} <!-- 閉じるボタン -->
        ${
          options.title
            ? `<div class="c-modal-wrap-title">${options.title}</div>` // モーダルのタイトル
            : ""
        }
        ${
          options.text
            ? `<div class="c-modal-wrap-text">${options.text}</div>` // モーダルの本文
            : ""
        }
        ${
          options.image
            ? `<div class="c-modal-wrap-image">
                 <img src="${options.image}" alt="Modal Image" class="${options.imageClass || ""}" />
               </div>` // モーダルに表示する画像
            : ""
        }
          <div class="c-modal-wrap-button-wrap">
        ${generateButtons(options.buttons)} <!-- ボタンリストを動的に挿入 -->
          </div>
        ${
          options.closetxt
            ? `<div class="c-modal-wrap-closetxt">${options.closetxt}</div>` // モーダルに表示する画像
            : ""
        }
      </div>
    </div>
    <div class="c-modal-bg"></div>
  `;

  // モーダルをHTMLドキュメントに追加
  const $modal = $(modal).appendTo("body");

  // 現在のスクロール位置を記録し、ページを固定表示に変更
  scrollPosition = $(window).scrollTop();
  $("body").addClass("fixed").css({ top: -scrollPosition });

  // 閉じるボタンをクリックした場合の処理
  $(".c-modal-wrap-close,.c-modal-wrap-closetxt").on("click", function () {
    $modal.remove(); // モーダルを削除
    $("body").removeClass("fixed").css({ top: 0 }); // ページをスクロール可能に戻す
    window.scrollTo(0, scrollPosition); // スクロール位置を復元
  });

  // モーダル背景をクリックした場合の処理
  $(".c-modal-bg").on("click", function () {
    if (options.close) {
      $modal.remove(); // モーダルを削除
      $("body").removeClass("fixed").css({ top: 0 }); // ページをスクロール可能に戻す
      window.scrollTo(0, scrollPosition); // スクロール位置を復元
    }
  });
}

// ==============================
// ダッシュボードページでの処理
// ==============================
if (bodyId === "page-my-index") {

  /////////////////////////////////////
  ///初期表示状態
  ////////////////////////////////////

  //科目を何も持っていない時の場合の処理
  if (!hasBoughtMainSubject && !hasBoughtChildSubject) {
    // 今日のイベント科目とダッシュボードの未定義科目を表示
    $("#todays-event-subject-none,#dashboard-main-upcoming-class-none").show();
    // 今日の科目PCビューを非表示
    $("#todays-subject-pc").hide();
  } else {
    // ウィンドウの幅が768px以上の場合、メインの授業部分を非表示
    if ($(window).width() >= 768) {
      $(".dashboard-main-class").hide();
    }
  }
  //////////////////////////
  // 現在受講中の科目処理
  //////////////////////////

  /**
   * 科目情報をHTML要素としてレンダリングする関数
   * param {Object} subject - 科目のオブジェクト (id, name, key などを含む)
   * param {string} icon - 科目を表すアイコン文字列
   * param {boolean} hasBoughtMainSubject - メイン科目を購入済みかどうか
   * returns {string} 科目のHTMLマークアップ
   */
  function renderDisplaySubject(subject, icon, hasBoughtMainSubject) {
      // メイン科目とサブ科目でURLを切り替え
      // メイン科目の場合は管理画面へ、サブ科目の場合はコース画面へ遷移
      const courseLink = hasBoughtMainSubject
          ? `https://lms.waomirai.com/admin/tool/catalogue/courseinfo.php?id=${subject.id}`
          : `https://lms.waomirai.com/course/view.php?id=${subject.id}`;

      // 科目ごとのリンク要素を生成
      // dashboard-left-block-subject-childクラスと科目固有のキーを持つ
      return `
          <a href="${courseLink}" class="dashboard-left-block-subject-child ${subject.key}">
              <div class="dashboard-left-block-subject-child-icon">${icon}</div>
              <div class="dashboard-left-block-subject-child-text">
                  <div>${subject.name}</div>
              </div>
          </a>
      `;
  }

  /**
   * 科目名に基づいて適切なアイコンを返す関数
   * param {Object} subject - 科目情報オブジェクト
   * returns {string} 科目に対応するUnicodeアイコン
   */
  const getSubjectIcon = (subject) => {
      // 科目名に特定のキーワードが含まれる場合、対応するアイコンを返す
      if (subject.name.includes("哲学")) return "&#x1f4D6;"; // 本のアイコン
      if (subject.name.includes("科学")) return "&#x1f52C;"; // 顕微鏡のアイコン
      if (subject.name.includes("経済")) return "&#x1f4B0;"; // お金のアイコン
      if (subject.name.includes("英語")) return "&#x1f4AC;"; // 吹き出しのアイコン
      if (subject.name.includes("プログラミング"))
          return "&#x1f468;&#x200D;&#x1f4BB;"; // プログラマーのアイコン
      return "&#x1f9ea;"; // デフォルトは試験管のアイコン
  };

  /**
   * メイン科目の表示処理を行う関数
   * サブ科目を持たないメイン科目のみを表示する
   */
  function displayMainSubjectStatus() {
      console.log("メイン科目（SubjectMain）の処理を開始");

      // メイン科目の表示用HTML生成
      const subjectMainNames = subjects
          .filter((subject) => subject.type === "main") // メイン科目のみ抽出
          .filter((subject) => {
              // サブ科目の存在チェック
              const hasSubjectChild = subjects.some(
                  (childSubject) =>
                      childSubject.type === "child" &&
                      childSubject.parentKey === subject.key &&
                      bodyClasses.includes(childSubject.id)
              );

              console.log(`科目チェック: ${subject.name}, サブ科目あり: ${hasSubjectChild}`);

              // サブ科目がある場合はスキップ
              if (hasSubjectChild) {
                  console.log(`${subject.name}はサブ科目があるためスキップ`);
                  return false;
              }

              // 表示対象（bodyClasses）に含まれているか確認
              const isIncluded = bodyClasses.includes(subject.id);
              console.log(
                  `${subject.name}の表示確認: ${isIncluded ? "表示" : "非表示"}`
              );
              return isIncluded;
          })
          .map((subject) => renderDisplaySubject(subject, getSubjectIcon(subject), true))
          .join("");

      // 生成したHTML要素を追加
      if (subjectMainNames) {
          $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(
              subjectMainNames
          );
      }
  }

  /**
   * サブ科目の表示処理を行う関数
   * bodyClassesに含まれるサブ科目のみを表示する
   */
  function displayChildSubjectStatus() {
      console.log("サブ科目（SubjectChild）の処理を開始");

      // サブ科目の表示用HTML生成
      const subjectChildNames = subjects
          .filter((subject) => subject.type === "child") // サブ科目のみ抽出
          .filter((subject) => bodyClasses.includes(subject.id)) // 表示対象のみ抽出
          .map((subject) => renderDisplaySubject(subject, getSubjectIcon(subject), false))
          .join("");

      // 生成したHTML要素を追加
      if (subjectChildNames) {
          $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(
              subjectChildNames
          );
      }
  }

  // 科目の購入状態に応じて表示処理を実行
  if (hasBoughtMainSubject) {
    displayMainSubjectStatus(); // メイン科目の処理
  }

  if (hasBoughtChildSubject) {
    displayChildSubjectStatus(); // サブ科目の処理
  }

  // エラーハンドリング：どの科目も購入していない場合
  if (!hasBoughtMainSubject && !hasBoughtChildSubject) {      
      // エラーメッセージの表示
      const errorHtml = `
          <div class="dashboard-left-block-subject-child">
              <p>受講している科目がありません。</p>
          </div>
      `;
      $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").html(errorHtml);
  }

  // スマートフォン表示用の処理
  // dashboard-leftの内容をクローンしてスマートフォン用に表示
  var contentToCloneDashboardLeft = $(".dashboard-left").clone();

  // スマートフォン用のラッパー要素を作成
  var wrappedContent = $("<div>", {
      id: "dashboard-sp-content",
      class: "c-pc-hidden", // PCでは非表示
  }).append(contentToCloneDashboardLeft);

  // page-contentの直下に配置
  $("#page-content").append(wrappedContent);


  /////////////////////////////////////
  /// カレンダー処理
  /////////////////////////////////////

  // ===============================================
  // 授業イベントの表示機能
  // ===============================================
  function updateClassSchedule() {

    // -----------------------------------------------
    // 基本となる日付情報の初期化
    // -----------------------------------------------
    const today = new Date();                    // 現在の日時を取得
    const todayDay = today.getDate();           // 日付部分のみを抽出（1-31）
    const todayMonth = today.getMonth() + 1;    // 月を取得（JavaScriptは0-11なので+1する）
    const todayYear = today.getFullYear();      // 年を取得（例：2024）
    
    // -----------------------------------------------
    // イベント管理用の変数初期化
    // -----------------------------------------------
    let eventFound = false;     // フラグ: true = 今日の授業あり, false = なし
    let eventDetails = [];      // 配列: 今日の授業名を全て格納

    // -----------------------------------------------
    // カレンダーの各日付セルを処理
    // -----------------------------------------------

    // カレンダーの各日付セルを処理
    $(".day").each(function () {
        // セルの基本情報を取得
        const $cell = $(this);  // 現在処理中のカレンダーセル要素
        
        // data-*属性から日付情報を取得（文字列から数値に変換）
        const cellDay = parseInt($cell.attr("data-day"), 10);    // その日の日付
        const cellMonth = parseInt($cell.attr("data-month"), 10); // その日の月
        const cellYear = parseInt($cell.attr("data-year"), 10);   // その日の年

        // -----------------------------------------------
        // 【スマホ限定】本日の授業を処理
        // -----------------------------------------------
        // 今日の日付の場合の処理
        if (cellDay === todayDay) {
            console.log("今日の日付に一致:", { cellDay, cellMonth, cellYear });

            // イベント情報を含む要素を検索
            const $dayContent = $cell.find('[data-region="day-content"]');
            
            // イベントが存在する場合の処理
            if ($dayContent.length > 0) {
                // イベントリンクを全て取得
                const $events = $dayContent.find('li a[data-action="view-event"]');
                
                // 各イベント（授業）の処理
                $events.each(function () {
                    // 授業名を取得（前後の空白を除去）
                    var courseName = $(this).text().trim();
                    eventDetails.push(courseName);  // 授業名を配列に追加
                    console.log("今日の授業を検出: " + courseName);

                    // ダッシュボード表示用の要素を作成
                    // メインコンテナ
                    var $lessonContainer = $("<div>", { 
                        class: "dashboard-main-class-content-lesson" 
                    });
                    
                    // 授業タイトル要素
                    var $lessonTitle = $("<div>", { 
                        class: "dashboard-main-class-content-lesson-title", 
                        text: courseName 
                    });
                    
                    // 参加ボタン要素
                    var $lessonLink = $("<a>", {
                        class: "dashboard-main-class-content-lesson-button",
                        href: $(this).attr("href"),  // 元のリンクのURLを保持
                        text: "授業に参加する"
                    });

                    // 作成した要素をダッシュボードに追加（先頭に配置）
                    $lessonContainer
                        .append($lessonTitle)    // タイトルを追加
                        .append($lessonLink);    // ボタンを追加
                    $("#todays-event-class-scheduled").prepend($lessonContainer);
                });
                eventFound = true;  // 今日の授業が見つかったことを記録
            }
        }

        // -----------------------------------------------
        //  【スマホ限定】今月中に開催される授業
        // -----------------------------------------------
        // 今日よりも後の日付の場合の処理
        if (cellDay > todayDay) {
          const $dayContent = $cell.find('[data-region="day-content"]');
          console.log("$dayContent:", $dayContent); // 取得したdayContentを確認
          //授業ある時の処理
          if ($dayContent.length > 0) {
            const $events = $dayContent.find('li a[data-action="view-event"]');
            console.log("$events:", $events); // 取得したeventsを確認
  
            $events.each(function () {
              // 授業名を取得（前後の空白を除去）
              var courseName = $(this).text().trim();
  
              // 科目カテゴリを判別する関数(色付してわかりやすくするため)
              const getSubjectCategory = (courseName) => {
                if (courseName.includes("哲学")) return "philosophy";
                if (courseName.includes("科学")) return "science";
                if (courseName.includes("経済")) return "economy";
                if (courseName.includes("英語")) return "english";
                if (courseName.includes("プログラミング")) return "programming";
                return "defalut-subject"; // デフォルト: 試験管
              };
  
              // 使用例：科目カテゴリを取得
              const getSubjectCategoryValue = getSubjectCategory(courseName);
  
              // 今日の日付を取得
              const today = new Date();
              const currentMonth = today.getMonth() + 1;
              const todayDay = today.getDate();
              const todayYear = today.getFullYear();
  
              // イベントの日付を作成
              const eventDate = new Date(todayYear, currentMonth - 1, cellDay); // 月は0から始まるので、cellMonth - 1にする
  
              // 日付を「12/27(金)」の形式でフォーマット
              const dateString = `${currentMonth}/${cellDay}`;
              const Week = ["(日)", "(月)", "(火)", "(水)", "(木)", "(金)", "(土)"];
              const dayOfWeek = Week[eventDate.getDay()]; // 曜日を取得
              console.log(dayOfWeek); // 曜日を表示
  
              // 新しいdivを作成
              var $lessonContainer = $("<div>", {
                class: "dashboard-main-class-content-lesson " + getSubjectCategoryValue,
              });
              var $lessonTitleAndDate = $("<span>", {
                class: "dashboard-main-class-content-lesson-details",
              })
                .append($("<span>", { class: "date", text: dateString + dayOfWeek }))
                .append($("<span>", { class: "title", text: courseName }));
              $lessonContainer.append($lessonTitleAndDate);
  
              // 【スマホ】今月中に開催される授業に追加
              $("#dashboard-main-upcoming-class-scheduled").append($lessonContainer);
            });
          }
        }
    });

    // -----------------------------------------------
    // ダッシュボードメッセージの設定
    // -----------------------------------------------
    // デフォルトメッセージを設定
    let message = "本日は授業はありません。";

    if (eventFound) {
        // 今日の授業がある場合
        // 全ての授業名を「」で囲んで結合
        message = `本日は、「${eventDetails.join("」「")}」の授業があります。`;
       
        console.log("メッセージを更新：授業あり");
    } else {
        // 今日の授業がない場合
        console.log("メッセージを更新：授業なし");
        
        // 科目の購入状況に応じて適切なメッセージを表示
        if (hasBoughtMainSubject || hasBoughtChildSubject) {
            // いずれかの科目を購入済み
            $("#todays-event-class-none").show();
        } 
  
    }
    // メッセージをダッシュボードに反映
    $("#todays-subject-pc .c-alert-banner-text-title").text(message);
  }

  // ===============================================
  // カレンダー表示色設定機能
  // 目的：科目ごとに異なる色でカレンダー上に表示する
  // ===============================================
  function calendarScheduleColorChange() {
    console.log("カレンダー色設定を開始");

    // カレンダーの各日付セルを処理
    $(".day").each(function () {
        // イベント情報を含む要素を検索
        const $dayContent = $cell.find('[data-region="day-content"]');
        
        // イベントが存在する場合の処理
        if ($dayContent.length > 0) {
            // イベントリンクを全て取得
            const $events = $dayContent.find('li a[data-action="view-event"]');
            
            // 各イベントの色設定
            $events.each(function () {
                const $eventLink = $(this);
                const courseName = $eventLink.text().trim();
                console.log(`科目名を検出: ${courseName}`);

                // 科目名に応じて色とボーダーを設定
                // !important付きのスタイルで優先度を最大に
                if (courseName.includes("経済")) {
                    console.log("経済科目を検出");
                    $eventLink.attr("style", 
                        "background: #AA68AA !important;" + 
                        "border-left: #008EC9 2px solid !important;");
                } else if (courseName.includes("科学")) {
                    console.log("科学科目を検出");
                    $eventLink.attr("style", 
                        "background: #B6D43E !important;" + 
                        "border-left: #96B128 2px solid !important;");
                } else if (courseName.includes("哲学")) {
                    console.log("哲学科目を検出");
                    $eventLink.attr("style", 
                        "background: #FCB72E !important;" + 
                        "border-left: #E98800 2px solid !important;");
                } else if (courseName.includes("英語")) {
                    console.log("英語科目を検出");
                    $eventLink.attr("style", 
                        "background: #AA68AA !important;" + 
                        "border-left: #8D3A8D 2px solid !important;");
                } else {
                    console.log("未定義の科目を検出: ", courseName);
                }
            });
        }
    });
  }

  // ===============================================
  // イベントハンドラの設定
  // ===============================================
  // ページ読み込み完了時の処理
  $(document).ready(function () {
    updateClassSchedule();  // 授業スケジュールの更新
  });

  // カレンダー月切り替え時の処理
  $(document).on("click", ".arrow_link", function () {
    // 0.3秒の遅延後に色設定を実行（DOMの更新を待つ）
    setTimeout(() => {
        calendarScheduleColorChange(); // カレンダー色設定を実行
    }, 300);
  });
  }

// ==============================
// ログイン・サインアップページの処理
// ==============================
if (bodyId === "page-login-signup" || bodyId === "page-login-forgot_password") {
  // ログインページのタイトルを「新規会員登録」に変更
  $(".login-heading").text("新規会員登録");

  // フォームの各入力フィールドにプレースホルダーを設定
  const placeholders = {
    id_username: "例）waomirai", // ユーザー名のプレースホルダー
    id_email: "例）sample@gmail.com", // メールアドレスのプレースホルダー
    id_email2: "例）sample@gmail.com", // メールアドレス確認のプレースホルダー
    id_lastname: "例）鈴木", // 姓のプレースホルダー
    id_firstname: "例）太郎", // 名のプレースホルダー
    id_profile_field_furigana: "例）スズキタロウ", // フリガナのプレースホルダー
    id_profile_field_postnumber: "例）0000000", // 郵便番号のプレースホルダー
  };

  // 各入力フィールドにプレースホルダーを設定
  $.each(placeholders, function (id, placeholder) {
    $("#" + id).attr("placeholder", placeholder);
  });

  // パスワードポリシーの説明をパスワードラベルの下に移動
  const $sourceElement = $("#fitem_id_passwordpolicyinfo .form-control-static");
  const $targetParent = $("label#id_password_label");
  if ($sourceElement.length && $targetParent.length) {
    $targetParent.append($sourceElement);
  }

  // アイコン（!）を "*" に置き換え
  $(".fa-exclamation-circle").each(function () {
    $(this).replaceWith("*");
  });

  // ログインラッパーの前にロゴを挿入
  const $loginWrapper = $("#page-login-signup .login-wrapper");
  if ($loginWrapper.length) {
    const signupLogoHtml = `
                <div class="signup-logo">
                    <img src="https://go.waomirai.com/l/1026513/2023-11-16/gddzt/1026513/1700192228BDlbz92f/logo_basic_white.png" style="width: 100%;">
                </div>`;
    $loginWrapper.before(signupLogoHtml);
  }
}

// ログインインデックスページの処理
if (bodyId === "page-login-index") {
  // 「ブラウザのクッキーを」含むテキストを持つ要素を非表示にする
  const cookiekeywords = ["ブラウザのクッキーを"];

  cookiekeywords.forEach((keyword) => {
    $("*:contains('" + keyword + "')")
      .filter(function () {
        return $(this).children().length === 0; // 子要素を持たないテキストノードだけ対象
      })
      .closest("div")
      .css("display", "none");
  });

  // 「Moodle」または「Powered by」を含むテキストを持つ要素を非表示にする
  const moodlekeywords = ["Moodle", "Powered by"];

  moodlekeywords.forEach((keyword) => {
    $("*:contains('" + keyword + "')")
      .filter(function () {
        return $(this).children().length === 0; // 子要素を持たないテキストノードだけ対象
      })
      .closest("*")
      .css("display", "none");
  });
}

// ==============================
// ログイン確認ページの処理
// ==============================
if (bodyId === "page-login-confirm") {
  $(".boxaligncenter h3").text("ご登録ありがとうございます。");
  $(".singlebutton button").text("ワオ未来塾TOPへ");
}

// ==============================
// 購入処理：ページ内の購入ボタンやセット割引の表示、購入関連のモーダル処理
// ==============================
if (bodyId === "page-enrol-index") {
  
    const subjectCategory = currentViewCourseData.key;  // 現在選択されている科目カテゴリーを取得
    
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

    // 各カテゴリー（哲学、科学、経済）の購入ボタンがクリックされたときの処理
    $(".enrol_fee_payment_region button").on("click", function (event) {
  
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

// ==============================
// 受講ページの表示ロジック
// ==============================
if (bodyId === "page-mod-questionnaire-view") {

  // スマートフォン版で、ページタイトルを動画の下に表示するためのロジック

  // ページヘッダー（#page-header）を複製して、スマホ用のコンテンツを作成
  var contentToCloneDashboardLeft = $("#page-header").clone();

  // 複製したコンテンツをラップするためのdiv要素を作成
  var wrappedContent = $("<div>", {
    id: "sp-page-header",   // 新しいdivにIDを設定（スマホ版のページヘッダー）
    class: "c-pc-hidden",   // デスクトップ版では非表示にするためのクラス（PC版では隠す）
  }).append(contentToCloneDashboardLeft);  // 複製したヘッダーを新しいdivに追加

  // スマホ版のヘッダーを#page-contentの直下に配置（コンテンツの一部として追加）
  $(".activity-description").append(wrappedContent);

  // 課題提出セクションの下にリード文を挿入
  // 「授業の視聴が終わったら課題を提出しましょう」という文を、h2タグの後に追加
  $(".mod_questionnaire_viewpage h2").after(
    "<p>授業の視聴が終わったら課題を提出しましょう</p>"
  );
}


// // ==============================
// // カテゴリページの処理
// // ==============================
if (bodyId === "page-course-index-category") {
  window.location.href = "https://lms.waomirai.com/";
}

// ==============================
// メイン3科目または2科目、3科目パック購入後のリダイレクト処理
// ==============================
if (bodyId === "page-course-view-flexsections") { // ページIDが「page-course-view-flexsections」の場合に処理を開始

  //管理者ではない時に発火
  //管理者で発火させないようのはリダイレクト防止、受講科目ダイアログが出るとページ編集ができないため
  if (!hasBoughtAdminSubject) {
    // 対象となる科目のリスト
    const targetSubjects = [
      "philosophy",    // 哲学
      "science",       // 科学
      "economy",       // 経済
      "globalenglish", // グローバル英語
      "twosubjectpack", // 2科目パック
      "threesubjectpack", // 3科目パック
    ];

    // 各対象科目に対して繰り返し処理を実施
    targetSubjects.forEach((key) => {
    
      // 現在表示されている科目がtargetSubjectsリストにあるかつ、タイプが「main」の場合
      if (
        currentViewCourseData.key === key && // 現在の科目のkeyが対象のkeyと一致するか
        currentViewCourseData.type === "main" // 現在の科目のタイプが「main」であるか
      ) {
        console.log(`currentViewCourseDataはmainタイプの${key}です`); // 現在の科目が「main」タイプであることを確認

        // 2科目パックまたは3科目パックの場合は、「child」判定をスキップ
        if (key === "twosubjectpack" || key === "threesubjectpack") {
          console.log(`${key}はchild判定をスキップします。`); // パックの場合、子科目判定をスキップ
          createModal({
            // モーダルを表示して、ユーザーに「レベル設定」を促す
            image: "https://go.waomirai.com/l/1026513/2025-01-27/hcs2k/1026513/1737961533tHzVY8az/img_modal_subject.png", // モーダルに表示する画像
            imageClass: "c-modal-wrap-subject-img", // 画像にクラスを付与
            wrapClass: "c-modal-wrap-subject", // モーダルのラップにクラスを付与
            buttons: [
              { text: "科目のレベルを設定する", url:UrlChangeSubject, class: "btn-primary" }, // ボタンにテキストとリンクを設定
            ]
          })
          return; // child判定をスキップして次の科目の処理に進む

        }

        // bodyClasses（ページのクラス名）に対応する「child」タイプの科目があるか確認
        const hasSubjectChild = bodyClasses.some((courseId) => {
          // bodyClassesに含まれる各courseIdに対して、対応する「child」タイプの科目をsubjectsから検索
          return subjects.some(
            (subject) =>
              subject.id === courseId && // courseIdとsubject.idが一致
              subject.key === key && // keyが一致
              subject.type === "child" // typeが「child」であることを確認
          );
        });

        if (hasSubjectChild) {
          console.log(`${key}のchildタイプが存在します`); // childタイプが存在する場合

          // 「child」タイプが見つかった場合、リダイレクト処理
          const childCourse = subjects.find(
            (subject) =>
              subject.key === key && // keyが一致
              subject.type === "child" && // typeが「child」であることを確認
              bodyClasses.includes(subject.id) // bodyClassesに対応するIDが含まれていることを確認
          );

          if (childCourse) {
            // リダイレクト先のURLを作成
            const redirectUrl = `https://lms.waomirai.com/course/view.php?id=${childCourse.id}`;
            console.log(`リダイレクト: ${redirectUrl}`); // リダイレクト先URLをログに出力
            window.location.href = redirectUrl; // ユーザーを指定したURLにリダイレクト
          }
        } else {
          // 「child」タイプが存在しない場合の処理
          createModal({
            // モーダルを表示して、ユーザーに「レベル設定」を促す
            image: "https://go.waomirai.com/l/1026513/2025-01-27/hcs2k/1026513/1737961533tHzVY8az/img_modal_subject.png", // モーダルに表示する画像
            imageClass: "c-modal-wrap-subject-img", // 画像にクラスを付与
            wrapClass: "c-modal-wrap-subject", // モーダルのラップにクラスを付与
            buttons: [
              { text: "科目のレベルを設定する", url: UrlChangeSubject, class: "btn-primary" }, // ボタンにテキストとリンクを設定
            ]
          })
          console.log(`${key}のchildタイプは存在しません`); // childタイプが見つからなかったことをログに出力
          // 「child」タイプが見つからない場合、モーダルを表示して処理を終了
        }
      } else {
        // 「main」タイプでない場合の処理
        console.log(`currentViewCourseDataはmainタイプの${key}ではありません`); // 現在の科目が「main」タイプではないことをログに出力
      }
    });
}
}

// ==============================
// マイページの処理
// ==============================
if (bodyId === "page-user-edit") { // ページIDが「page-user-edit」の場合に処理を実行
  // 各科目の入力エリアを取得
  var AreaPhilosophy = $("#fitem_id_profile_field_Philosophy_Level"); // 哲学の入力エリア
  var AreaScience = $("#fitem_id_profile_field_Science_Level"); // 科学の入力エリア
  var AreaEconomy = $("#fitem_id_profile_field_Economy_Level"); // 経済の入力エリア
  var AreaEnglish = $("#fitem_id_profile_field_English_Level"); // 英語の入力エリア
  var AreaSingleCourse = $("#fitem_id_profile_field_1cource_Subject"); // １科目受講の入力エリア
  var AreaTwoCourse = $("#fitem_id_profile_field_2cources_subject"); // ２科目受講の入力エリア

  // 各科目のエリアを配列にまとめて、後で一括で非表示にする
  var AreaElements = [
    AreaPhilosophy,
    AreaScience,
    AreaEconomy,
    AreaEnglish,
    AreaSingleCourse,
    AreaTwoCourse,
  ];
  // 配列内の各エリアを非表示にする
  AreaElements.forEach(function (AreaElement) {
    AreaElement.hide();
  });

  // 初回受講レベル登録時、submit直前に注意文言を表示する関数
  function AlertSubjectSettingFirst() {
    $("#fgroup_id_buttonar").before(
      `<div id="id_submitbutton-subject">一度受講レベルを設定すると、2回目以降のレベル変更時の反映は当月末になりますのでご注意くださいませ。</div>`
    );
  }

  // サブレベル（子科目）の自動取得を行う関数
  function getOwnedSubLevels(subjectKey, levels) {
    // subjects 配列から、指定された科目キーとレベルに一致する子科目を抽出
    return subjects
      .filter(
        (subject) =>
          subject.type === "child" && // 子科目を対象
          subject.key === subjectKey && // 指定された科目キーに一致
          levels.includes(subject.level) && // 指定されたレベルの中に該当する
          bodyClasses.includes(subject.id) // 現在のページに関連付けられた科目IDか確認
      )
      .map((subject) => subject.level); // 該当するレベルを配列で返す
  }

  // 1科目選択のセレクトボックスを取得する関数
  function getSelectElement(Area) {
    return Area.find("select"); // 引数で渡されたエリア内のselect要素を取得
  }

  // 2科目以上選択する場合の処理（必要な場合、変更を監視）
  function handleMultipleSelectChange(selectors, callback) {
    var selectedIndexes = []; // インデックスを格納する配列

    // 各select要素から選択されたインデックスを取得して配列に格納
    $(selectors).each(function () {
      var selectedIndex = $(this).prop("selectedIndex");
      selectedIndexes.push(selectedIndex);
    });

    // コールバック関数に選ばれたインデックスを渡して実行
    callback(selectedIndexes);

    // 各select要素にchangeイベントを再設定（選択肢が変更された時にインデックスを更新）
    $(selectors).on("change", function () {
      selectedIndexes = []; // インデックス配列を初期化

      // 再度インデックスを取得し、配列に格納
      $(selectors).each(function () {
        var selectedIndex = $(this).prop("selectedIndex");
        selectedIndexes.push(selectedIndex);
      });

      // コールバック関数に更新されたインデックスを渡して実行
      callback(selectedIndexes);
    });
  }

  // 【1科目受講】のケース

  // 1科目「哲学」のみ購入した場合
  if (
    checkBoughtMainSubject(["philosophy"]) && // 購入した主科目が「哲学」か確認
    !checkBoughtMainSubject(["science", "economy"]) // 購入した主科目が「科学」や「経済」でないことを確認
  ) {
    AreaPhilosophy.show(); // 哲学の入力エリアを表示
    // 初回受講レベル登録時、注意文言を表示
    if (!checkBoughtChildSubject("philosophy", ["L1", "L2", "L3", "L4"])) {
      AlertSubjectSettingFirst(); // 初回レベル設定の警告
    }
  }

  // 1科目「科学」のみ購入した場合
  if (
    checkBoughtMainSubject(["science"]) && // 購入した主科目が「科学」か確認
    !checkBoughtMainSubject(["philosophy", "economy"]) // 購入した主科目が「哲学」や「経済」でないことを確認
  ) {
    AreaScience.show(); // 科学の入力エリアを表示
    // 初回受講レベル登録時、注意文言を表示
    if (!checkBoughtChildSubject("science", ["L1", "L2", "L3", "L4"])) {
      AlertSubjectSettingFirst(); // 初回レベル設定の警告
    }
  }

  // 1科目「経済」のみ購入した場合
  if (
    checkBoughtMainSubject(["economy"]) && // 購入した主科目が「経済」か確認
    !checkBoughtMainSubject(["philosophy", "science"]) // 購入した主科目が「哲学」や「科学」でないことを確認
  ) {
    AreaEconomy.show(); // 経済の入力エリアを表示
    // 初回受講レベル登録時、注意文言を表示
    if (!checkBoughtChildSubject("economy", ["L1", "L2", "L3", "L4"])) {
      AlertSubjectSettingFirst(); // 初回レベル設定の警告
    }
  }

  // 英語購入の場合
  if (checkBoughtMainSubject(["globalenglish"])) { // 購入した主科目が「英語」か確認
    AreaEnglish.show(); // 英語の入力エリアを表示
    // 初回受講レベル登録時、注意文言を表示
    if (!checkBoughtChildSubject("globalenglish", ["L1", "L2"])) {
      AlertSubjectSettingFirst(); // 初回レベル設定の警告
    }
  }

  // 【2科目セット購入】の場合
  if (checkBoughtMainSubject(["twosubjectpack"], true)) { // 2科目セットを購入している場合
    AreaTwoCourse.show(); // 2科目選択のプルダウンを表示

    // プルダウン変更時に呼ばれる関数
    function updateAreaOnSelection() {
      var selectedIndex = getSelectElement(AreaTwoCourse).prop("selectedIndex"); // 選択されたインデックスを取得

      // 2科目の選択に応じて表示する科目エリアを更新
      switch (selectedIndex) {
        case 1: // 哲学 + 科学
          AreaPhilosophy.show();
          AreaScience.show();
          AreaEconomy.hide();
          break;

        case 2: // 科学 + 経済
          AreaPhilosophy.show();
          AreaScience.hide();
          AreaEconomy.show();
          break;

        case 3: // 科学 + 経済（逆の場合）
          AreaPhilosophy.hide();
          AreaScience.show();
          AreaEconomy.show();
          break;
        default: // それ以外の選択肢
          AreaPhilosophy.hide();
          AreaScience.hide();
          AreaEconomy.hide();
      }
    }

    // ページロード時に実行
    updateAreaOnSelection();

    // プルダウン変更時に再度実行
    getSelectElement(AreaTwoCourse).on("change", updateAreaOnSelection);

    // 初回受講レベル登録時、注意文言を表示
    if (
      !checkBoughtChildSubject("economy", ["L1", "L2", "L3", "L4"]) &&
      !checkBoughtChildSubject("philosophy", ["L1", "L2", "L3", "L4"]) &&
      !checkBoughtChildSubject("science", ["L1", "L2", "L3", "L4"])
    ) {
      getSelectElement(AreaTwoCourse).after(
        "<div class='subject-select-levelnotset'>科目を選択してください</div>"
      );
      AlertSubjectSettingFirst(); // 初回レベル設定の警告
    }
  }

  // 【3科目セット購入】の場合
  if (checkBoughtMainSubject(["threesubjectpack"], true)) { // 3科目セットを購入している場合
    AreaPhilosophy.show(); // 哲学を表示
    AreaScience.show(); // 科学を表示
    AreaEconomy.show(); // 経済を表示
    // 初回受講レベル登録時、注意文言を表示
    if (
      !checkBoughtChildSubject("economy", ["L1", "L2", "L3", "L4"]) &&
      !checkBoughtChildSubject("philosophy", ["L1", "L2", "L3", "L4"]) &&
      !checkBoughtChildSubject("science", ["L1", "L2", "L3", "L4"])
    ) {
      AlertSubjectSettingFirst(); // 初回レベル設定の警告
    }
  }

  // 各科目の設定を配列で定義
  const subjectConfigs = [
    {
      subject: "philosophy",
      area: AreaPhilosophy,
      levels: ["L1", "L2", "L3", "L4"],
    },
    {
      subject: "science",
      area: AreaScience,
      levels: ["L1", "L2", "L3", "L4"],
    },
    {
      subject: "economy",
      area: AreaEconomy,
      levels: ["L1", "L2", "L3", "L4"],
    },
    {
      subject: "globalenglish",
      area: AreaEnglish,
      levels: ["L1", "L2"],
    },
  ];

  // メッセージを表示するための定義
  const messages = {
    levelSet: (ownedLevels) =>
      `<div class="subject-select-levelset">
         現在受講中のレベルは ${ownedLevels}です<br>
         レベルの変更は月末反映となります。即時反映されませんのでご注意ください。
       </div>`,
    levelNotSet:
      '<div class="subject-select-levelnotset">受講レベルを設定してください。</div>',
  };

  // 各科目の設定を一括で処理
  subjectConfigs.forEach(({ subject, area, levels }) => {
    const ownedLevels = getOwnedSubLevels(subject, levels); // 所有しているレベルを取得

    const message =
      ownedLevels.length > 0
        ? messages.levelSet(ownedLevels) // 所有しているレベルがあればレベル設定メッセージを表示
        : messages.levelNotSet; // レベルが設定されていなければレベル設定を促すメッセージ

    getSelectElement(area).after(message); // エリアの後にメッセージを追加
  });

  // 最後に、全ての科目に関して注意メッセージを表示
  $("#id_category_10 > .d-flex").after(`
        <p class="subject-level-note">
          受講科目のレベルを選択してください。<br />
          選択した科目のレベルを設定しないと授業を受けることができません。<br />
         一度受講レベルを設定すると、2回目以降のレベル変更時の反映は当月末になりますのでご注意ください。
        </p>
    `);

    
}


// ==============================
// カテゴリページの処理
// ==============================
if (bodyId === "page-user-profile") {
    
    // $('.alert-success').html('変更が保存されました。科目レベルを設定した場合、<a href="https://lms.waomirai.com/my/">受講カレンダー</a>で確認ができます');  

    
    // 非表示にしたいキーワードの配列（OR条件）
    const hideKeywords = ['ログイン活動', 'レポート', 'ジョブ'];

    // すべてのsectionに対してループ処理
    $('.card').each(function() {
        // 現在のセクション内のh3テキストを取得
        // alert('a');
        const h3Text = $(this).find('h3.lead').text();
        console.log(h3Text);
        // キーワードのいずれかが含まれているかチェック（OR条件）
        const shouldHide = hideKeywords.some(keyword => h3Text.includes(keyword));

        // キーワードが含まれていたら、そのセクション全体を非表示にする
        if (shouldHide) {
          this.setAttribute("style", "display: none !important;");
        }
    });

}


// ==============================
// 汎用的な関数
// ==============================


// classを指定してスクロールできるように
$(".click-event-subject-comingsoon").on("click", function (e) {
  e.preventDefault(); // デフォルトの動作を防ぐ
  // モーダルを表示：セット購入の詳細情報
  createModal({
    close: true,  // モーダルを閉じるボタンを表示
    title: "この科目は2025年4月に開講予定です", // モーダルのタイトル
    closetxt: "閉じる", // 閉じるボタンのテキスト
  });
});


// classを指定してスクロールできるように
$(".scroll-to").on("click", function (e) {
  e.preventDefault(); // デフォルトの動作を防ぐ
  var targetClass = $(this).data("target"); // data-target属性からターゲットのクラスを取得
  var $target = $(targetClass); // ターゲット要素を取得

  if ($target.length) {
    // ターゲットが存在する場合のみ実行
    $("html, body").animate(
      {
        scrollTop: $target.offset().top, // ターゲット要素の位置にスクロール
      },
      0 // スクロール速度 (ミリ秒)
    );
  }
});


// 年間スケジュールのタブ切り替え
$('.tab-level-1').addClass('active');
$('.content-level1').show();

$('.enrol-section-basesubject-year-lesson-tab-child').click(function() {
  var level = $(this).index() + 1;
  
  // タブのアクティブ切り替え
  $('.enrol-section-basesubject-year-lesson-tab-child').removeClass('active');
  $(this).addClass('active');
  
  // コンテンツの表示切り替え
  $('.enrol-section-basesubject-year-lesson-content-child').hide();
  $('.content-level' + level).show();
});