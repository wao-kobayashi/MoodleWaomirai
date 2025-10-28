// ==============================
// ダッシュボードページでの処理
// ==============================
if (bodyId === "page-my-index") {
  /////////////////////////////////////
  ///初期表示状態
  ////////////////////////////////////
  // PC表示でサイドバーがある場合のみ、サイドバーのタグの位置を変更
  if($(window).width() > 768 && $('.dashboard-left').length){
    $('.dashboard-left').insertAfter('#block-region-content');
  }  

  //科目を何も持っていない時の場合の処理
  if (!hasBoughtMainSubject && !hasBoughtChildSubject) {
    // 今日のイベント科目とダッシュボードの未定義科目を表示
    $("#todays-event-subject-none,#dashboard-main-upcoming-class-none").show();
    // 今日の科目PCビューを非表示
    $("#todays-subject-pc").hide();
  } else {
    //何かしら授業を買っていた場合の処理
    $(".dashboard-main-info").show(); //開講前のお知らせを表示（2025年4月以降は存在しない可能性大）
    if ($(window).width() >= 768) {
       // ウィンドウの幅が768px以上の場合、メインの授業部分を非表示
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
              <div class="dashboard-left-block-subject-child-icon"><img src="${icon}"></div>
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
      if (subject.name.includes("哲学")) return ImgSubjectPhilosophy; // 本のアイコン
      if (subject.name.includes("科学")) return ImgSubjectScience; // 顕微鏡のアイコン
      if (subject.name.includes("経済")) return ImgSubjectEconomy; // お金のアイコン
      if (subject.name.includes("英語")) return ImgSubjectEnglish; // 吹き出しのアイコン
      return ImgSubjectOther; // デフォルトは試験管のアイコン
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
      class: "c-pc-hidden dashboard-sp-content", // PCでは非表示
  }).append(contentToCloneDashboardLeft);

  // クローンした要素内の.dashboard-left-block-guideに新しいクラスを追加
  wrappedContent.find('.dashboard-left-block-guide').addClass('dashboard-left-block-guide-scroll');

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
          } else {
            //授業ない時の処理
            $("#dashboard-main-upcoming-class-none").show();
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
    
    // -----------------------------------------------
    // 「科目変更・レベル変更」は当月変更手続きの締切日までにご連絡くださいの表示
    // -----------------------------------------------
    
    // 定数として固定のクッキー名を定義
    const monthlyChangeCourseCookie = 'hideMonthlyChangeCourseAlert';
    const abroadUserCookie = 'hideAbroadUserAlert';

    // 現在の月に基づいて、アラートバナーのテキストを動的に設定

    // 次の月の数値をスパン要素に設定
    // todayMonth+1 により、現在の月の次の月の数値を挿入
    // 例: 現在の月が5月の場合、6を挿入
    $(".c-alert-banner-text-title-nextmonth").text(todayMonth+1);

    // 現在の月の数値をスパン要素に設定
    // todayMonth をそのまま使用して現在の月の数値を挿入
    // 例: 現在の月が5月の場合、5を挿入
    $(".c-alert-banner-text-title-thismonth").text(todayMonth);

    // 締切日をスパン要素に設定
    // DayChangeCourseDeadLineの値を代入
    $(".c-alert-banner-text-title-thisday").text(DayChangeCourseDeadLine);

    // -----------------------------------------------
    // カレンダーの上のJST表記のラベルの表示
    // -----------------------------------------------
    // 表示条件：checkAbroadUserがtrueの場合（海外ユーザーの講座を持っているか、タイムゾーンが東京以外の場合）
    if(checkAbroadUser()){
      // 条件を満たす場合、ラベルを表示
      // 定数としてラベルのHTMLを定義
      const abroadUserJstLabel = '<div class="p-abroad-user-jst-label">授業時間は日本時間(JST)での表示です</div>';
      // PC用のラベルを挿入
      $('.block_calendar_month').append(abroadUserJstLabel);
      // スマートフォン用のラベルを挿入
      $('.dashboard-main-navi + .dashboard-main-class .card-title').after(abroadUserJstLabel);
    }

    // -----------------------------------------------
    // 科目変更モーダルの表示条件チェック
    // -----------------------------------------------
    // モーダルの表示条件：
    // 1. 期間条件：当月の受講レベル変更・科目変更・解約の締切日通知モーダルの表示開始日〜締切日の期間内であること
    //    - DayChangeCourseBannerStart日以降 (todayDay >= DayChangeCourseBannerStart)：受講レベル変更・科目変更・解約の締切日通知モーダルの表示開始日（月の前半）
    //    - DayChangeCourseDeadLine日以前 (todayDay <= DayChangeCourseDeadLine)：受講レベル変更・科目変更・解約の締切日
    // 2. 非表示設定：ユーザーが「非表示」を選択していないこと
    //    - !$.cookie(monthlyChangeCourseCookie)：非表示設定用のクッキーが存在しない
    // 3. 受講状況：メイン科目を購入済みのユーザーであること
    //    - hasBoughtMainSubject：メイン科目の購入フラグ
    if (todayDay >= DayChangeCourseBannerStart && todayDay <= DayChangeCourseDeadLine && !$.cookie(monthlyChangeCourseCookie) && hasBoughtMainSubject) {
      // 条件を満たす場合、モーダルを表示
      createModal({
        title: "【ご案内】<br />受講レベル及び科目の変更<br />ご解約は当月" + DayChangeCourseDeadLine + "日までに<br />お手続きをお願いします。<br /><br />",
        buttons: [
          // OKボタンを追加
          { text: "確認しました", class: "btn-primary c-modal-wrap-close-tag" }
        ]
      });
      // 非公開設定用のクッキーを設定
      // expires: (DayChangeCourseDeadLine - DayChangeCourseBannerStart + 1) で、締切日通知モーダル表示の表示開始日～締切日の日数が経過した際に、自動的に期限切れとなる
      $.cookie(monthlyChangeCourseCookie, "true", { expires: (DayChangeCourseDeadLine - DayChangeCourseBannerStart + 1)});
    }

    // -----------------------------------------------
    // JST表記モーダルの表示条件チェック
    // -----------------------------------------------
    // モーダルの表示条件：
    // 1. checkAbroadUserがtrueの場合（海外ユーザーの講座を持っているか、タイムゾーンが東京以外の場合）
    // 2. 非表示設定用のクッキーが存在しない場合
    if(checkAbroadUser() && !$.cookie(abroadUserCookie)){
      // 条件を満たす場合、モーダルを表示
      createModal({
        title: "授業時間は「日本時間(JST)」に<br />基づいて表示されます。<br /><br />",
        buttons: [
          // OKボタンを追加
          { text: "確認しました", class: "btn-primary c-modal-wrap-close-tag" }
        ]
      });
      // 非公開設定用のクッキーを設定（1年で期限切れとなる）
      $.cookie(abroadUserCookie, "true", { expires: 365});
    }
  }

  // ===============================================
  // カレンダー表示色設定機能
  // 目的：科目ごとに異なる色でカレンダー上に表示する
  // ===============================================
  function calendarScheduleColorChange() {
    console.log("カレンダー色設定を開始");
    // カレンダーの各日付セルを処理
    const today = new Date(); // 現在の日付を取得
    const todayDay = today.getDate(); // 今日の日
    const todayMonth = today.getMonth() + 1; // 今日の月（0から始まるので1を加算）
    const todayYear = today.getFullYear(); // 今日の年
    let eventFound = false; // 今日のイベントが見つかったかどうか
    let eventDetails = []; // 今日のイベント詳細を格納
    let flagTodaysCalendar = false; // 今日の日付が処理されているかを追跡するフラグ

    // .calendarwrapper内のロジックを実行（カレンダー上の日付に対して色変更を適用）
    $(".day").each(function () {
      const $cell = $(this); // 各セル（カレンダーの日付）
      const cellDay = parseInt($cell.attr("data-day"), 10); // セルの日付
      const cellMonth = parseInt($cell.attr("data-month"), 10); // セルの月
      const cellYear = parseInt($cell.attr("data-year"), 10); // セルの年

      // カレンダー内のイベントに対して色変更ロジックを適用
      const $dayContent = $cell.find('[data-region="day-content"]');
      if ($dayContent.length > 0) { // イベントが存在する場合
        const $events = $dayContent.find('li a[data-action="view-event"]'); // イベントリンクを取得
        $events.each(function () {
          const $eventLink = $(this); // 各イベントリンク
          const courseName = $eventLink.text().trim(); // イベント名を取得
          console.log(`Course Name: ${courseName}`);

          // イベント名に応じて背景色を変更
          if (courseName.includes("経済")) {
            console.log("経済が見つかりました。背景色を青に変更します。");
            $eventLink.attr("style", "background: #28afe7 !important; border-left: #008EC9 2px solid !important;");
          } else if (courseName.includes("科学")) {
            console.log("科学が見つかりました。背景色を緑に変更します。");
            $eventLink.attr("style", "background: #B6D43E !important; border-left: #96B128 2px solid !important;");
          } else if (courseName.includes("哲学")) {
            console.log("哲学が見つかりました。背景色をオレンジに変更します。");
            $eventLink.attr("style", "background: #FCB72E !important; border-left: #E98800 2px solid !important;");
          } else if (courseName.includes("英語")) {
            console.log("英語が見つかりました。背景色を紫に変更します。");
            $eventLink.attr("style", "background: #AA68AA !important; border-left: #8D3A8D 2px solid !important;");
          } else {
            console.log("条件に一致しない科目: ", courseName);
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
    calendarScheduleColorChange();
    updateClassSchedule();  // 授業スケジュールの更新
    // カレンダーの前月ボタンを押せるようにする
    $('.pagelayout-mydashboard').addClass('is-previous-enabled');
  });

  // カレンダー月切り替え時の処理
  $(document).on("click", ".arrow_link", function () {
    // adminユーザーではない場合、ボタンの連打防止クラスを付ける（表示は変えない）
    if (!hasBoughtAdminSubject) {
      $('.pagelayout-mydashboard').addClass('is-previous-click-disabled');
    }

    // 1秒の遅延後に色設定を実行（DOMの更新を待つ）
    setTimeout(() => {
        calendarScheduleColorChange(); // カレンダー色設定を実行

        // adminユーザーではない場合、前々月以前に遷移するカレンダーの前月ボタン以外は押せるようにする
        if (!hasBoughtAdminSubject) {
          // カレンダーの前月ボタンが示す年月をDateオブジェクトとして取得（data属性から年と月を取得し、月は0始まりに補正）
          let previousMonth = new Date(parseInt($('.arrow_link.previous').attr('data-year'), 10),parseInt($('.arrow_link.previous').attr('data-month'), 10) - 1);
          // 現在の年月日を表すDateオブジェクトを生成（今月の判定に使用）
          let currentMonth = new Date();
          // 前月ボタンの年月と現在の年月の差を「月数」で算出（年と月の差を合算）
          let monthDiff = (currentMonth.getFullYear() - previousMonth.getFullYear()) * 12 + (currentMonth.getMonth() - previousMonth.getMonth());
          // 前月ボタンが前々月以前に遷移する場合
          if(monthDiff >= 2){
            $('.pagelayout-mydashboard').removeClass('is-previous-enabled'); // 前月ボタンを押せないようにする
          }else{
            $('.pagelayout-mydashboard').addClass('is-previous-enabled'); // 前月ボタンを押せるようにする
          }
          // ボタンの連打防止クラスを解除（表示は変えない）
          $('.pagelayout-mydashboard').removeClass('is-previous-click-disabled');
        }
    }, 1000);
  });
  $(document).on("click", ".close-btn-change-course", function () {
    hideBanner("#alert-change-course");   
  });

  // `hasBoughtMainSubject` が true の場合に `calendarScheduleColorChange` を6秒ごとに実行する
  if (hasBoughtMainSubject) {
    // setInterval を使って 6秒(3000ミリ秒)ごとに関数を呼び出す
    // カレンダー登録、直後に色が変わらないので管理者向け設定
    setInterval(calendarScheduleColorChange, 6000);
  }

  // 有料講座を持っている場合に締切日までに科目の変更・有料講座の解約やってねバナーを表示
  if (hasBoughtMainSubject) {
      // アラートバナーを表示
      $("#alert-change-course").show();
  }
}

