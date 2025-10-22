
// ==============================
// 各種変数
// ==============================

const UrlHome = "https://lms.waomirai.com/?redirect=0" //トップページ（科目選択）
const UrlForm = "https://go.waomirai.com/contact-change-subject"; // フォームURL 
const UrlChangeSubject = "https://lms.waomirai.com/user/edit.php"; // 受講変更ページ
const DayChangeCourseBannerStart = 13; // 受講レベル変更・科目変更・解約の締切日通知モーダルの表示開始日（月の前半）
const DayChangeCourseDeadLine = 20; // 受講レベル変更・科目変更・解約の締切日（DayChangeCourseBannerStartより後の日の設定が必要）

const DayDisabledFee = 1; // 受講登録手続きを行えない日

const NowDate = new Date(); // 現在の日時
const DayOfMonth = parseInt(NowDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', day: '2-digit' }).replace('日', '')); // 現在の日
const AmazonGiftFreeCampaignEnd = new Date(2025, 11, 9, 23, 59, 59); // キャンペーン終了日時（2025年10月5日23:59:59）

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
const ImgBannerAmazonGiftFreeCampaignPc = "https://go.waomirai.com/l/1026513/2025-10-20/hy5w7/1026513/1760936849gjyGzZan/banner_free_until_25nov_pc.png"; //バッジの画像
const ImgBannerAmazonGiftFreeCampaignSp = "https://go.waomirai.com/l/1026513/2025-10-20/hy5wj/1026513/1760936850D0Le0rpV/banner_free_until_25nov_sp.png"; //バッジの画像

//次アップ
//2025dec pc https://go.waomirai.com/l/1026513/2025-10-20/hy5wq/1026513/1760936850Q85jpiyV/banner_free_until_25dec_pc.png
//2025dec sp https://go.waomirai.com/l/1026513/2025-10-20/hy5wb/1026513/1760936849yL4umnEM/banner_free_until_25dec_sp.png
//2026jan pc https://go.waomirai.com/l/1026513/2025-10-20/hy5wm/1026513/1760936850Nh1zDBCZ/banner_free_until_26jan_pc.png
//2026jan sp https://go.waomirai.com/l/1026513/2025-10-20/hy5wf/1026513/1760936849Fhrb3Ywf/banner_free_until_26jan_sp.png

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
