// ==============================
// 科目データの定義
// ==============================

// `subjects` 配列は、各科目の情報を保持するデータセット。
// 各要素は1つの科目を表し、メイン科目と子科目が含まれる。
// 主なプロパティの説明:
// - `id`: 科目の一意の識別子（数値）
// - `name`: 科目の名前（文字列）
// - `key`: 科目を一意に識別するキー（文字列）
// - `type`: 科目の種類（"main"はメイン科目、"child"は子科目）
// - `parentKey`: 子科目が属するメイン科目を示すキー（子科目のみ）
// - `level`: 子科目のレベルを示す（"L1" ～ "L4"、子科目のみ）

const subjects = [
  // ==============================
  // メイン科目
  // ==============================

  // ID: 212, 名前: "哲学", キー: "philosophy"
  // メイン科目であり、関連する子科目が存在する。
  { id: 212, name: "哲学", key: "philosophy", type: "main" },

  // ID: 211, 名前: "科学", キー: "science"
  // メイン科目であり、関連する子科目が存在する。
  { id: 211, name: "科学", key: "science", type: "main" },

  // ID: 213, 名前: "経済", キー: "economy"
  // メイン科目であり、関連する子科目が存在する。
  { id: 213, name: "経済", key: "economy", type: "main" },

  // ID: 229, 名前: "3科目セット", キー: "threesubjectpack"
  // 複数の科目をまとめたパッケージ。特定の子科目とは直接の関連がない。
  { id: 229, name: "3科目セット", key: "threesubjectpack", type: "main" },

  // ID: 228, 名前: "2科目セット", キー: "twosubjectpack"
  // 2つの科目をまとめたパッケージ。特定の子科目とは直接の関連がない。
  { id: 228, name: "2科目セット", key: "twosubjectpack", type: "main" },

  // ID: 236, 名前: "グローバル英語", キー: "globalenglish"
  // メイン科目であり、関連する子科目が存在する。
  { id: 236, name: "グローバル英語", key: "globalenglish", type: "main" },

  // ID: 235, 名前: "プログラミング", キー: "programming"
  // メイン科目であり、現時点では子科目は定義されていない。
  { id: 235, name: "プログラミング", key: "programming", type: "main" },

  // ==============================
  // 子科目
  // ==============================

  // 子科目は特定のメイン科目に属し、それぞれ異なるレベル（L1 ～ L4）を持つ。
  // `parentKey` プロパティを使用して関連するメイン科目を指定する。

  // 哲学に関連する子科目
  { id: 221, name: "哲学 L1", key: "philosophy", parentKey: "philosophy", type: "child", level: "L1" },
  { id: 225, name: "哲学 L2", key: "philosophy", parentKey: "philosophy", type: "child", level: "L2" },
  { id: 242, name: "哲学 L3", key: "philosophy", parentKey: "philosophy", type: "child", level: "L3" },
  { id: 243, name: "哲学 L4", key: "philosophy", parentKey: "philosophy", type: "child", level: "L4" },

  // 科学に関連する子科目
  { id: 223, name: "科学 L1", key: "science", parentKey: "science", type: "child", level: "L1" },
  { id: 222, name: "科学 L2", key: "science", parentKey: "science", type: "child", level: "L2" },
  { id: 244, name: "科学 L3", key: "science", parentKey: "science", type: "child", level: "L3" },
  { id: 245, name: "科学 L4", key: "science", parentKey: "science", type: "child", level: "L4" },

  // 経済に関連する子科目
  { id: 226, name: "経済 L1", key: "economy", parentKey: "economy", type: "child", level: "L1" },
  { id: 227, name: "経済 L2", key: "economy", parentKey: "economy", type: "child", level: "L2" },
  { id: 246, name: "経済 L3", key: "economy", parentKey: "economy", type: "child", level: "L3" },
  { id: 247, name: "経済 L4", key: "economy", parentKey: "economy", type: "child", level: "L4" },

  // グローバル英語に関連する子科目
  { id: 253, name: "グローバル英語 L1", key: "globalenglish", parentKey: "globalenglish", type: "child", level: "L1" },
  { id: 254, name: "グローバル英語 L2", key: "globalenglish", parentKey: "globalenglish", type: "child", level: "L2" },
];

$(document).ready(function() {
    const tenantIdNumber = $("html").data("tenantidnumber");
    if (tenantIdNumber === "stg") {
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
const CurrentViewCourseData = subjects.find(
  (subject) => subject.id === getCurrentCourseId()
);

// コースデータが見つからない場合のエラーハンドリング
if (!CurrentViewCourseData) {
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
const isBuySubjectMain = checkGroup((subject) => subject.type === "main");

// 子科目（typeが"child"）に関連付けられているかを判定
// 条件は「typeが'child'」であること。
const isBuySubjectChild = checkGroup((subject) => subject.type === "child");

// ==============================
// 科目の特定レベルチェック関数
// ==============================

// 複数のメイン科目キーが、現在のページに関連付けられているか判定する関数
// subjectKeys: 判定対象となる科目のキー配列
// isAllRequired: trueの場合、全てのキーが一致する必要あり（AND条件）
// falseの場合、一つでも一致すればよい（OR条件）
function isBuySubjectMainArray(subjectKeys, isAllRequired = false) {
  // 全てのキーを確認するか（一致要件が厳しい）、一部のみ確認するかを動的に選択
  const checkMethod = isAllRequired ? "every" : "some";
  return subjectKeys[checkMethod]((subjectKey) => {
    // 指定されたキーに対応するメイン科目を検索
    const subject = subjects.find(
      (item) => item.key === subjectKey && item.type === "main"
    );
    // 科目が存在しない場合はfalseを返す
    if (!subject) return false;
    // bodyClassesに科目のIDが含まれている場合のみtrueを返す
    return bodyClasses.includes(subject.id);
  });
}

// 特定の子科目キーとレベルが、現在のページに関連付けられているか判定する関数
// subjectKey: 判定対象の科目キー
// levels: 判定対象となるレベルの配列
function isBuySubjectChildArray(subjectKey, levels) {
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
  $(".c-modal-wrap-close").on("click", function () {
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

  //何も受講していない時は、科目勝手欲しい要素出す
  if (!isBuySubjectMain && !isBuySubjectChild) {
    $("#todays-event-subject-none,#dashboard-main-upcoming-class-none").show();
    $("#todays-subject-pc").hide();
  } else {
    if ($(window).width() >= 768) {
      $(".dashboard-main-class").hide();
    }
  }
  ////////////////////////////
  // 受講中科目の処理
  ////////////////////////////

  // 詳細科目を処理
  // 科目リンクを生成する関数
  function renderSubject(subject, icon, isBuySubjectMain) {
    const courseLink = isBuySubjectMain
      ? `https://lms.waomirai.com/admin/tool/catalogue/courseinfo.php?id=${subject.id}`
      : `https://lms.waomirai.com/course/view.php?id=${subject.id}`;
    return `
        <a href="${courseLink}" class="dashboard-left-block-subject-child ${subject.key}">
            <div class="dashboard-left-block-subject-child-icon">${icon}</div>
            <div class="dashboard-left-block-subject-child-text">
                <div>${subject.name}</div>
            </div>
        </a>
    `;
  }

  // 科目のアイコンを取得する関数
  const getIcon = (subject) => {
    if (subject.name.includes("哲学")) return "&#x1f4D6;"; // 📖
    if (subject.name.includes("科学")) return "&#x1f52C;"; // 🔬
    if (subject.name.includes("経済")) return "&#x1f4B0;"; // 💰
    if (subject.name.includes("英語")) return "&#x1f4AC;"; // 💬
    if (subject.name.includes("プログラミング"))
      return "&#x1f468;&#x200D;&#x1f4BB;"; // 👨‍💻
    return "&#x1f9ea;"; // デフォルト
  };

  // サブ科目が存在するか確認する関数
  function hasRelatedChildSubject(parentKey) {
    return some(
      (subject) => subject.type === "child" && subject.parentKey === parentKey
    );
  }
  function processSubjectMain() {
    console.log("メイン科目（SubjectMain）に該当しています");

    const subjectMainNames = subjects
      .filter((subject) => subject.type === "main")
      .filter((subject) => {
        const hasChild = subjects.some(
          (childSubject) =>
            childSubject.type === "child" &&
            childSubject.parentKey === subject.key &&
            bodyClasses.includes(childSubject.id)
        );

        console.log(`Checking subject: ${subject.name}, hasChild: ${hasChild}`);

        if (hasChild) {
          console.log(`スキップ: サブ科目が存在するため ${subject.name}`);
          return false;
        }

        const isIncluded = bodyClasses.includes(subject.id);
        console.log(
          `Checking bodyClasses for subject: ${subject.name}, isIncluded: ${isIncluded}`
        );
        return isIncluded;
      })
      .map((subject) => renderSubject(subject, getIcon(subject), true))
      .join("");

    if (subjectMainNames) {
      $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(
        subjectMainNames
      );
    }
  }

  // 詳細科目（SubjectChild）を処理する関数
  function processSubjectChild() {
    console.log("詳細科目（SubjectChild）に該当しています");

    const subjectChildNames = subjects
      .filter((subject) => subject.type === "child")
      .filter((subject) => bodyClasses.includes(subject.id))
      .map((subject) => renderSubject(subject, getIcon(subject), false))
      .join("");

    if (subjectChildNames) {
      $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(
        subjectChildNames
      );
    }
  }

  if (isBuySubjectMain) {
    processSubjectMain();
  }

  // 詳細科目を処理
  if (isBuySubjectChild) {
    processSubjectChild();
  }

  // // どの科目にも該当しない場合のエラーハンドリング
  if (!isBuySubjectMain && !isBuySubjectChild) {
    console.error("指定された科目に該当しません");
    // 特定のHTMLを指定要素に挿入する

    const errorHtml = `
        <div class="dashboard-left-block-subject-child">
            <p>受講している科目がありません。</p>
        </div>
    `;
    $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").html(
      errorHtml
    ); // 挿入先要素（例: .target-container）にHTMLを挿入
  }
  // .dashboard-leftの内容を取得してclone
  var contentToClone = $(".dashboard-left").clone();

  // #page-content直下に配置
  var wrappedContent = $("<div>", {
    id: "dashboard-sp-content",
    class: "c-pc-hidden",
  }).append(contentToClone);

  // #page-content直下に配置
  $("#page-content").append(wrappedContent);

  /////////////////////////////////////
  ///カレンダー
  ////////////////////////////////////
  let executed = false; // 初回実行を管理するフラグ

  // ロジックを関数として定義（共通化）
  function executeCalendarLogic() {
    console.log("カレンダーロジックを実行します。");

    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1; // 月は0から始まるので1を加える
    const todayYear = today.getFullYear();
    let eventFound = false;
    let eventDetails = [];
    let flagTodaysCalendar = false;

    // .calendarwrapper内のロジックを実行（全イベントに色変更を適用）
    $(".day").each(function () {
      const $cell = $(this);
      const cellDay = parseInt($cell.attr("data-day"), 10); // カレンダーの日付
      const cellMonth = parseInt($cell.attr("data-month"), 10); // カレンダーの月
      const cellYear = parseInt($cell.attr("data-year"), 10); // カレンダーの年

      // 色変更ロジック（すべてのイベントに適用）
      const $dayContent = $cell.find('[data-region="day-content"]');
      if ($dayContent.length > 0) {
        const $events = $dayContent.find('li a[data-action="view-event"]');
        $events.each(function () {
          const $eventLink = $(this);
          const courseName = $eventLink.text().trim();
          console.log(`Course Name: ${courseName}`);

          // 色変更ロジック
          if (courseName.includes("経済")) {
            console.log("経済が見つかりました。背景色を青に変更します。");
            $eventLink.attr(
              "style",
              "background: #AA68AA !important; border-left: #008EC9 2px solid !important;"
            );
          } else if (courseName.includes("科学")) {
            console.log("哲学が見つかりました。背景色を緑に変更します。");
            $eventLink.attr(
              "style",
              "background: #B6D43E !important; border-left: #96B128 2px solid !important;"
            );
          } else if (courseName.includes("哲学")) {
            console.log("哲学が見つかりました。背景色をオレンジに変更します。");
            $eventLink.attr(
              "style",
              "background: #FCB72E !important; border-left: #E98800 2px solid !important;"
            );
          } else if (courseName.includes("英語")) {
            console.log("英語が見つかりました。背景色を紫に変更します。");
            $eventLink.attr(
              "style",
              "background: #AA68AA !important; border-left: #8D3A8D 2px solid !important;"
            );
          } else {
            console.log("条件に一致しない科目: ", courseName);
          }
        });
      }

      // 今日の日付に一致するイベントがあれば、そのイベント詳細を収集
      if (cellDay === todayDay && !executed) {
        console.log("今日の日付に一致しました:", {
          cellDay,
          cellMonth,
          cellYear,
        });

        const $dayContent = $cell.find('[data-region="day-content"]');
        if ($dayContent.length > 0) {
          const $events = $dayContent.find('li a[data-action="view-event"]');
          $events.each(function () {
            var courseName = $(this).text().trim();
            eventDetails.push(courseName);
            console.log("今日のイベント: " + courseName);

            // 新しい要素を作成
            var $lessonContainer = $("<div>", {
              class: "dashboard-main-class-content-lesson",
            });
            var $lessonTitle = $("<div>", {
              class: "dashboard-main-class-content-lesson-title",
              text: courseName,
            });
            var $lessonLink = $("<a>", {
              class: "dashboard-main-class-content-lesson-button",
              href: $(this).attr("href"), // 元のリンクのhref属性をコピー
              text: "授業に参加する",
            });
            // コンテナに要素を追加
            $lessonContainer.append($lessonTitle).append($lessonLink);
            $("#todays-event-class-scheduled").prepend($lessonContainer);
          });
          eventFound = true; // 今日授業あり
        }
      }
      // 今日以降のイベント（明日以降も含む）をアップカミングに追加
      if (cellDay > todayDay && !executed) {
        const $dayContent = $cell.find('[data-region="day-content"]');
        console.log("$dayContent:", $dayContent); // 取得したdayContentを確認

        if ($dayContent.length > 0) {
          const $events = $dayContent.find('li a[data-action="view-event"]');
          console.log("$events:", $events); // 取得したeventsを確認

          $events.each(function () {
            var courseName = $(this).text().trim();
            const getSubjectCategory = (courseName) => {
              if (courseName.includes("哲学")) return "philosophy";
              if (courseName.includes("科学")) return "science";
              if (courseName.includes("経済")) return "economy";
              if (courseName.includes("英語")) return "english";
              if (courseName.includes("プログラミング")) return "programming";
              return "defalut-subject"; // デフォルト: 試験管
            };

            // 使用例
            const getSubjectCategoryValue = getSubjectCategory(courseName);

            //今日の日付を取得
            const today = new Date();
            const currentMonth = today.getMonth() + 1; // 現在の月（0から始まるので1を足す）
            const todayDay = today.getDate(); // 今日の日付
            const todayYear = today.getFullYear(); // 今日の年
            // cellMonthは現在の月
            const cellDay = parseInt($cell.attr("data-day"), 10); // カレンダーの日付
            const cellMonth = currentMonth; // 現在の月を設定
            const cellYear = todayYear; // カレンダーの年

            // イベントの日付を作成
            const eventDate = new Date(cellYear, cellMonth - 1, cellDay); // 月は0から始まるので、cellMonth - 1にする

            // 日付を「12/27(金)」の形式でフォーマット
            const dateString = `${cellMonth}/${cellDay}`;
            const Week = [
              "(日)",
              "(月)",
              "(火)",
              "(水)",
              "(木)",
              "(金)",
              "(土)",
            ];
            const dayOfWeek = Week[eventDate.getDay()]; // (土)
            console.log(dayOfWeek); // (土)

            // 新しいdivを作成
            var $lessonContainer = $("<div>", {
              class:
                "dashboard-main-class-content-lesson " +
                getSubjectCategoryValue,
            });

            // courseName と dateString を同じ div 内に追加
            var $lessonTitleAndDate = $("<span>", {
              class: "dashboard-main-class-content-lesson-details",
            })
              .append(
                $("<span>", { class: "date", text: dateString + dayOfWeek })
              )
              .append($("<span>", { class: "title", text: courseName }));

            // $lessonContainer に $lessonTitleAndDate を追加
            $lessonContainer.append($lessonTitleAndDate);

            // 画面に追加
            $("#dashboard-main-upcoming-class-scheduled").append(
              $lessonContainer
            );
            upcomingEventFound = true; // 明日以降のイベントが見つかった
          });
        }
      }
      // 初回実行後にフラグをtrueに設定
    });

    // 今日のイベントがあればダッシュボードメッセージを更新
    if (!flagTodaysCalendar) {
      let message = "本日は授業はありません。"; // デフォルトメッセージ

      if (eventFound) {
        message = `本日は、「${eventDetails.join("」「")}」の授業があります。`;
        console.log("ダッシュボードメッセージを更新しました。");
      } else {
        console.log("本日は授業がありません。");
        //何かしらの科目を買っているときは本日の授業のところに「本日は授業がありません」を表示
        if (isBuySubjectMain || isBuySubjectChild || isBuyProgramming) {
          $("#todays-event-class-none").show();
          //何も授業買っていない時に授業なければ、今月は授業がありませんを表示
        } else if (!isBuySubjectMain && !isBuySubjectChild) {
          $("#dashboard-main-upcoming-class-none").show();
        }
      }

      // メッセージをダッシュボードに設定
      $("#todays-subject-pc .c-alert-banner-text-title").text(message);
      // 今日のカレンダーが見つかったことを示すフラグを設定
      flagTodaysCalendar = true;
    }
    // 明日以降のスケジュールがない場合は、スマホにNoneメッセージを表示
    if (!upcomingEventFound) {
      $("#dashboard-main-upcoming-class-none").show();
    }
    executed = true;
  }

  // ページ読み込み時に発火
  $(document).ready(function () {
    console.log("ページ読み込み時のロジックを実行します。");
    executeCalendarLogic();
  });

  // .arrow_link のクリック時に0.3秒後に発火
  $(document).on("click", ".arrow_link", function () {
    console.log(
      ".arrow_link がクリックされました。0.3秒後にロジックを実行します。"
    );
    setTimeout(() => {
      executeCalendarLogic();
    }, 300); // 300ミリ秒（0.3秒）
  });
}

// ==============================
// ログイン・サインアップページの処理
// ==============================
if (bodyId === "page-login-signup" || bodyId === "page-login-forgot_password") {
  // ログインページのタイトルを変更
  $(".login-heading").text("新規会員登録");

  // フォームのプレースホルダーを設定
  const placeholders = {
    id_username: "例）waomirai",
    id_email: "例）sample@gmail.com",
    id_email2: "例）sample@gmail.com",
    id_lastname: "例）鈴木",
    id_firstname: "例）太郎",
    id_profile_field_furigana: "例）スズキタロウ",
    id_profile_field_postnumber: "例）0000000",
  };

  $.each(placeholders, function (id, placeholder) {
    $("#" + id).attr("placeholder", placeholder);
  });

  // パスワードポリシーの説明を移動
  const $sourceElement = $("#fitem_id_passwordpolicyinfo .form-control-static");
  const $targetParent = $("label#id_password_label");
  if ($sourceElement.length && $targetParent.length) {
    $targetParent.append($sourceElement);
  }

  // アイコン（!）を "*" に置き換え
  $(".fa-exclamation-circle").each(function () {
    $(this).replaceWith("*");
  });

  // ロゴを挿入
  const $loginWrapper = $("#page-login-signup .login-wrapper");
  if ($loginWrapper.length) {
    const signupLogoHtml = `
                <div class="signup-logo">
                    <img src="https://go.waomirai.com/l/1026513/2023-11-16/gddzt/1026513/1700192228BDlbz92f/logo_basic_white.png" style="width: 100%;">
                </div>`;
    $loginWrapper.before(signupLogoHtml);
  }
}
if (bodyId === "page-login-index") {
  const cookiekeywords = ["ブラウザのクッキーを"];

  cookiekeywords.forEach((keyword) => {
    $("*:contains('" + keyword + "')")
      .filter(function () {
        return $(this).children().length === 0; // 子要素を持たないテキストノードだけ対象
      })
      .closest("div")
      .css("display", "none");
  });
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
// 購入処理
// ==============================
if (bodyId === "page-enrol-index") {
  //セット割引要素を購入右に追加
  const $buttonElement = $(".enrol_fee_payment_region button");
  if ($buttonElement.length) {
    const customDivHtml = `
                <div class="page-enrol-set-discount">
                    <p>セット受講割引でお得！</p>
                    <p><a href='#' class="view-details-link">詳細を見る</a></p>
                </div>`;
    $buttonElement.after(customDivHtml);
  }

 

  $(document).on('click', '.view-details-link', function (event) {
    event.preventDefault(); // デフォルトのリンク動作を無効化
    const twosubjectpackId = subjects.find(subject => subject.key === 'twosubjectpack').id;  // twosubjectpackのIDを取得
    const threesubjectpackId = subjects.find(subject => subject.key === 'threesubjectpack').id;  // threesubjectpackのIDを取得
    createModal({
      close: true,
      title: "哲学 / 科学 / 経済の3教科は<br />まとめて受講するとお得です",
      buttons: [
        { text: "2教科を受講：11,000円(税)/月", url: `https://lms.waomirai.com/enrol/index.php?id=${twosubjectpackId}`, class: "btn-primary" },
        { text: "3教科を受講：15,400円(税)/月", url: `https://lms.waomirai.com/enrol/index.php?id=${threesubjectpackId}`, class: "btn-primary" }, // ここは例としてそのまま
      ]
    });
  });
  // 画面下に追従に"円"の要素を入れる
  const SubjectpPrice = $('.enrol_fee_payment_region b:contains("¥")');
  var SubjectPriceContent = `<div class="c-pc-hidden fixed-subject-price">${SubjectpPrice.text()} /月</div>`;
  console.log(SubjectPriceContent);
  $("#page.drawers").after(SubjectPriceContent);

  // カテゴリーごとの購入処理
  $(".enrol_fee_payment_region button").on("click", function (event) {
    const category = CurrentViewCourseData.key;

    // 科目別の処理（哲学、科学、経済）
    if (["philosophy", "science", "economy"].includes(category)) {
      event.preventDefault();

      const otherSubjects = {
        philosophy: ["science", "economy"],
        science: ["philosophy", "economy"],
        economy: ["philosophy", "science"],
      };

      if (isBuySubjectMainArray(otherSubjects[category])) {
        //1科買っていてもう1科買おうとしたとき
        $("body").append(
          createModal({
            close: true,
            text: "「哲学・経済・化学」の教科で２科目以上受講する際はセット購入がお得です。セット購入の際はフォームより申し込みをお願いいたします。",
            buttons: [
              { text: "変更フォームへ", url: "#", class: "btn-primary" }, // 1つ目のボタンにクラスを指定
            ]
          })
        );
      } else if (
        //2科買っていてもうセットパック買おうとしたとき
        isBuySubjectMainArray(["twosubjectpack", "threesubjectpack"])
      ) {
        $("body").append(
          createModal({
            close: true,
            text: "すでに複数受講できる科目セットを購入されています。受講科目の選択は「登録情報の変更ページ」で編集可能です。",
            buttons: [
              { text: "ここは未定", url: "#", class: "btn-primary" }, // 1つ目のボタンにクラスを指定
            ]
          })
        );
      }
    }

    // セットパック購入時の処理
    if (["twosubjectpack", "threesubjectpack"].includes(category)) {
      if (isBuySubjectMainArray(["philosophy", "science", "economy"])) {
        $("body").append(
          createModal({
            close: true,
            text: "「哲学・化学・経済」の科目のいずれかを受講している場合、こちらのボタンからセット受講を購入することはできません。下記フォームより購入を申し込む必要がございます。",
            buttons: [
              { text: "複数科目セットの購入フォームへ", url: "#", class: "btn-primary" }, // 1つ目のボタンにクラスを指定
            ]
          })
        );
      } else if (
        category === "twosubjectpack" &&
        isBuySubjectMainArray(["threesubjectpack"])
      ) {
        $("body").append(
          createModal({
            close: true,
            text: "「３科目セット」を購入済みです。２科目セットへ受講変更したい場合はフォームよりお問い合わせをお願いいたします。",
            buttons: [
              { text: "受講変更フォームへ", url: "#", class: "btn-primary" }, // 1つ目のボタンにクラスを指定
            ]
          })
        );
      } else if (
        category === "threesubjectpack" &&
        isBuySubjectMainArray(["twosubjectpack"])
      ) {
        $("body").append(
          createModal({
            close: true,
            text: "「２科目セット」を購入済みです。３科目セットへ受講変更したい場合はフォームよりお問い合わせをお願いいたします。",
            buttons: [
              { text: "受講変更フォームへ", url: "#", class: "btn-primary" }, // 1つ目のボタンにクラスを指定
            ]
          })
        );
      }
    }
  });

}

// ==============================
// 受講ページ
// ==============================
if (bodyId === "page-mod-questionnaire-view") {
  //スマホ版でタイトルを動画の下にうつすロジック
  var contentToClone = $("#page-header").clone();
  var wrappedContent = $("<div>", {
    id: "sp-page-header",
    class: "c-pc-hidden",
  }).append(contentToClone);
  // #page-content直下に配置
  $(".activity-description").append(wrappedContent);

  //課題提出の下にリード文を入れる
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
//メイン3科目or2,3科目パック購入後はリダイレクトさせる
// ==============================
if (bodyId === "page-course-view-flexsections") {
  //哲学のみ購入
  const targetSubjects = [
    "philosophy",
    "science",
    "economy",
    "globalenglish",
    "twosubjectpack",
    "threesubjectpack",
  ];
  targetSubjects.forEach((key) => {
    if (
      CurrentViewCourseData.key === key &&
      CurrentViewCourseData.type === "main"
    ) {
      // "main"タイプの科目の場合の処理
      console.log(`CurrentViewCourseDataはmainタイプの${key}です`);

      // twosubjectpack と threesubjectpack の場合は child の判定を行わない
      if (key === "twosubjectpack" || key === "threesubjectpack") {
        console.log(`${key}はchild判定をスキップします。`);
        createModal({
          // close: false,
          // text: "「２科目セット」を購入済みです。３科目セットへ受講変更したい場合はフォームよりお問い合わせをお願いいたします。",
          image: "https://go.waomirai.com/l/1026513/2025-01-21/hc69y/1026513/1737438663b4Ybg0s8/fv.png",
          imageClass: "c-modal-wrap-subject-img", // 画像に付与するクラス
          wrapClass: "c-modal-wrap-subject", // モーダル全体に付与するクラス
          buttons: [
            { text: "科目のレベルを設定する", url: "https://lms.waomirai.com/user/edit.php", class: "btn-primary" }, // 1つ目のボタンにクラスを指定
          ]
        })
        return; // child判定をスキップして次に進む
        
      }

      // bodyClassesに含まれるidを基に、対応する"child"タイプの科目が存在するか確認
      const hasChild = bodyClasses.some((courseId) => {
        // bodyClassesに含まれる各idについて、対応する"child"タイプの科目を検索
        return subjects.some(
          (subject) =>
            subject.id === courseId &&
            subject.key === key &&
            subject.type === "child"
        );
      });

      if (hasChild) {
        console.log(`${key}のchildタイプが存在します`);

        // "child"タイプが存在する場合、リダイレクト
        const childCourse = subjects.find(
          (subject) =>
            subject.key === key &&
            subject.type === "child" &&
            bodyClasses.includes(subject.id)
        );

        if (childCourse) {
          const redirectUrl = `https://lms.waomirai.com/course/view.php?id=${childCourse.id}`;
          console.log(`リダイレクト: ${redirectUrl}`);
          window.location.href = redirectUrl; // リダイレクト
        }
      } else {
        createModal({
          // close: false,
          // text: "「２科目セット」を購入済みです。３科目セットへ受講変更したい場合はフォームよりお問い合わせをお願いいたします。",
          image: "https://go.waomirai.com/l/1026513/2025-01-21/hc69y/1026513/1737438663b4Ybg0s8/fv.png",
          imageClass: "c-modal-wrap-subject-img", // 画像に付与するクラス
          wrapClass: "c-modal-wrap-subject", // モーダル全体に付与するクラス
          buttons: [
            { text: "科目のレベルを設定する", url: "https://lms.waomirai.com/user/edit.php", class: "btn-primary" }, // 1つ目のボタンにクラスを指定
          ]
        })
        console.log(`${key}のchildタイプは存在しません`);
        // "child"タイプがない場合の処理
      }
    } else {
      // "main"タイプではない場合の処理
      console.log(`CurrentViewCourseDataはmainタイプの${key}ではありません`);
    }
  });
}

// ==============================
//マイページ
// ==============================
if (bodyId === "page-user-edit") {
  var AreaPhilosophy = $("#fitem_id_profile_field_Philosophy_Level"); //哲学の入力エリア
  var AreaScience = $("#fitem_id_profile_field_Science_Level"); //科学の入力エリア
  var AreaEconomy = $("#fitem_id_profile_field_Economy_Level"); //経済の入力エリア
  var AreaEnglish = $("#fitem_id_profile_field_English_Level"); //英語の入力エリア
  var AreaSingleCourse = $("#fitem_id_profile_field_1cource_Subject"); //１科目受講の入力エリア
  var AreaTwoCourse = $("#fitem_id_profile_field_2cources_subject"); //２科目受講の入力エリア

  //初回受講レベル登録時、submitあたりで注意文言を出す
  function AlertSubjectSettingFirst() {
    $("#fgroup_id_buttonar").before(
      `<div id="id_submitbutton-subject">一度受講レベルを設定すると、2回目以降のレベル変更時の反映は当月末になりますのでご注意くださいませ。</div>`
    );
  }

  // サブレベルを自動取得する関数
  function getOwnedSubLevels(subjectKey, levels) {
    // 指定された科目キーとレベルに該当する子科目を取得
    return subjects
      .filter(
        (subject) =>
          subject.type === "child" &&
          subject.key === subjectKey &&
          levels.includes(subject.level) &&
          bodyClasses.includes(subject.id) // 現在のページに関連付けられた科目IDか確認
      )
      .map((subject) => subject.level); // 該当するレベルを抽出
  }

  //memo AreaSingleCourse
  var AreaElements = [
    AreaPhilosophy,
    AreaScience,
    AreaEconomy,
    AreaEnglish,
    AreaSingleCourse,
    AreaTwoCourse,
  ];
  AreaElements.forEach(function (AreaElement) {
    AreaElement.hide();
  });
  //選択した科目フィールドのセレクト(select)を取得する関数
  function getSelectElement(Area) {
    var selectElement = Area.find("select"); // 返すのもの
    return selectElement;
  }
  //選択した科目フィールドのセレクト(select)のオプションを操作する関数
  function selectOptionByIndex(Area, optionIndex = 0) {
    var selectElement = getSelectElement(Area); // 既存の関数を利用
    // console.log(selectElement);
    selectElement.find(`option:eq(${optionIndex})`).prop("selected", true); // 指定された番号の<option>を選択
    return selectElement; // <select>要素を返す
  }

  //選択した科目フィールドのセレクト(select)を監視する関数
  //この関数は、２科目、３科目の場合考慮することが多そうなので一旦使わない。
  function handleMultipleSelectChange(selectors, callback) {
    // インデックスを格納する配列
    var selectedIndexes = [];

    // セレクタで指定された複数の select 要素の各 option のインデックスを取得
    $(selectors).each(function () {
      // 各 <select> の選ばれた <option> のインデックスを取得
      var selectedIndex = $(this).prop("selectedIndex");
      // インデックスを配列に格納
      selectedIndexes.push(selectedIndex);
    });

    // コールバック関数を実行し、格納されたインデックス配列を渡す
    callback(selectedIndexes);

    // 各 select 要素に対して change イベントを再度設定
    $(selectors).on("change", function () {
      // インデックス配列を再初期化
      selectedIndexes = [];

      // 再度インデックスを取得し、配列に格納
      $(selectors).each(function () {
        var selectedIndex = $(this).prop("selectedIndex");
        selectedIndexes.push(selectedIndex);
      });

      // コールバック関数を実行し、更新されたインデックス配列を渡す
      callback(selectedIndexes);
    });
  }

  //哲学のみ購入
  if (
    isBuySubjectMainArray(["philosophy"]) &&
    !isBuySubjectMainArray(["science", "economy"])
  ) {
    AreaPhilosophy.show(); //哲学を表示
    selectOptionByIndex(AreaSingleCourse, 1); //1科目受講を哲学に
    //初回受講レベル登録時、submitあたりで注意文言を出す
    if (!isBuySubjectChildArray("philosophy", ["L1", "L2", "L3", "L4"])) {
      AlertSubjectSettingFirst();
    }
  }
  //科学のみ購入
  if (
    isBuySubjectMainArray(["science"]) &&
    !isBuySubjectMainArray(["philosophy", "economy"])
  ) {
    AreaScience.show(); //科学を表示
    selectOptionByIndex(AreaSingleCourse, 2); //1科目受講を科学に
    //初回受講レベル登録時、submitあたりで注意文言を出す
    if (!isBuySubjectChildArray("science", ["L1", "L2", "L3", "L4"])) {
      AlertSubjectSettingFirst();
    }
  }
  //経済のみ購入
  if (
    isBuySubjectMainArray(["economy"]) &&
    !isBuySubjectMainArray(["philosophy", "science"])
  ) {
    AreaEconomy.show(); //経済エリアを表示
    selectOptionByIndex(AreaSingleCourse, 3); //1科目受講を経済に
    //初回受講レベル登録時、submitあたりで注意文言を出す
    if (!isBuySubjectChildArray("economy", ["L1", "L2", "L3", "L4"])) {
      AlertSubjectSettingFirst();
    }
  }
  //英語購入
  //英語は他３科目と違い、英語単体で判定する
  if (isBuySubjectMainArray(["globalenglish"])) {
    alert("英語購入");
    AreaEnglish.show(); //英語エリアを表示
    //初回受講レベル登録時、submitあたりで注意文言を出す
    if (!isBuySubjectChildArray("globalenglish", ["L1", "L2"])) {
      AlertSubjectSettingFirst();
    }
  }

  //【２科目】２科目セット買った時
  if (isBuySubjectMainArray(["twosubjectpack"], true)) {
    //2科目セットの場合は選べるので2科目のプルダウンは抑制しない
    AreaTwoCourse.show(); //2科のプルダウンを表示
    selectOptionByIndex(AreaSingleCourse, 0); //1科目受講
    // // 2科目のプルダウンを変更した時に実行する関数
    function updateAreaOnSelection() {
      var selectedIndex = getSelectElement(AreaTwoCourse).prop("selectedIndex"); // 選択された<option>のインデックスを取得

      // インデックスに基づいて処理を変更
      switch (selectedIndex) {
        case 1:
          // 哲学＋科学
          AreaPhilosophy.show();
          AreaScience.show();
          AreaEconomy.hide();
          break;

        case 2:
          // 科学＋経済
          AreaPhilosophy.show();
          AreaScience.hide();
          AreaEconomy.show();
          break;

        case 3:
          // 科学＋経済
          AreaPhilosophy.hide();
          AreaScience.show();
          AreaEconomy.show();
          break;
        default:
          // デフォルトの処理（必要に応じて）
          AreaPhilosophy.hide();
          AreaScience.hide();
          AreaEconomy.hide();
      }
    }
    //ページロード時に実行
    updateAreaOnSelection();
    //プルダウンを変更した時も実行
    getSelectElement(AreaTwoCourse).on("change", updateAreaOnSelection);

    //初回受講レベル登録時、submitあたりで注意文言を出す
    if (
      !isBuySubjectChildArray("economy", ["L1", "L2", "L3", "L4"]) &&
      !isBuySubjectChildArray("philosophy", ["L1", "L2", "L3", "L4"]) &&
      !isBuySubjectChildArray("science", ["L1", "L2", "L3", "L4"])
    ) {
      getSelectElement(AreaTwoCourse).after(
        "<div class='subject-select-levelnotset'>科目を選択してください</div>"
      );
      AlertSubjectSettingFirst();
    }
  }

  //【３科目】３科目セット買った時
  if (isBuySubjectMainArray(["threesubjectpack"], true)) {
    AreaPhilosophy.show(); //科学を表示
    AreaScience.show(); //哲学を表示
    AreaEconomy.show(); //経済を表示
    //初回受講レベル登録時、submitあたりで注意文言を出す
    if (
      !isBuySubjectChildArray("economy", ["L1", "L2", "L3", "L4"]) &&
      !isBuySubjectChildArray("philosophy", ["L1", "L2", "L3", "L4"]) &&
      !isBuySubjectChildArray("science", ["L1", "L2", "L3", "L4"])
    ) {
      AlertSubjectSettingFirst();
    }
  }
  // 科目の設定を配列で定義
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

  // メッセージの定義
  const messages = {
    levelSet: (ownedLevels) =>
      `<div class="subject-select-levelset">
         現在受講中のレベルは ${ownedLevels.join(", ")}です<br>
         レベルの変更は月末反映となります。即時反映されませんのでご注意ください。
       </div>`,
    levelNotSet:
      '<div class="subject-select-levelnotset">受講レベルを設定してください。</div>',
  };

  // 全科目の処理を一括で行う
  subjectConfigs.forEach(({ subject, area, levels }) => {
    const ownedLevels = getOwnedSubLevels(subject, levels);

    const message =
      ownedLevels.length > 0
        ? messages.levelSet(ownedLevels)
        : messages.levelNotSet;

    getSelectElement(area).after(message);
  });

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
  $('.alert-success').html('変更が保存されました。科目レベルを設定した場合、<a href="https://lms.waomirai.com/my/">受講カレンダー</a>で確認ができます');
   
}


// ==============================
// 汎用的な関数
// ==============================

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
   }
});