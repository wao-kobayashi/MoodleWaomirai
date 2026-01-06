$(document).ready(function () {
  const tenantIdNumber = $("html").data("tenantidnumber");

  // tenantIdNumberごとにsubjectsを定義
  let subjects = [];
  if (tenantIdNumber === "lmswaomirai") {
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

  // ID: 255, 名前: "哲学", キー: "philosophy"
  { id: 255, name: "哲学", key: "philosophy", type: "main" },

  // ID: 265, 名前: "科学", キー: "science"
  { id: 265, name: "科学", key: "science", type: "main" },

  // ID: 260, 名前: "経済", キー: "economy"
  { id: 260, name: "経済", key: "economy", type: "main" },

  // ID: 271, 名前: "3科目セット", キー: "threesubjectpack"
  { id: 271, name: "3科目セット", key: "threesubjectpack", type: "main" },

  // ID: 270, 名前: "2科目セット", キー: "twosubjectpack"
  { id: 270, name: "2科目セット", key: "twosubjectpack", type: "main" },

  // ID: 135, 名前: "グローバル英語", キー: "globalenglish"
  { id: 135, name: "グローバル英語", key: "globalenglish", type: "main" },

  // ==============================
  // 子科目
  // ==============================

  // 哲学に関連する子科目
  { id: 256, name: "哲学 レベル1", key: "philosophy", parentKey: "philosophy", type: "child", level: "L1" },
  { id: 257, name: "哲学 レベル2", key: "philosophy", parentKey: "philosophy", type: "child", level: "L2" },
  { id: 258, name: "哲学 レベル3", key: "philosophy", parentKey: "philosophy", type: "child", level: "L3" },
  { id: 259, name: "哲学 レベル4", key: "philosophy", parentKey: "philosophy", type: "child", level: "L4" },

  // 科学に関連する子科目
  { id: 266, name: "科学 レベル1", key: "science", parentKey: "science", type: "child", level: "L1" },
  { id: 267, name: "科学 レベル2", key: "science", parentKey: "science", type: "child", level: "L2" },
  { id: 268, name: "科学 レベル3", key: "science", parentKey: "science", type: "child", level: "L3" },
  { id: 269, name: "科学 レベル4", key: "science", parentKey: "science", type: "child", level: "L4" },

  // 経済に関連する子科目
  { id: 261, name: "経済 レベル1", key: "economy", parentKey: "economy", type: "child", level: "L1" },
  { id: 262, name: "経済 レベル2", key: "economy", parentKey: "economy", type: "child", level: "L2" },
  { id: 263, name: "経済 レベル3", key: "economy", parentKey: "economy", type: "child", level: "L3" },
  { id: 264, name: "経済 レベル4", key: "economy", parentKey: "economy", type: "child", level: "L4" },

  // グローバル英語に関連する子科目
  { id: 130, name: "グローバル英語 レベル1", key: "globalenglish", parentKey: "globalenglish", type: "child", level: "L1" },
  { id: 138, name: "グローバル英語 レベル2", key: "globalenglish", parentKey: "globalenglish", type: "child", level: "L2" },

  // ==============================
  // 初月無料終了後の科目
  // ==============================

  //用途
  //初月無料期間が終了したことを示すフラグ用の科目。
  { id: 323, name: "trialend", key: "trialend",  type: "flag"},

  // ==============================
  // テスト専用科目（通常ユーザーは購入できない
  // ==============================
  
  //用途
  //動作確認用のテスト講座。
  { id: 283, name: "WAOテスト講座", type: "child" },

  // ==============================
  // admin専用の科目（通常ユーザーは購入できない
  // ==============================

  //用途
  //受講者と管理者ユーザーで挙動を変えたい部分があるので、この講座を持っている人はadminの扱いにする。
  //この講座は表に出ないので一般ユーザーは絶対に受講できない講座
  { id: 277, name: "admin", key: "admin",  type: "role"},

  // ==============================
  // 海外ユーザー専用の科目（通常ユーザーは購入できない
  // ==============================

  //用途
  //国内ユーザーと海外ユーザーで挙動を変えたい部分があるので、この講座を持っている人は海外ユーザーの扱いにする。
  { id: 320, name: "abroad", key: "abroad",  type: "role"}
];


// ==============================
// 各種変数
// ==============================

const UrlHome = "https://lms.waomirai.com/?redirect=0" //トップページ（科目選択）
const UrlSubjectChangeForm = "https://wao.ne.jp/forms/waomirai-changesubject/form.php"; // フォームURL 
const UrlChangeSubject = "https://lms.waomirai.com/user/edit.php"; // 受講変更ページ
const DayChangeCourseBannerStart = 13; // 受講レベル変更・科目変更・解約の締切日通知モーダルの表示開始日（月の前半）
const DayChangeCourseDeadLine = 20; // 受講レベル変更・科目変更・解約の締切日（DayChangeCourseBannerStartより後の日の設定が必要）

const DayDisabledFee = 1; // 受講登録手続きを行えない日

const NowDate = new Date(); // 現在の日時
const DayOfMonth = parseInt(NowDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', day: '2-digit' }).replace('日', '')); // 現在の日
const AmazonGiftFreeCampaignEnd = new Date('2025-12-28T23:59:59+09:00'); // 日本時間

// ==============================
// Liff系
// ==============================

//moodleで友だち追加
const UrlLiffMoodle = "https://liff.line.me/2006716288-lL7QzGA3?loycus_urlc=y7vy" 
const ImgLiffMoodle = "https://waomirai.com/lp/assets/moodle/images/qr_line_bymoodle.png" 

// ==============================
// googleCalender系
// ==============================

const iframeCalenderPhilosophy = "https://calendar.google.com/calendar/embed?src=c_57f70f2fb986aabbb85c2a71ed169e2624e902265abb6dffc1d993f2d781dd4b%40group.calendar.google.com&ctz=Asia%2FTokyo" //哲学
const iframeCalenderScience = "https://calendar.google.com/calendar/embed?src=c_9d34850398ee79fea558cb874c3bebe48860ce3d5fcff5c80f91b203974af452%40group.calendar.google.com&ctz=Asia%2FTokyo" //科学
const iframeCalenderEconomy = "https://calendar.google.com/calendar/embed?src=c_9ee064fdb148232860ebd82900e5222d5060f6702f608257b9d9625d6bcd3a1c%40group.calendar.google.com&ctz=Asia%2FTokyo" //経済
const iframeCalenderEnglish = "https://calendar.google.com/calendar/embed?src=c_379c34d3c8e6716b3458dd339f4531bd8ce07f17c4f97d5fec4367888a692290%40group.calendar.google.com&ctz=Asia%2FTokyo" //グローバル英語

// ==============================
// 授業のメモシート
// ==============================

const memosheetPhilosophy = "https://waomirai.com/lp/assets/moodle/memosheet_philosphy.pdf" //哲学
const memosheetScience = "https://waomirai.com/lp/assets/moodle/memosheet_science.pdf" //科学
const memosheetEconomy = "https://waomirai.com/lp/assets/moodle/memosheet_economy.pdf" //経済


// ==============================
// 画像
// ==============================

const ImgSubjectPhilosophy = "https://waomirai.com/lp/assets/moodle/images/icn_subject_philosophy.svg"; //アイコン：哲学
const ImgSubjectScience = "https://waomirai.com/lp/assets/moodle/images/icn_subject_science.svg"; //アイコン：科学
const ImgSubjectEconomy = "https://waomirai.com/lp/assets/moodle/images/icn_subject_economy.svg"; //アイコン：経済
const ImgSubjectEnglish = "https://waomirai.com/lp/assets/moodle/images/icn_subject_english.svg"; //アイコン：英語
const ImgSubjectOther = "https://waomirai.com/lp/assets/moodle/images/icn_subject_other.svg"; //アイコン：その他
 
const ImgModalBadge = "https://waomirai.com/lp/assets/moodle/images/page_badge_sample.png"; //バッジの画像
const ImgBannerAmazonGiftFreeCampaignPc = "https://go.waomirai.com/l/1026513/2025-12-09/j2yq5/1026513/1765339779a9KBJd13/banner_free_until_26jan_pc.png"; //バッジの画像
const ImgBannerAmazonGiftFreeCampaignSp = "https://go.waomirai.com/l/1026513/2025-12-09/j2yq8/1026513/1765339779zu3eTmW1/banner_free_until_26jan_sp.png"; //バッジの画像

//次アップ
//2025dec pc https://go.waomirai.com/l/1026513/2025-10-20/hy5wq/1026513/1760936850Q85jpiyV/banner_free_until_25dec_pc.png
//2025dec sp https://go.waomirai.com/l/1026513/2025-10-20/hy5wb/1026513/1760936849yL4umnEM/banner_free_until_25dec_sp.png
//2026jan pc https://go.waomirai.com/l/1026513/2025-10-20/hy5wm/1026513/1760936850Nh1zDBCZ/banner_free_until_26jan_pc.png
//2026jan sp https://go.waomirai.com/l/1026513/2025-10-20/hy5wf/1026513/1760936849Fhrb3Ywf/banner_free_until_26jan_sp.png


// ============================
// 購入制限の統合管理
// ============================
/**
 * 購入制限期間の設定
 * 
 * このオブジェクト配列で全ての購入制限を一元管理します。
 * 配列の上から順にチェックされ、最初にマッチした制限が適用されます。
 * 
 * 【優先順位】
 * 1. 特定期間の制限（type: 'period'）← 先に配置
 * 2. 毎月定期メンテナンス（type: 'monthly'）← 後に配置
 * 
 * 【新しい制限期間の追加方法】
 * periods配列に新しいオブジェクトを追加するだけです：
 * { 
 *   start: '開始日時(ISO8601形式)', 
 *   end: '終了日時(ISO8601形式)', 
 *   message: 'ページ下部に表示するHTML',
 *   modalTitle: 'モーダルに表示するタイトル(HTMLタグ可)'
 * }
 */
const PurchaseRestrictions = [
// ----------------------------------------
// 特定期間の制限(優先的にチェック)
// ----------------------------------------
{
    type: 'period', // 制限タイプ：特定期間
    periods: [
        //配列テスト用データ
        { 
        start: '2025-12-10T00:00:00', // 制限開始日時（この時刻から制限開始）
        end: '2025-12-11T11:00:00',   // 制限終了日時（この時刻になったら制限解除）
        // ページ下部に固定表示されるメッセージ（HTML可）
        message: '<div class="disabled-fee-fixed"><span class="icon-disabled-fee-fixed">&#x26a0;&#xfe0f;</span>テスト</div>',
        // 購入ボタンクリック時にモーダルで表示されるタイトル（HTML可）
        modalTitle: 'テスト<br />テストテスト'
        },
        //以下本番運用用データ
        { 
        start: '2025-12-29T00:00:00', // 制限開始日時（この時刻から制限開始）
        end: '2025-12-31T23:59:00',   // 制限終了日時（この時刻になったら制限解除）
        // ページ下部に固定表示されるメッセージ（HTML可）
        message: '<div class="disabled-fee-fixed"><span class="icon-disabled-fee-fixed">&#x26a0;&#xfe0f;</span>システムメンテナンス中です(12/29-1/1)<br class="br-disabled-fee-fixed">お手数ですが、メンテナンス終了後に手続きをお願いします。</div>',
        // 購入ボタンクリック時にモーダルで表示されるタイトル（HTML可）
        modalTitle: 'システムメンテナンス中です(12/29-1/1)<br />お手数ですが、メンテナンス終了後に<br />手続きをお願いします。'
    }
    // ★ 新しい期間を追加する場合は、ここにカンマ区切りで追加
    ]
},
// ----------------------------------------
// 毎月定期メンテナンス(低優先)
// ----------------------------------------
{
    type: 'monthly', // 制限タイプ：毎月X日
    day: DayDisabledFee, // 制限する日（例：28なら毎月28日）
    // 毎月X日に表示されるメッセージ
    message: `<div class="disabled-fee-fixed"><span class="icon-disabled-fee-fixed">&#x26a0;&#xfe0f;</span>毎月${DayDisabledFee}日はシステムメンテナンスのため、受講登録手続きができません。<br class="br-disabled-fee-fixed">お手数ですが、翌日以降に手続きをお願いします。</div>`,
    // 毎月X日のモーダルタイトル
    modalTitle: `毎月${DayDisabledFee}日はシステムメンテナンスのため<br />受講登録手続きができません。<br />お手数ですが、翌日以降に<br />手続きをお願いします。`
}
];

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
// 受講者と管理者ユーザーで挙動を変えたい部分があるので、この講座を持っている人はadminの扱いにする。
// この講座は表に出ないので一般ユーザーは絶対に受講できない講座
const hasBoughtAdminSubject= checkGroup((subject) => subject.key === "admin");

// 初月無料になっているかどうかを判定
// 条件は「typeが'trialend'」であること。
const hasBoughtTrialendSubject = checkGroup((subject) => subject.key === "trialend");

// 管理者ユーザーのみbodyにクラスを付ける
if(hasBoughtAdminSubject){
    $('body').addClass('is-admin-user');
}

// 海外ユーザーの講座を持っているかを判定
 // 国内ユーザーと海外ユーザーで挙動を変えたい部分があるので、海外ユーザーの講座を持っている人は海外ユーザーの扱いにする。
const hasBoughtAbroadSubject= checkGroup((subject) => subject.key === "abroad");

// ==============================
// 海外ユーザーチェック関数
// ==============================
// ユーザーが海外ユーザーかを判定する関数
// 海外ユーザーの講座を持っているか、タイムゾーンが東京以外の場合に海外ユーザーとして判定する
function checkAbroadUser(){
  if(hasBoughtAbroadSubject || Intl.DateTimeFormat().resolvedOptions().timeZone !== 'Asia/Tokyo'){
    return true;
  }else{
    return false;
  }
}

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
          }"${button.blank ? ' target="_blank" rel="noopener noreferrer"' : ""}>${button.text}</a>` // ボタンのHTMLを動的に生成
      )
      .join(""); // ボタンを連結して返す
  };

  // モーダル全体のHTML構造を動的に生成
  const modal = `
    <div class="c-modal"> 
      <div class="c-modal-wrap ${options.wrapClass || ""}">
        ${options.customModalHtml || ""} 
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
  $(".c-modal-wrap-close,.c-modal-wrap-closetxt,.c-modal-wrap-close-tag").on("click", function () {
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
// URLフラグの取得関数
// ==============================

// クエリパラメータ "flag" の値を取得するための関数
// 該当するパラメータが存在しない場合は空文字 "" を返す

function getUrlFlag() {
  return new URLSearchParams(window.location.search).get("flag") || "";
}

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
    const nextMonth = todayMonth === 12 ? 1 : todayMonth + 1;
    $(".c-alert-banner-text-title-nextmonth").text(nextMonth);

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
// ==============================
// ダッシュボードページでのバッジ処理
// bodyId が "page-my-index" の時だけ実行
// ==============================
// 【概要】
// このコードは月次バッジの獲得・表示・管理を行います。
// - 新規獲得バッジを「おめでとうモーダル」で通知（Cookie管理で1回のみ）
// - ダッシュボードに最大6件のバッジカードを表示（7件以上で「もっと見る」）
// - 各バッジに「NEW」ピルを表示（期間内 && 未閲覧の場合）
// - クリックで詳細モーダルを開く（開くとNEWが消える）
// ==============================

if (bodyId === "page-my-index") { // ダッシュボード以外では一切動かさない
  // ===== 設定値 =====
  // 各種定数をCONFIGオブジェクトに集約
  // メンテナンス時はここを編集するだけで全体に反映される
  const CONFIG = {
    // Cookie設定: 365日間有効、サイト全体で共有
    cookieOpts: { expires: 365, path: "/" }, // jQuery Cookieのオプションを一元管理

    // 獲得モーダル表示済みフラグのCookie名プレフィックス
    // 例: "badge_modal_seen_2024-01-sample-title"
    modalPrefix: "badge_modal_seen_", // 獲得モーダル既読管理のキー接頭辞

    // NEWバッジ非表示フラグのCookie名プレフィックス
    // 例: "badge_new_dismiss_2024-01-sample-title"
    newPrefix: "badge_new_dismiss_", // NEWの既読管理のキー接頭辞

    // デフォルト表示件数（「もっと見る」クリック前）
    defaultMaxBadges: 6, // 初期のカード表示上限

    // 獲得モーダルのキラキラエフェクト画像URL
    ImgBadgeShine: "https://waomirai.com/lp/assets/moodle/images/modal-shine.png",
  
    // バッジ画像
    ImgbadgeNewBg: "https://waomirai.com/lp/assets/moodle/images/icon_badge_bgnew.svg",
    ImgbadgeNewType: "https://waomirai.com/lp/assets/moodle/images/text_badge_typenew.svg",
    ImgbadgeDummy: "https://waomirai.com/lp/assets/moodle/images/badge_dummy.svg",

    // トグルボタンのHTML（ここで直接編集可能）
    toggleHtml: {
      more: "<span class='material-symbols material-symbols-outlined'>keyboard_arrow_down</span><span class='text'>全て表示する</span>",
      less: "<span class='material-symbols material-symbols-outlined'>keyboard_arrow_up</span><span class='text'>少なく表示する</span>"
    }
  };

  // ===== Cookie操作 =====
  // jQuery Cookieプラグイン（$.cookie）のラッパー
  // プラグイン未ロード時もエラーを起こさないようガード処理を含む
  const Cookie = {
    // jQuery Cookieプラグインが利用可能かチェック
    isAvailable: () => typeof $.cookie === "function", // 依存を安全に確認

    // Cookieをセット（プラグイン利用可能な場合のみ）
    // @param {string} key - Cookie名
    // @param {string} val - 保存する値（通常 "1" をフラグとして使用）
    set: (key, val) =>
      Cookie.isAvailable() && $.cookie(key, val, CONFIG.cookieOpts), // 利用可能時のみ実行

    // Cookieが "1" にセットされているかチェック
    // @param {string} key - Cookie名
    // @return {boolean} "1" なら true（フラグON）、それ以外は false
    get: (key) => (Cookie.isAvailable() ? $.cookie(key) === "1" : false), // 未読= false の判定に使用

    // Cookieを削除
    // 注意: $.removeCookie() は path 指定が必要なため CONFIG.cookieOpts を渡す
    remove: (key) =>
      Cookie.isAvailable() && $.removeCookie(key, CONFIG.cookieOpts), // パス一致必須
  };

  // ===== バッジ関連ユーティリティ =====
  const Badge = {
      // バッジを一意に識別するキーを生成
      // フォーマット: YYYY-MM-pluginfile-id（例: 2024-01-2650）
      // 
      // @param {number} y - 年
      // @param {number} m - 月
      // @param {string} imgPath - バッジ画像パス
      // @param {string} title - バッジタイトル（フォールバック用）
      // @return {string} 正規化されたキー
      // 
      // 処理:
      // 1. 画像パスから pluginfile.php/の次の数値（ID）を抽出
      // 2. 抽出失敗時はタイトルから正規化したキーを生成
      makeKey: (y, m, imgPath, title) => {
        const yearMonth = `${y}-${String(m).padStart(2, "0")}`;
        
        // pluginfile.php/の次の数値を抽出（例: pluginfile.php/2650/... → 2650）
        const match = String(imgPath).match(/pluginfile\.php\/(\d+)/);
        
        if (match && match[1]) {
          // ID抽出成功
          return `${yearMonth}-${match[1]}`;
        }
        
        // ID抽出失敗時はタイトルから生成（フォールバック）
        const normalizedTitle = title
          .toLowerCase() // 小文字化
          .replace(/\s+/g, "-") // 空白をハイフンに
          .replace(/[^\w\-ぁ-んァ-ヶ一-龠]/g, ""); // 許可文字以外を除去
        
        return `${yearMonth}-${normalizedTitle}`;
      },

      // Cookie名を生成（プレフィックス + バッジキー）
      // @param {string} prefix - modalPrefix or newPrefix
      // @param {Object} badge - バッジオブジェクト
      cookieKey: (prefix, badge) =>
        prefix + Badge.makeKey(badge.year, badge.month, badge.img, badge.title), // 画像パスとタイトルを使用

      // バッジタイトルをパースして構造化データに変換
      // 入力例: "2024年 1月： サンプルタイトル"
      // 
      // @param {string} raw - 元のタイトル文字列
      // @return {Object|null} パース成功時は構造化データ、失敗時は null
      // 
      // 戻り値の構造:
      // {
      //   year: 2024,
      //   month: 1,
      //   title: "サンプルタイトル",
      //   dateLabel: "2024年1月",
      //   start: Date,  // NEW期間開始: 当月1日 0:00
      //   end: Date     // NEW期間終了: 翌月15日 0:00
      // }
      parseTitle: (raw) => {
        // 正規表現で年・月・タイトルを抽出
        // パターン: "YYYY年 M月： タイトル"（空白は任意）
        const m = String(raw)
          .trim() // 前後空白除去
          .match(/^(\d{4})年\s*(\d{1,2})月\s*[:：]\s*(.+)$/); // 年・月・タイトルをキャプチャ

        if (!m) return null; // 想定外フォーマットはスキップ対象

        const [, year, month, title] = m; // 正規表現のグループ展開
        const y = parseInt(year, 10); // 数値化（安全のため基数10）
        const mo = parseInt(month, 10);

        return {
          year: y,
          month: mo,
          title: title.trim(), // タイトル内の前後空白も除去
          dateLabel: `${y}年${mo}月`, // UI表示用ラベル
          // NEW表示期間: 当月1日〜翌月5日
          // 注意: Dateコンストラクタの月は0始まりなので mo - 1
          start: new Date(y, mo - 1, 1), // NEW判定の下限
          end: new Date(y, mo, 15), // NEW判定の上限（翌月15日 0:00）
        };
      },

      // NEW表示期間内かチェック（start <= now < end）
      // @param {Date} start - 期間開始
      // @param {Date} end - 期間終了
      // @param {Date} [now] - 現在日時（省略時は実際の現在時刻）
      isInNewWindow: (start, end, now = new Date()) => now >= start && now < end, // 半開区間で比較

      // バッジ画像URLを取得（無い場合はダミーSVGを返す）
      // @param {string} src - 画像URL
      // @return {string} 有効な画像URL（data URI含む）
      getImgSrc: (src) =>
        src || CONFIG.ImgbadgeDummy, // ← ダミー画像用のURLを使用

      // DOM（ul.badges li）から全バッジ情報を収集
      // @return {Array<Object>} バッジオブジェクトの配列
      // 
      // 各バッジの構造:
      // {
      //   year, month, title, dateLabel, start, end,  // parseTitle() から
      //   index: 0,        // DOM順序（0始まり）
      //   raw: "...",      // 元のタイトル文字列
      //   img: "http://...", // 画像URL
      //   href: "#"        // リンク先URL
      // }
      collectAll: () => {
        const list = []; // 結果の蓄積配列

        $("ul.badges li").each(function (idx) { // 各<li>を順に処理（idxはDOM順）
          const $li = $(this);
          const $a = $li.find("> a").first(); // 直下の<a>を採用（ネスト対策）

          // タイトル取得（優先順位: a[title] > .badge-name のテキスト）
          const rawTitle =
            $a.attr("title") || $li.find(".badge-name").first().text() || ""; // どれも無ければ空

          const parsed = Badge.parseTitle(rawTitle); // タイトルを構造化

          // パース失敗時は警告を出してスキップ
          if (!parsed) {
            console.warn("[WARN] バッジ形式不正（スキップ）:", rawTitle); // 運用時の検知用ログ
            return; // この<li>は無視
          }

          list.push({
            ...parsed, // year/month/title等を展開
            index: idx, // DOM順を保持（ソートやdata属性に使用） // ← 例の位置にコメント
            raw: rawTitle, // 元文字列（デバッグやalt表示に使用） // ← 例の位置にコメント
            img: $li.find("img.badge-image").first().attr("src") || "", // サムネURL。無ければ空文字 // ← 例の位置にコメント
            href: $a.attr("href") || "#", // 詳細リンク。欠損時はダミー # // ← 例の位置にコメント
          });
        });

        return list; // 収集結果を返す
      },
  };

  // ===== モーダル表示 =====
  // グローバル関数 createModal() を使用する前提
  const Modal = {
    // 獲得モーダルを表示（新規獲得バッジがあれば順次表示）
    // @param {Date} [now] - 現在日時
    // 
    // 処理フロー:
    // 1. 全バッジを取得
    // 2. NEW期間内 && モーダル未表示のバッジを抽出
    // 3. 1つずつモーダル表示（「確認」押下で次へ）
    // 4. 表示済みをCookieに記録
    showAcquired: (now = new Date()) => {
      const list = Badge.collectAll(); // 現在のDOMから一覧生成

      // 表示対象: NEW期間内 かつ モーダル未表示
      const targets = list
        .filter((b) => {
          const inWindow = Badge.isInNewWindow(b.start, b.end, now); // ← 例の位置にコメント（NEW期間判定）
          const seen = Cookie.get(Badge.cookieKey(CONFIG.modalPrefix, b)); // すでに「獲得モーダル」出したか
          return inWindow && !seen; // 条件を満たすものだけ残す
        })
        .sort((a, b) => a.index - b.index); // DOM順にソート（表示順の安定化）

      if (!targets.length) return; // 対象なしなら何もしない

      // 再帰的に1つずつモーダルを表示
      const showNext = (index) => {
        if (index >= targets.length) return; // すべて表示済み

        const badge = targets[index];
        const imgSrc = Badge.getImgSrc(badge.img); // 欠損時はダミーSVGにフォールバック

        // キラキラエフェクト用の要素を8個生成
        // CSSで shine01〜shine08 のアニメーションが定義されている前提
        const shineElements = Array.from(
          { length: 8 },
          (_, i) =>
            `<div class="badge-acquired-head-shine shine0${i + 1}">
            <img src="${CONFIG.ImgBadgeShine}" alt="">
          </div>`
        ).join(""); // 事前にHTML文字列をまとめて生成（DOM操作最小化）

        const html = `
          ${shineElements}
          <div class="badge-acquired-head"></div>
          <div class="badge-acquired-image">
            <img src="${imgSrc}" alt="${badge.raw}">
          </div>
          <h2 class="c-modal-wrap-title">
            おめでとうございます！<br />新しいバッジを獲得しました
          </h2>
          <a class="c-modal-wrap-button c-modal-wrap-close-tag badge-acquired-next-btn">確認しました</a>
        `;

        // 表示済みフラグをCookieに記録（次回訪問時は表示されない）
        Cookie.set(Badge.cookieKey(CONFIG.modalPrefix, badge), "1"); // ここで即時既読化

        const modal = createModal({
          wrapClass: `badge-acquired-event badge-acquired badge-acquired-${index}`, // 個別クラスでデバッグ容易化
          customModalHtml: html, // 既存のモーダルユーティリティに委譲
        });

        // 紙吹雪エフェクト（canvas-confetti ライブラリ）
        confetti({
          colors: ["#FCAF17", "#B6D43E", "#28AFE7", "#AA68AA"], // ブランドカラー想定
          particleCount: 200, // 粒子数
          spread: 120, // 拡がり
          origin: { y: 0.6 }, // 発生位置（下寄り）
          zIndex: 1000, // モーダルより前面に
          ticks: 50, // 寿命
          drift: 3, // 風のような流れ
        });

        // 「確認しました」押下で次のモーダルへ
        // .one() で1回だけ実行（多重クリック防止）
        $(".badge-acquired-next-btn").one("click", function () {
          modal?.close(); // モーダルを閉じる（存在チェック込み）
          setTimeout(() => showNext(index + 1), 300); // 次を短い間隔で表示（連打防止）
        });
      };

      showNext(0); // 先頭から開始
    },

    // バッジ詳細モーダルを表示
    // @param {Object} badge - バッジオブジェクト
    // @param {boolean} [hadNew=false] - NEWバッジ付きだったか
    // 
    // hadNew=true の場合:
    // - NEWを「非表示にした」フラグをCookieに保存
    // - DOMからNEWアイコンを即座に削除
    // → 次回以降はこのバッジにNEWが表示されなくなる（既読化）
    showDetail: (badge, hadNew = false) => {
      if (hadNew) {
        // 既読化処理
        Cookie.set(Badge.cookieKey(CONFIG.newPrefix, badge), "1"); // NEWピルの既読フラグを保存
        $(
          `.dashboard-left-block-wrap-badge-block[data-badge-index="${badge.index}"] .newicon`
        ).remove(); // 画面上から即時削除（体験の一貫性）
      }

      const imgSrc = Badge.getImgSrc(badge.img); // 画像URLの最終決定

      const html = `
        <div class="badge-acquired-image badge-acquired-image-shine">
          <img src="${imgSrc}" alt="${badge.raw}">
        </div>
        <h2 class="c-modal-wrap-title">
          ${badge.dateLabel}<br />${badge.title}
        </h2>
        <a class="c-modal-wrap-button c-modal-wrap-close-tag badge-acquired-next-btn">閉じる</a>
      `;

      const modal = createModal({
        close: true, // ×ボタン有効
        wrapClass: "badge-acquired", // 既存スタイルを再利用
        customModalHtml: html, // HTMLは外部CSS前提で最小限
      });

      // 閉じるボタンのイベント設定
      // 名前空間（.badgeDetailClose）で多重登録を防止
      $(document)
        .off("click.badgeDetailClose") // 既存ハンドラをクリア
        .on(
          "click.badgeDetailClose",
          ".badge-detail-modal .cm-close-btn",
          () => modal?.close() // 安全にクローズ
        );
    },
  };

  // ===== UI レンダリング =====
  const UI = {
    // バッジカード一覧を描画
    // @param {number} [max] - 表示する最大件数
    // @param {Date} [now] - 現在日時（NEW判定用）
    // 
    // 処理フロー:
    // 1. コンテナ要素を取得または生成
    // 2. 全バッジを取得して指定件数に制限
    // 3. 各バッジをカードとして描画（NEW判定含む）
    // 4. 不足分をダミーカードで埋める（レイアウト統一）
    // 5. 表示/非表示の制御
    renderBadges: (max = CONFIG.defaultMaxBadges, now = new Date()) => {
      let $out = $(".dashboard-left-block-wrap-badge-content"); // 既存コンテナの取得
      
      // コンテナが無ければ生成して挿入
      if (!$out.length) {
        $out = $('<div class="dashboard-left-block-wrap-badge-content"></div>'); // 動的生成
        const $badges = $("ul.badges");
        if ($badges.length) {
          $badges.after($out); // 既存リストの直後に配置
        } else {
          $("body").append($out); // 最低限のフォールバック
        }
      }

      const list = Badge.collectAll(); // 最新DOMからリスト化
      const items = list.slice(0, max); // 表示件数に制限
      $out.empty(); // 再描画のためクリア

      // バッジカードを生成
      items.forEach((b) => {
        // NEW表示判定: 期間内 かつ 未閲覧
        const inWindow = Badge.isInNewWindow(b.start, b.end, now); // NEW期間内か
        const dismissed = Cookie.get(Badge.cookieKey(CONFIG.newPrefix, b)); // 既にNEWを消しているか
        const showNew = inWindow && !dismissed; // 表示条件を集約 // ← 例の位置にコメント

        const imgSrc = Badge.getImgSrc(b.img); // 画像URLの最終決定

        // カードDOM生成（data-badge-index で後から特定できるようにする）
        const $card = $(`
          <div class="dashboard-left-block-wrap-badge-block dashboard-left-block-wrap-badge-block-img-clickable" data-badge-index="${b.index}">
            <div class="dashboard-left-block-wrap-badge-block-img">
              ${
                showNew
                  ? `<div class="newicon">
                      <div class="newicon-wrapper">
                        <div class="newicon-type">
                          <img src="${CONFIG.ImgbadgeNewType}" alt="NEW">
                        </div>
                        <div class="newicon-bg">
                         <img src="${CONFIG.ImgbadgeNewBg}" alt="">
                        </div>
                      </div>
                    </div>`
                  : ""
              }
             
                <img src="${imgSrc}" alt="${b.raw}" class="badge-image ">
            </div>
          </div>
        `).on("click", () => {
          // クリックで詳細モーダルを開く（NEWが付いていれば既読化される）
          Modal.showDetail(b, showNew); // ここでhadNewを渡して既読化まで完結
        });

        $out.append($card); // コンテナに追加
      });

      // ダミーカードで穴埋め（グリッドレイアウトを整える）
      for (let i = items.length; i < max; i++) {
        $out.append(`
          <div class="dashboard-left-block-wrap-badge-block">
            <div class="dashboard-left-block-wrap-badge-block-img dashboard-left-block-wrap-badge-block-img-dummy">
               <div class="open-info">
                <div><img src="${CONFIG.ImgbadgeDummy}" class="badge-image" alt=""></div>
                 </div>
               </div>
          </div>
        `); // 件数不足でも高さを維持
      }

      // 全件表示時の奇数調整（2列レイアウト対応）
      if (max > CONFIG.defaultMaxBadges && items.length % 2 === 1) {
        $out.append(`
          <div class="dashboard-left-block-wrap-badge-block" data-badge-index="dummy">
            <div class="dashboard-left-block-wrap-badge-block-img">
            </div>
          </div>
        `); // 余白用ダミーで段落ち防止
      }

      // UI要素の表示/非表示制御
      $(".display-badge").toggle(list.length >= 1); // バッジセクションの可視化
      $(".dashboard-left-block-wrap-badge-readmore").toggle(list.length >= 7); // 7件以上で「全て表示する」
    },

    // 「もっと見る」「表示を元に戻す」トグル機能
    // 
    // 動作:
    // - 初期: 6件表示 + 「もっと見る」
    // - クリック: 全件表示 + 「表示を元に戻す」
    // - 再クリック: 6件表示に戻る
    // 
    // 注意: イベント委譲で動的DOM再生成に対応
    setupToggle: () => {
      let isExpanded = false; // 現在の表示状態フラグ

      $(document).on(
        "click",
        ".dashboard-left-block-wrap-badge-readmore a",
        function (e) {
          e.preventDefault(); // aタグの遷移を抑止

          const list = Badge.collectAll(); // 最新件数を都度取得（動的変化に強い）
          const max = isExpanded ? CONFIG.defaultMaxBadges : list.length; // 状態で上限を切替
          
          UI.renderBadges(max); // 再描画

          $(this).html(isExpanded ? CONFIG.toggleHtml.more : CONFIG.toggleHtml.less); // HTML形式で更新
          isExpanded = !isExpanded; // 状態トグル
        }
      );
    },
  };

  // ===== デバッグ機能 =====
  // 本番では Debug.createButton() の呼び出しを削除
  const Debug = {
    // バッジ関連Cookieを全削除してリロード
    // 獲得モーダルやNEW表示のテストを繰り返し行う際に使用
    clearAllCookies: () => {
      const cookies = document.cookie
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean); // 空要素を除去

      // バッジ関連Cookie（modalPrefix or newPrefix で始まるもの）を抽出
      const targets = cookies.filter(
        (c) =>
          c.startsWith(CONFIG.modalPrefix) || c.startsWith(CONFIG.newPrefix)
      ); // 対象のみ抽出

      if (!targets.length) {
        console.log("[DEBUG] 対象Cookieなし"); // 作業不要の通知
        return;
      }

      // 各Cookieを削除（jQuery Cookie + 生のCookie操作で確実に削除）
      targets.forEach((c) => {
        const name = c.split("=")[0]; // キー名を抽出
        Cookie.remove(name); // プラグイン側で削除
        // 念のため生の操作でも削除（Max-Age=0で即座に無効化）
        document.cookie = `${name}=; Max-Age=0; path=/;`; // ブラウザ実装差吸収
      });

      console.log(
        "[DEBUG] 削除:",
        targets.map((c) => c.split("=")[0])
      );
      alert("バッジCookieをリセットしました"); // 操作フィードバック
      location.reload(); // 状態を反映
    },

    // デバッグボタンを画面左下に配置
    createButton: () => {
      const $btn = $(`
        <button id="badge-debug-btn" style="
          position: fixed;
          bottom: 20px;
          left: 20px;
          z-index: 9999;
          padding: 10px 16px;
          background: #333;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">Cookie削除</button>
      `).on("click", Debug.clearAllCookies); // クリックで一括削除

      $("body").append($btn); // DOMに追加
    },
  };

  // ===== 初期化 =====
  $(function () {
    try {
      const now = new Date(); // NEW判定などの基準時刻

      UI.renderBadges(CONFIG.defaultMaxBadges, now); // 初期描画（6件）
      UI.setupToggle(); // 「もっと見る」トグルを有効化
      Modal.showAcquired(now); // まだ見ていない獲得モーダルを順番に表示

      // デバッグボタン有効化（本番では削除）
      // Debug.createButton(); // 運用時はコメントアウト推奨
    } catch (error) {
      console.error("[ERROR] バッジシステム初期化エラー:", error); // 失敗時の一括ハンドリング
    }
  });
}

// ==============================
// ログイン・サインアップページの処理
// ==============================
if (bodyId === "page-login-signup" || bodyId === "page-login-forgot_password") {
  // ログインページのタイトルを「新規会員登録」に変更
  $(".login-heading").text("新規会員登録");
  $("#id_username_label").append("※好きな文字列で作成いただけます");
  // フォームの各入力フィールドにプレースホルダーを設定
  const placeholders = {
    id_username: "例）waomirai", // ユーザー名のプレースホルダー
    id_email: "例）sample@gmail.com", // メールアドレスのプレースホルダー
    id_email2: "例）sample@gmail.com", // メールアドレス確認のプレースホルダー
    id_lastname: "例）鈴木", // 姓のプレースホルダー
    id_firstname: "例）太郎", // 名のプレースホルダー
    id_profile_field_furigana: "例）スズキタロウ", // フリガナのプレースホルダー
    id_profile_field_postnumber: "例）0000000", // 郵便番号のプレースホルダー
    id_profile_field_wao_membersid: "こちらに会員番号を入れてください", // ワオ未来塾会員番号のプレースホルダー
    id_profile_field_wao_schoolname:  "例）能開⚪︎⚪︎校、Axis⚪︎⚪︎校、オンライン家庭教師", // ワオ未来塾校名のプレースホルダー
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
  $('i.text-danger').replaceWith('*');

  // ログインラッパーの前にロゴを挿入
  const $loginWrapper = $("#page-login-signup .login-wrapper");
  if ($loginWrapper.length) {
    const signupLogoHtml = `
                <div class="signup-logo">
                    <img src="https://waomirai.com/lp/assets/moodle/images/logo_waomirai.svg" style="width: 100%;">
                </div>`;
    $loginWrapper.before(signupLogoHtml);
  }
  //////////////////////////////
  // ID生成ボタンをDOMに追加
  //////////////////////////////
  // 【目的】
  // ユーザ登録フォームなどで、ユーザ名（ID）を自動生成するボタンを追加し、
  // ユーザがワンクリックで一意性の高いIDを入力できるようにする。

  // 1. ユーザ名入力欄（#id_username）の直後に、自動生成ボタンを追加
  $('#id_username').after(
    $('<button/>', {
        type: 'button', // フォーム送信を防ぐための button タイプ
        id: 'generateUserIdBtn', // ボタンのID（イベントバインド用）
        class: 'btn-generate-userid', // 任意のクラス（スタイリング用）
        text: 'ユーザIDを自動生成' // ボタンに表示するテキスト
    })
  );

  // 2. ランダムな英小文字の文字列を生成する関数
  // 【目的】ユーザIDの末尾にユニーク性を出すためのランダム文字列を付加する。
  function getRandomLetters(length) {
      const letters = 'abcdefghijklmnopqrstuvwxyz'; // 使用する文字のセット（英小文字のみ）
      let result = '';
      for (let i = 0; i < length; i++) {
          // 文字セットの中からランダムに1文字選び、結果に追加
          result += letters.charAt(Math.floor(Math.random() * letters.length));
      }
      return result;
  }

  // 3. ユーザIDを生成する関数
  // 【目的】日付・時刻・ランダム文字を組み合わせて一意性の高いユーザIDを生成する。
  function generateUserId() {
      const now = new Date(); // 現在日時を取得

      // 日付部分をYYMMDD形式で生成（例: 25年3月28日 → "250328"）
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');

      // 時間部分をHHmm形式で生成（例: 15時7分 → "1507"）
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');

      // ランダムな3文字の英小文字を生成（例: "xwe"）
      const randomLetters = getRandomLetters(3);

      // すべてを結合してIDにする（例: "2503281507xwe"）
      return year + month + day + hours + minutes + randomLetters;
  }

  // 4. ボタンクリック時の処理を定義
  // 【目的】ユーザがボタンをクリックすると、自動的にIDが生成され、入力欄に反映されるようにする。
  $(document).on('click', '#generateUserIdBtn', function() {
      // ユーザIDを生成
      const userId = generateUserId();

      // 生成したIDを #id_username の入力欄にセット
      $('#id_username')
          .val(userId)         // 値をセット
          .trigger('change')   // 入力変更イベントを発火（他の処理と連携するため）
          .focus();            // 入力欄にフォーカス（視認性向上）

      // コンソールに生成されたIDを出力（デバッグ目的）
      console.log('生成されたユーザID:', userId);
  });

  // 個人情報保護方針と利用規約のリンク設定
  $('label[for="id_profile_field_kojin_check"]').on('click', function() {
    window.open("https://www.wao-corp.com/privacy/", '_blank');
  });

  $('label[for="id_profile_field_termsofservice"]').on('click', function() {
    window.open("https://go.waomirai.com/terms", '_blank');
  });
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
  createModal({
    wrapClass: "c-modal-wrap-wrapline",
    customModalHtml: `
    <div class="c-modal-wrap-close"></div>
    <div class="c-modal-wrap-title">会員登録ありがとうございます！</div>
    <div class="c-modal-wrap-text">
      <span>ワオ未来塾の公式LINEを</span>登録しましょう!<br>
      授業サポートのお知らせをこちらの<br>公式LINEから配信します。
    </div>
    <div class="c-modal-wrap-qr c-sp-hidden">
      <img src="${ImgLiffMoodle}">
    </div>
    <div class="c-modal-wrap-text c-modal-wrap-text-notice">
      ※すでに友だち追加済の方も、<br>
      会員連携のために必ずQRを読み取ってください。
    </div>
    <div class="c-modal-button-line c-pc-hidden">
      <a href="${UrlLiffMoodle}">
        <img src="https://waomirai.com/lp/assets/moodle/images/icn_linewhite.svg">
      </a>
    </div>
    <button class="c-modal-wrap-button c-modal-wrap-button-close c-modal-wrap-close-tag">閉じる</button>
  `
  });
  $(".boxaligncenter h3").text("ご登録ありがとうございます。");
  $(".singlebutton button").text("ワオ未来塾TOPへ");
}

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
// ==============================
// 受講ページで各教科レベルごとに受講(zoom/vimeo)リンクを表示するスクリプト
// ==============================
if (bodyId === "page-mod-questionnaire-view")  {

  // ==============================
  // 授業詳細情報の定義
  // ==============================
  const lessonData = {
    philosophy: {
      L1: {
        day1: "火曜日 18:30〜19:15",
        day2: "金曜日 17:30〜18:15",
        zoomUrl: "https://us02web.zoom.us/j/88212059130?pwd=NDAdLY6CAqExPaOX79CQzXATdViHxL.1",
        vimeoUrl: "https://vimeo.com/event/4920629/embed/7f5f27273a/interaction"
      },
      L2: {
        day1: "火曜日 17:30〜18:15",
        day2: "金曜日 18:30〜19:15",
        zoomUrl: "https://us02web.zoom.us/j/81840052279?pwd=aZAbt4MRnlFZNaoYTEbIApm52fhxB5.1",
        vimeoUrl: "https://vimeo.com/event/4920670/embed/c70000715a/interaction"
      },
      L3: {
        day1: "火曜日 20:30〜21:15",
        day2: "金曜日 19:30〜20:15",
        zoomUrl: "https://us02web.zoom.us/j/86009824056?pwd=StlsSrwAaalh8N8qcOpNvNdnyVEFht.1",
        vimeoUrl: "https://vimeo.com/event/4920676/embed/52c21ef6b0/interaction"
      },
      L4: {
        day1: "火曜日 19:30〜20:15",
        day2: "金曜日 20:30〜21:15",
        zoomUrl: "https://us02web.zoom.us/j/87120983927?pwd=rkwsmySK9a159qQJe1lOGEfqiBQNGc.1",
        vimeoUrl: "https://vimeo.com/event/4920679/embed/ab9c66199d/interaction"
      }
    },
    science: {
      L1: {
        day1: "水曜日 17:30〜18:15",
        day2: "金曜日 18:30〜19:15",
        zoomUrl: "https://us02web.zoom.us/j/89510034444?pwd=7ozebaIqBlIOgieTR49kJRoyrFDbAe.1",
        vimeoUrl: "https://vimeo.com/event/4920693/embed/1419b3b287/interaction"
      },
      L2: {
        day1: "水曜日 18:30〜19:15",
        day2: "金曜日 17:30〜18:15",
        zoomUrl: "https://us02web.zoom.us/j/89630141873?pwd=a7PRiVpzM6tascsJIhfaeM0IzZzZ4X.1",
        vimeoUrl: "https://vimeo.com/event/4920695/embed/022465a73c/interaction"
      },
      L3: {
        day1: "水曜日 19:30〜20:15",
        day2: "金曜日 20:30〜21:15",
        zoomUrl: "https://us02web.zoom.us/j/87568402622?pwd=abT9rondMMl0evsglKUdvik6Q8bldz.1",
        vimeoUrl: "https://vimeo.com/event/4920700/embed/2352ff8d6a/interaction"
      },
      L4: {
        day1: "水曜日 20:30〜21:15",
        day2: "金曜日 19:30〜20:15",
        zoomUrl: "https://us02web.zoom.us/j/88903613273?pwd=haXeQCLEGTkNDAesgHEkcaUJN3gZhi.1",
        vimeoUrl: "https://vimeo.com/event/4920706/embed/489dacd1a2/interaction"
      }
    },
    economy: {
      L1: {
        day1: "水曜日 18:30〜19:15",
        day2: "木曜日 17:30〜18:15",
        zoomUrl: "https://us02web.zoom.us/j/87428876942?pwd=3w0rc9oYpxjT3rzwqqRL3eGWfW9P75.1",
        vimeoUrl: "https://vimeo.com/event/4920714/embed/3ca5539936/interaction"
      },
      L2: {
        day1: "水曜日 17:30〜18:15",
        day2: "木曜日 18:30〜19:15",
        zoomUrl: "https://us02web.zoom.us/j/82241164595?pwd=zHIaAKMHy7Juv3Q3TbqhlT3Wc2yIAz.1",
        vimeoUrl: "https://vimeo.com/event/4920718/embed/84fcf75c13/interaction"
      },
      L3: {
        day1: "水曜日 20:30〜21:15",
        day2: "木曜日 19:30〜20:15",
        zoomUrl: "https://us02web.zoom.us/j/87848451237?pwd=GIkmj2k1fXwaWZF3zACbbrE9sbZX7N.1",
        vimeoUrl: "https://vimeo.com/event/4920725/embed/99a117fd01/interaction"
      },
      L4: {
        day1: "水曜日 19:30〜20:15",
        day2: "木曜日 20:30〜21:15",
        zoomUrl: "https://us02web.zoom.us/j/87011842822?pwd=LAP52Ti6rxfgZ0H8rmbUkrsqY8bo78.1",
        vimeoUrl: "https://vimeo.com/event/4920727/embed/9058c274c5/interaction"
      }
    }
  };

  // ==============================
  // 授業詳細HTMLを生成する関数
  // ==============================

  // Zoomバージョン（2026年1月以降のバージョン）
  function generateLessonHtmlZoom(courseData, lessonInfo) {
    return `
  <div class="course-lesson-wrapper">
    <div class="course-lesson-date">
      ${courseData.name}の授業開催日:「${lessonInfo.day1}」または「${lessonInfo.day2}」<br>
      ※各授業は同じ内容を週に2回配信します。どちらかをご受講ください。
    </div>
    <div class="course-lesson">
      <div class="course-lesson-wrap">
        <div class="course-lesson-wrap-title">
          授業時間になったらボタンを<br class="c-pc-hidden">押して受講してください<br>
          <strong>受講には「Zoom」のインストールが必要です。<br class="c-pc-hidden">
          <a href="https://zoom.us/ja/download" target="_blank">コチラ</a>からインストールしてください。</strong>
        </div>
        <div class="course-lesson-wrap-btn">
          <div><a class="primary" href="${lessonInfo.zoomUrl}" target="_blank">授業を受講する(Zoom)</a></div>
          <div><a class="secondly" data-vimeo-url="${lessonInfo.vimeoUrl}">授業アーカイブを見る</a></div>
        </div>
      </div>
      <div class="course-lesson-bg">
        <img src="https://go.waomirai.com/l/1026513/2024-12-03/h8zc7/1026513/1733275158u05sMlor/movie.svg">
      </div>
    </div>
  </div>
    `;
  }
  // Vimeoのみバージョン（2025年4月~12月のバージョン）
  function generateLessonHtmlVimeoOnly(courseData, lessonInfo) {
    return `
  <div class="course-lesson-wrapper">
    <div class="course-lesson-date">
      ${courseData.name}の授業開催日:「${lessonInfo.day1}」または「${lessonInfo.day2}」<br>
      ※各授業は同じ内容を週に2回配信します。どちらかをご受講ください。
    </div>
    <div class="course-lesson">
      <div class="course-lesson-wrap">
        <div class="course-lesson-wrap-title">
          授業時間になったらボタンを<br class="c-pc-hidden">押して受講してください<br>
        </div>
        <div class="course-lesson-wrap-btn">
          <div><a class="primary" data-vimeo-url="${lessonInfo.vimeoUrl}">授業を受講する</a></div>
        </div>
      </div>
      <div class="course-lesson-bg">
        <img src="https://go.waomirai.com/l/1026513/2024-12-03/h8zc7/1026513/1733275158u05sMlor/movie.svg">
      </div>
    </div>
  </div>
    `;
  }

  // ==============================
  // Vimeoウィンドウを開く関数
  // ==============================
  function openVimeoWindow(vimeoUrl) {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
  
    const newWindow = window.open(
      '',
      '_blank',
      `width=${screenWidth},height=${screenHeight},top=0,left=0`
    );
  
    newWindow.document.open();
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>授業アーカイブ</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden;
            height: 100vh;
            width: 100vw;
          }
          .video-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .video-container iframe {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div class="video-container">
          <iframe src="${vimeoUrl}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
        </div>
      </body>
      </html>
    `);
    newWindow.document.close();
  }

  // ==============================
  // メイン処理
  // ==============================
  $(document).ready(function() {
    const $targetElement = $("#js-lesson-detail-mod-questionnaire");
    
    // 対象要素が存在しない場合は処理を終了
    if ($targetElement.length === 0) {
      return;
    }

    // currentViewCourseDataが存在し、必要な情報が揃っているか確認
    if (!currentViewCourseData || !currentViewCourseData.key || !currentViewCourseData.level) {
      console.warn("授業情報を取得できませんでした。");
      return;
    }

    // lessonDataから該当する授業情報を取得
    const lessonInfo = lessonData[currentViewCourseData.key]?.[currentViewCourseData.level];

    if (!lessonInfo) {
      console.warn(`授業情報が見つかりません: ${currentViewCourseData.key} ${currentViewCourseData.level}`);
      return;
    }

    // HTMLを生成して挿入
    //現在はZoom(+Vimeo)版を挿入
    const html = generateLessonHtmlZoom(currentViewCourseData, lessonInfo);
    $targetElement.html(html);

    // Vimeoボタンのイベントリスナーを設定
    $targetElement.on("click", "[data-vimeo-url]", function(e) {
      e.preventDefault();
      const vimeoUrl = $(this).data("vimeo-url");
      openVimeoWindow(vimeoUrl);
    });
  });
}

// ==============================
// 受講ページの表示ロジック
// ==============================


  // 「レベル」リンクのhrefを格納する変数（最初はnull）
  let levelLink = null;

  // 「3週目」が ol.breadcrumb li のどこかに含まれているか確認
  let hasWeek3 = false;

  // 「3週目」が ol.breadcrumb li のどこかに含まれているか確認
  let breadcrumbEnglish = false;

  $('ol.breadcrumb li').each(function() {
    const $li = $(this);
    if ($li.text().includes('3週目')||$li.text().includes('３週目') ) {
      hasWeek3 = true;
      return false; // 見つかったらループ終了
    }
    if ($li.text().includes('英語') ) {
      breadcrumbEnglish = true;
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
    if (breadcrumbEnglish) {
      $(".surveyTitle").after('<p class="surveyText">今月の課題を提出するとバッジが手に入ります！受講カレンダーで確認してみましょう。</p>')
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

// // ==============================
// // カテゴリページの処理
// // ==============================
if (bodyId === "page-course-index-category") {
  window.location.href = "https://lms.waomirai.com/";
}

// ==============================
// 科目ページの処理
// ==============================
// ページIDが'page-course-view-flexsections',page-course-view-topicsかつ管理者でない場合に実行
if (
  (bodyId === "page-course-view-flexsections" || bodyId === "page-course-view-topics") 
  && !hasBoughtAdminSubject
) {
  //moodle 4.5対応 クローズしているブロックをすべて開く
  $('.course-content a[role="button"]').each(function(index) {
    var $btn = $(this);
    var targetId = $btn.attr('aria-controls');
    var $target = $('#' + targetId);

    // aria-expanded を true に変更
    $btn.attr('aria-expanded', 'true');

    // collapsed クラスを削除
    $btn.removeClass('collapsed');

    // 対応する collapse 要素を開く
    $target.addClass('show');
  });


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
          var href = $(this).find('.stretched-link').attr('href');
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


// キャンペーンのモーダル関数
function showCampaignModal() {
  createModal({
    title: "おめでとうございます！",
    wrapClass: "c-modal-wrap-wrap-campaign",
    text: "<b>キャンペーンを<br />適用させていただきます。</b><br /><br />2025年11・12月は無料で受講いただけます。<br />2025年12月も受講いただけたら<br />Amazonギフト券5000円プレゼントいたします。<br />",
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
  let isAlertSubjectSettingFirstShown = false; // フラグを追加

  function AlertSubjectSettingFirst() {
    if (!isAlertSubjectSettingFirstShown) { // フラグがfalseの場合のみ実行
      $("#fgroup_id_buttonar").before(
        `<div id="id_submitbutton-subject">一度受講レベルを設定すると、2回目以降のレベル変更時の反映は当月末になりますのでご注意くださいませ。</div>`
      );
      //英語と他科目を受講する場合、複数回発火することを防ぐためにフラグをtrueに設定
      isAlertSubjectSettingFirstShown = true; // フラグをtrueに設定
    }
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

  //見出し直下にテキストを表示。
  if (hasBoughtMainSubject) {
    //メイン科目持っている時
    $("#id_category_10 > .d-flex").after(`
      <p class="subject-level-note">
        受講科目のレベルを選択してください。<br />
        選択した科目のレベルを設定しないと授業を受けることができません。<br />
        一度受講レベルを設定すると、2回目以降のレベル変更時の反映は当月末になりますのでご注意ください。
      </p>
    `);
    
  } else {
    //メイン科目がない時
    $("#id_category_10 > .d-flex").after(`
      <p class="subject-level-note">
        科目を購入した後に受講科目レベルを設定することができます。<br />
        科目の一覧は<a href="${UrlHome}" style="text-decoration:underline !important;">コチラ</a>からご確認いただけます。
      </p>
    `);
  }
    // 経済L3,L4を削除
  ['Level3　（中学生対象）', 'Level4　（高校生対象）'].forEach(function(label) {
    AreaEconomy.find('option:contains("' + label + '")').remove();
  });
  AreaEconomy.find('select').after('<div style="color:#999; font-size:12px; margin:10px 0 -10px;">経済レベル3/4は2026年1月〜3月は募集停止中です</div>');
}


// ==============================
// カテゴリページの処理
// ==============================
if (bodyId === "page-user-profile") {
    
    $('.alert-success').html('変更が保存されました。科目レベルを設定した場合、<a href="https://lms.waomirai.com/my/">受講カレンダー</a>で確認ができます');  
   
    // 非表示にしたいキーワードの配列（OR条件）
    // ここで非表示にしている項目
    // ログイン活動：ログイン履歴（これはユーザーにとっては不要な情報）
    // レポート：意味のないレポート（これはユーザーにとっては不要な情報）
    // ジョブ：ジョブ情報（これはユーザーにとっては不要な情報）
    // Stripe退会するための情報（これはユーザーにとっては不要な情報）
    // 補足：stripeは金額は確認できるようにして、退会するための情報は非表示にしたほうがいいかも
    const hideKeywords = ['レポート', 'ジョブ', 'Stripe'];

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
    // ステップ1: profile_treeクラス内のnode_categoryクラスを持つすべてのセクションを取得
    const $sections = $('.profile_tree .node_category');
    
    // ステップ2: 各セクションを順番にチェック
    $sections.each(function() {
      // ステップ3: 現在のセクション内からh3要素を検索
      const $h3 = $(this).find('h3');
      
      // ステップ4: h3要素が存在し、そのテキストに「その他」が含まれているかを確認
      if ($h3.length > 0 && $h3.text().includes('その他')) {
        // ステップ5: 挿入するカスタムHTMLを作成
        const lineConnectHTML = `
        <section class="node_category card d-inline-block w-100 mb-3 line-connection-seciton">
          <div class="card-lineimg">
            <img src="https://waomirai.com/lp/assets/moodle/images/page_mypage_line.png">
          </div>
          <div class="card-body">
              <a class="line-button triger-line-integration-modal">いますぐLINE連携する</a>
          </div>
        </section>`;
              
        // 「その他」を含むセクションの直後にLINE連携セクションを挿入
        $(this).after(lineConnectHTML);
              
        
        // ステップ7: 最初に見つかった「その他」セクションの後に挿入したら処理を終了
        // (複数の「その他」セクションがある場合は最初の1つだけに対応)
        return false; // eachループを終了（jQueryのeachでは、falseを返すとループが中断される）
      }
    });
}


// ==============================
// サイト共通のイベント登録
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

$(function() {
  // ツールチップの開閉
  $('.open-info').on('click', function(e) {
      const $clicked = $(this);
      
      // 他のツールチップを閉じる
      $('.open-info').not($clicked).removeClass('active').find('.tooltip').removeClass('show');
      
      // クリックしたものをトグル
      $clicked.toggleClass('active').find('.tooltip').toggleClass('show');
  });
  
  // 外側クリックで閉じる
  $(document).on('click', function(e) {
      // クリックされた要素が .open-info または .tooltip の中でない場合のみ閉じる
      if (!$(e.target).closest('.open-info').length && 
          !$(e.target).closest('.tooltip').length) {
          $('.open-info').removeClass('active');
          $('.tooltip').removeClass('show');
      }
  });
});   }
});