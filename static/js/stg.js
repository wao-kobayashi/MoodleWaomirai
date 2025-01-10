// 検証テナントの変数定義
const SubjectIds = {
  SubjectMain: {
      philosophy: { id: 212, name: '哲学', key:'philosophy' },
      science: { id: 211, name: '科学', key:'science' },
      economy: { id: 213, name: '経済', key:'economy' },
      ThreeSubjectPack: { id: 229, name: '3科目セット', key:'threesubjectpack' },
      TwoSubjectPack: { id: 228, name: '2科目セット',  key:'twosubjectpack' },
      GlobalEnglish: { id: 236, name: 'グローバル英語', key:'globalenglish' },
  },
  SubjectChild: {
      philosophy: {
          ph_L1: { id: 221, name: '哲学 L1', key:'philosophy' },
          ph_L2: { id: 225, name: '哲学 L2', key:'philosophy'},
          ph_L3: { id: 242, name: '哲学 L3', key:'philosophy' },
          ph_L4: { id: 243, name: '哲学 L4', key:'philosophy'}
      },
      science: {
          sc_L1: { id: 223, name: '科学 L1', key:'science'  },
          sc_L2: { id: 222, name: '科学 L2', key:'science'  },
          sc_L3: { id: 244, name: '科学 L3', key:'science'  },
          sc_L4: { id: 245, name: '科学 L4', key:'science'  }
      },
      economy: {
          ec_L1: { id: 226, name: '経済 L1', key:'economy' },
          ec_L2: { id: 227, name: '経済 L2', key:'economy' },
          ec_L3: { id: 246, name: '経済 L3', key:'economy' },
          ec_L4: { id: 247, name: '経済 L4', key:'economy' }
      },
      GlobalEnglish: {
          en_L1: { id: 253, name: 'グローバル英語 L1', key:'globalenglish'  },
          en_L2: { id: 254, name: 'グローバル英語 L2', key:'globalenglish'  },
      },
  },
 
  Programming: { id: 235, name: 'プログラミング', key:'programming' }
};

$(document).ready(function() {
    const tenantIdNumber = $("html").data("tenantidnumber");
    if (tenantIdNumber === "stg") {



////////////////////////////
// すでに購入しているコースの判定
////////////////////////////
const bodyId = $("body").attr("id");
const bodyClasses = $("body")
    .attr("class")
    .split(" ")
    .map(cls => parseInt(cls.replace("course-id-", "").trim()));

////////////////////////////////////////////////
// 汎用的な科目チェック関数
////////////////////////////////////////////////

// 汎用的なグループチェック関数
function checkGroup(subjectIds) {
  return Object.values(subjectIds).some(id => bodyClasses.includes(id.id)); //someは1個でも要素があればtrueを返す
}

/// メイン科目いずれかに属しているかの関数
const isBuySubjectMain = checkGroup(SubjectIds.SubjectMain); //メイン科目、いずれか購入しているか

/// サブ科目（L1~L4)いずれかに属しているかの関数
const isBuySubjectChild = ['philosophy', 'science', 'economy', 'GlobalEnglish'].some(subject => checkGroup(SubjectIds.SubjectChild[subject])); //サブ科目、いずれか設定しているか

/// プログラミングを受講しているかどうかの関数
const isBuyProgramming = bodyClasses.includes(SubjectIds.Programming.id); //プログラミングの科目を買っているかどうか

// 複数のレベルをまとめてチェックする関数(メイン科目)
//trueの時はeveryで全てを条件に
function isBuySubjectMainArray(subjectKeys, isAllRequired = false) {
    const checkMethod = isAllRequired ? 'every' : 'some';  // isAllRequiredがtrueならeveryを、falseならsomeを使う
    return subjectKeys[checkMethod](subjectKey => {
      const subject = SubjectIds.SubjectMain[subjectKey];
      if (!subject) return false; // 指定された科目が存在しない場合はfalseを返す
      console.log('Checking subject:', subject);
      return bodyClasses.includes(subject.id); // mainLevelがbodyClassesに含まれているか確認
    });
  }


// 複数のレベルをまとめてチェックする関数(サブ科目)
function isBuySubjectChildArray(subject, levels) {
  const subjectGroup = SubjectIds.SubjectChild[subject];
  if (!subjectGroup) return false; // グループが存在しない場合はfalse
  return levels.some(level => subjectGroup[level] && bodyClasses.includes(subjectGroup[level].id));
}      
      

if (isBuySubjectChildArray('science', ['sc_L1', 'sc_L3'])) {
  alert('科学 L1 または L3 に該当します。');
}

////////////////////////////
// 今見ているページコースの判定
////////////////////////////

// 現在のページのコースIDを取得
function getCurrentCourseId() {
  const bodyClass = document.body.className;
  const match = bodyClass.match(/course-(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// コースIDから該当の科目データを取得
function findCourseById(courseId, data) {
  for (const key in data) {
    // データがオブジェクトであり、idが一致する場合
    if (typeof data[key] === 'object' && data[key].id === courseId) {
      return { category: key, course: data[key] };
    }
    // データがオブジェクトでネストされている場合、再帰的に検索
    if (typeof data[key] === 'object') {
      const nestedResult = findCourseById(courseId, data[key]);
      if (nestedResult) return nestedResult;
    }
  }
  return null;
}

// ユーティリティ関数: 値からキーを取得
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

const CurrentViewCourseId = getCurrentCourseId();
if (!CurrentViewCourseId) {
  return console.error('コースIDが見つかりませんでした。');
}

const CurrentViewCourseData = findCourseById(CurrentViewCourseId, SubjectIds);

if (CurrentViewCourseData) {
  console.log(`現在のコース: ${CurrentViewCourseData.course.name} (カテゴリ: ${CurrentViewCourseData.category})`);
} 



// ==============================
// ダッシュボードページでの処理
// ==============================
if (bodyId === "page-my-index") {

    /////////////////////////////////////
    ///初期表示状態
    ////////////////////////////////////
  
    //何も受講していない時は、科目勝手欲しい要素出す
    if (!isBuySubjectMain && !isBuySubjectChild && !isBuyProgramming) {
      $("#todays-event-subject-none,#dashboard-main-upcoming-class-none").show();
      $('#todays-subject-pc').hide();  
    
    } else { 
      if ($(window).width() >= 768) {
        $(".dashboard-main-class").hide();
      }
    }
    ////////////////////////////
    // 受講中科目の処理
    ////////////////////////////

    function renderSubject(subject, icon, isBuySubjectMain) {
        // SubjectMain の場合のリンクを変更
        const courseLink = isBuySubjectMain ?
            `https://lms.waomirai.com/admin/tool/catalogue/courseinfo.php?id=${subject.id}` :
            `https://lms.waomirai.com/course/view.php?id=${subject.id}`;
        return `
            <a href="${courseLink}" class="dashboard-left-block-subject-child ${subject.key}">
                <div class="dashboard-left-block-subject-child-icon">${icon}</div>
                <div class="dashboard-left-block-subject-child-text">
                    <div>${subject.name}</div>
                </div>
            </a>
        `;
    }

    // アイコンの取得（SubjectMain & SubjectChild 用）
    const getIcon = (subject) => {
        if (subject.name.includes('哲学')) return "&#x1f4D6;"; // 📖
        if (subject.name.includes('科学')) return "&#x1f52C;"; // 🔬
        if (subject.name.includes('経済')) return "&#x1f4B0;"; // 💰
        if (subject.name.includes('英語')) return "&#x1f4ac;"; // 📖
        if (subject.name.includes('プログラミング')) return "&#x1f52C;"; // 🔬
        return "&#x1f9ea;"; // デフォルト
    };

    // メイン科目（SubjectMain）の処理
    // メモ：この関数うまくいかないようだったら切り離したい。サブ科目だけ
    if (isBuySubjectMain) {
         console.log("メイン科目（SubjectMain）に該当しています");
         // サブ科目が存在するか確認する関数
         function hasRelatedChildSubject(subjectKey) {
            const childSubjects = SubjectIds.SubjectChild[subjectKey];
            if (!childSubjects) return false;

            return Object.values(childSubjects).some(child => bodyClasses.includes(child.id));
          }

             const subjectMainNames = Object.entries(SubjectIds.SubjectMain)
            .filter(([key, subSubject]) => {
                // サブ科目が存在する場合、メイン科目をスキップ
                const hasChild = hasRelatedChildSubject(key);
                if (hasChild) {
                    console.log(`スキップ: サブ科目が存在するため ${subSubject.name}`);
                    return false;
                }
                return bodyClasses.includes(subSubject.id);
            })
            .map(([key, subSubject]) => renderSubject(subSubject, getIcon(subSubject), true)) // true を渡してSubjectMain用のリンクにする
            .join("");

        if (subjectMainNames) {
            $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(subjectMainNames);
        }
    }

    // 詳細科目（SubjectChild）の処理
    if (isBuySubjectChild) {
        console.log("詳細科目（SubjectChild）に該当しています");
        const subjectChildNames = [];
        ['philosophy', 'science', 'economy', 'GlobalEnglish'].forEach(subjectKey => {
            Object.values(SubjectIds.SubjectChild[subjectKey])
                .filter(subSubject => bodyClasses.includes(subSubject.id))
                .forEach(subSubject => {
                    subjectChildNames.push(renderSubject(subSubject, getIcon(subSubject), false)); // false を渡して通常のリンクにする
                });
        });
        if (subjectChildNames.length > 0) {
            $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(subjectChildNames.join(""));
        }
    }


    // プログラミング（Programming）の処理
    if (isBuyProgramming) {
        console.log("プログラミングに該当しています");
        $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(renderSubject(SubjectIds.Programming, getIcon(SubjectIds.Programming), false));
    }

    // どの科目にも該当しない場合のエラーハンドリング
    if (!isBuySubjectMain && !isBuySubjectChild &&  !isBuyProgramming) {
        console.error("指定された科目に該当しません");
        // 特定のHTMLを指定要素に挿入する

        const errorHtml = `
        <div class="dashboard-left-block-subject-child">
            <p>受講している科目がありません。</p>
        </div>
    `;
        $('.dashboard-left-block-wrap.dashboard-left-block-wrap-subject').html(errorHtml); // 挿入先要素（例: .target-container）にHTMLを挿入
    }
    // .dashboard-leftの内容を取得してclone
    var contentToClone = $('.dashboard-left').clone();

    // #page-content直下に配置
    var wrappedContent = $('<div>', { id: 'dashboard-sp-content', class: 'c-pc-hidden' }).append(contentToClone);

    // #page-content直下に配置
    $('#page-content').append(wrappedContent);  
  
    /////////////////////////////////////
    ///カレンダー
    ////////////////////////////////////
    let executed = false;  // 初回実行を管理するフラグ
  
    // ロジックを関数として定義（共通化）
    function executeCalendarLogic() {
        console.log('カレンダーロジックを実行します。');

        const today = new Date();
        const todayDay = today.getDate();
        const todayMonth = today.getMonth() + 1; // 月は0から始まるので1を加える
        const todayYear = today.getFullYear();
        let eventFound = false;
        let eventDetails = [];
        let flagTodaysCalendar = false;

        // .calendarwrapper内のロジックを実行（全イベントに色変更を適用）
        $('.day').each(function() {
            const $cell = $(this);
            const cellDay = parseInt($cell.attr('data-day'), 10); // カレンダーの日付
            const cellMonth = parseInt($cell.attr('data-month'), 10); // カレンダーの月
            const cellYear = parseInt($cell.attr('data-year'), 10); // カレンダーの年

            // 色変更ロジック（すべてのイベントに適用）
            const $dayContent = $cell.find('[data-region="day-content"]');
            if ($dayContent.length > 0) {
                const $events = $dayContent.find('li a[data-action="view-event"]');
                $events.each(function() {
                    const $eventLink = $(this);
                    const courseName = $eventLink.text().trim();
                    console.log(`Course Name: ${courseName}`);

                    // 色変更ロジック
                    if (courseName.includes('経済')) {
                        console.log('経済が見つかりました。背景色を青に変更します。');
                        $eventLink.attr('style', 'background: #AA68AA !important; border-left: #008EC9 2px solid !important;');
                    } else if (courseName.includes('科学')) {
                        console.log('哲学が見つかりました。背景色を緑に変更します。');
                        $eventLink.attr('style', 'background: #B6D43E !important; border-left: #96B128 2px solid !important;');
                    } else if (courseName.includes('哲学')) {
                        console.log('哲学が見つかりました。背景色をオレンジに変更します。');
                        $eventLink.attr('style', 'background: #FCB72E !important; border-left: #E98800 2px solid !important;');
                    } else if (courseName.includes('英語')) {
                        console.log('英語が見つかりました。背景色を紫に変更します。');
                        $eventLink.attr('style', 'background: #AA68AA !important; border-left: #8D3A8D 2px solid !important;');
                    } else {
                        console.log('条件に一致しない科目: ', courseName);
                    }
                });
                

            }

            // 今日の日付に一致するイベントがあれば、そのイベント詳細を収集
            if (cellDay === todayDay && !executed) {
                console.log('今日の日付に一致しました:', { cellDay, cellMonth, cellYear });

                const $dayContent = $cell.find('[data-region="day-content"]');
                if ($dayContent.length > 0) {
                    const $events = $dayContent.find('li a[data-action="view-event"]');
                    $events.each(function() {
                        var courseName = $(this).text().trim();
                        eventDetails.push(courseName);
                        console.log('今日のイベント: ' + courseName);
                
                        // 新しい要素を作成
                        var $lessonContainer = $('<div>', { 'class': 'dashboard-main-class-content-lesson' });
                        var $lessonTitle = $('<div>', { 'class': 'dashboard-main-class-content-lesson-title', 'text': courseName });
                        var $lessonLink = $('<a>', { 
                            'class': 'dashboard-main-class-content-lesson-button', 
                            'href': $(this).attr('href'), // 元のリンクのhref属性をコピー
                            'text': '授業に参加する' 
                        });
                        // コンテナに要素を追加
                        $lessonContainer.append($lessonTitle).append($lessonLink);
                        $('#todays-event-class-scheduled').prepend($lessonContainer);
                    });
                    eventFound = true; // 今日授業あり
                }

            }
            // 今日以降のイベント（明日以降も含む）をアップカミングに追加
            if (cellDay > todayDay && !executed) {
                const $dayContent = $cell.find('[data-region="day-content"]');
                console.log('$dayContent:', $dayContent); // 取得したdayContentを確認
            
                if ($dayContent.length > 0) {
                    const $events = $dayContent.find('li a[data-action="view-event"]');
                    console.log('$events:', $events); // 取得したeventsを確認
            
                    $events.each(function() {
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
                        const cellDay = parseInt($cell.attr('data-day'), 10); // カレンダーの日付
                        const cellMonth = currentMonth; // 現在の月を設定
                        const cellYear = todayYear; // カレンダーの年
            
                        // イベントの日付を作成
                        const eventDate = new Date(cellYear, cellMonth - 1, cellDay); // 月は0から始まるので、cellMonth - 1にする
            
                        // 日付を「12/27(金)」の形式でフォーマット
                        const dateString = `${cellMonth}/${cellDay }`;
                        const Week = ["(日)", "(月)", "(火)", "(水)", "(木)", "(金)", "(土)"];
                        const dayOfWeek = Week[eventDate.getDay()]; // (土)
                        console.log(dayOfWeek); // (土)

                        // 新しいdivを作成
                        var $lessonContainer = $('<div>', { 'class': 'dashboard-main-class-content-lesson ' + getSubjectCategoryValue });
            
                        // courseName と dateString を同じ div 内に追加
                        var $lessonTitleAndDate = $('<span>', { 'class': 'dashboard-main-class-content-lesson-details' })
                            .append($('<span>', { 'class': 'date', 'text': dateString + dayOfWeek}))
                            .append($('<span>', { 'class': 'title', 'text': courseName }));
            
                        // $lessonContainer に $lessonTitleAndDate を追加
                        $lessonContainer.append($lessonTitleAndDate);
            
                        // 画面に追加
                        $('#dashboard-main-upcoming-class-scheduled').append($lessonContainer);
                        upcomingEventFound = true; // 明日以降のイベントが見つかった
                    });
                }
            }
            // 初回実行後にフラグをtrueに設定
          

        });

        // 今日のイベントがあればダッシュボードメッセージを更新
        if (!flagTodaysCalendar) {
            let message = '本日は授業はありません。'; // デフォルトメッセージ

            if (eventFound) {
                message = `本日は、「${eventDetails.join('」「')}」の授業があります。`;
                console.log('ダッシュボードメッセージを更新しました。');
            } else {
                console.log('本日は授業がありません。');
                //何かしらの科目を買っているときは本日の授業のところに「本日は授業がありません」を表示
                if ( isBuySubjectMain || isBuySubjectChild || isBuyProgramming) {
                    $('#todays-event-class-none').show();  
                //何も授業買っていない時に授業なければ、今月は授業がありませんを表示
                } else if  (!isBuySubjectMain && !isBuySubjectChild && !isBuyProgramming) {
                    $('#dashboard-main-upcoming-class-none').show();
                }
             
            }

            // メッセージをダッシュボードに設定
            $('#todays-subject-pc .c-alert-banner-text-title').text(message);
            // 今日のカレンダーが見つかったことを示すフラグを設定
            flagTodaysCalendar = true;
        }
         // 明日以降のスケジュールがない場合は、スマホにNoneメッセージを表示
        if (!upcomingEventFound) {
            $('#dashboard-main-upcoming-class-none').show();
        }
        executed = true;
    }

    // ページ読み込み時に発火
    $(document).ready(function() {
        console.log('ページ読み込み時のロジックを実行します。');
        executeCalendarLogic();
    });

    // .arrow_link のクリック時に0.3秒後に発火
    $(document).on('click', '.arrow_link', function() {
        console.log('.arrow_link がクリックされました。0.3秒後にロジックを実行します。');
        setTimeout(() => {
            executeCalendarLogic();
        }, 300); // 300ミリ秒（0.3秒）
    });


  


}
// ==============================
// トップページの処理
// ==============================
if (bodyId === "page-my-index" || bodyId === "page-site-index") {
    if (!isBuySubjectChild && isBuySubjectMain) {
        //複雑になりそうなので後回し
        //メイン教科にあって、かつサブ教科持っていない場合
        // $('.header-banner.alert-setting-level').css("display", "flex");
        // // ナビゲーションバーの位置を調整
        // $('.navbar.fixed-top').css({ "top": "70px", "position": "fixed" });
        // // bodyのpaddingを調整
        // $('body').css("padding", "70px 0 0");
    }
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
        id_profile_field_postnumber: "例）0000000"
    };

    $.each(placeholders, function(id, placeholder) {
        $("#" + id).attr("placeholder", placeholder);
    });

    // パスワードポリシーの説明を移動
    const $sourceElement = $("#fitem_id_passwordpolicyinfo .form-control-static");
    const $targetParent = $("label#id_password_label");
    if ($sourceElement.length && $targetParent.length) {
        $targetParent.append($sourceElement);
    }

    // アイコン（!）を "*" に置き換え
    $(".fa-exclamation-circle").each(function() {
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

    cookiekeywords.forEach(keyword => {
        $("*:contains('" + keyword + "')").filter(function() {
            return $(this).children().length === 0; // 子要素を持たないテキストノードだけ対象
        }).closest("div").css("display", "none");
    });
    const moodlekeywords = ["Moodle", "Powered by"];

    moodlekeywords.forEach(keyword => {
        $("*:contains('" + keyword + "')").filter(function() {
            return $(this).children().length === 0; // 子要素を持たないテキストノードだけ対象
        }).closest("*").css("display", "none");
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
    const $buttonElement = $(".enrol_fee_payment_region button");
    if ($buttonElement.length) {
        const customDivHtml = `
                <div class="page-enrol-set-discount">
                    <p>セット受講割引でお得！</p>
                    <p><a href='#'>詳細を見る</a></p>
                </div>`;
        $buttonElement.after(customDivHtml);
    }
  
    //メモカテゴリ：
    //stgプログラミング131
    //

    // "¥" を含む要素を検索
    const SubjectpPrice = $('.enrol_fee_payment_region b:contains("¥")');
    // alert(SubjectpPrice.text()); // n>
    // if (CurrentViewCourseData.category === 'Programming') {
    //     var SubjectPriceContent = `<div class="fixed-subject-price">${SubjectpPrice.text()}</div>`;
    // } else {
    //     var SubjectPriceContent = `<div class="fixed-subject-price">${SubjectpPrice.text()} /月</div>`;
    // }
    var SubjectPriceContent = `<div class="c-pc-hidden fixed-subject-price">${SubjectpPrice.text()} /月</div>`;
    console.log(SubjectPriceContent);
    $('#page.drawers').after(SubjectPriceContent);

}

// ==============================
// 受講ページ
// ==============================
if (bodyId === "page-mod-questionnaire-view") {
    //スマホ版でタイトルを動画の下にうつすロジック
    var contentToClone = $('#page-header').clone();
    var wrappedContent = $('<div>', { id: 'sp-page-header', class: 'c-pc-hidden' }).append(contentToClone);
    // #page-content直下に配置
    $('.activity-description').append(wrappedContent);  

    //課題提出の下にリード文を入れる
    $(".mod_questionnaire_viewpage h2").after('<p>授業の視聴が終わったら課題を提出しましょう</p>');
}


// ==============================
// カテゴリページの処理
// ==============================
if (bodyId === "page-course-index-category") {
    window.location.href = "https://lms.waomirai.com/";
}

// ==============================
//メイン3科目or2,3科目パック購入後はリダイレクトさせる
// ==============================
if (bodyId === "page-course-view-flexsections") {
    const courseId = parseInt(window.location.href.split("id=")[1], 10); // URLからidを取得
    const matchedSubject = Object.values(SubjectIds).find(subject => subject.id === courseId);

    if (matchedSubject) {
        $("body").prepend(`
        <div class="subject-banner">
            <h1>${matchedSubject.name}のコースページです</h1>
        </div>
    `);
    } else {
        console.error("指定された科目に該当しません");
    }
}


// ==============================
//受講レベルの設定
// ==============================
if (bodyId === "page-user-edit") {
    
    var AreaPhilosophy = $('#fitem_id_profile_field_Philosophy_Level'); 
    var AreaScience = $('#fitem_id_profile_field_Science_Level');
    var AreaEconomy = $('#fitem_id_profile_field_Economy_Level');
    var AreaEnglish = $('#fitem_id_profile_field_English_Level');
    var AreaSingleCourse = $('#fitem_id_profile_field_1cource_Subject');
    var AreaTwoCourse = $('#fitem_id_profile_field_2cources_subject');
    var AreaThreeCourse = $('#fitem_id_profile_field_3cources_subject');

    //memo AreaSingleCourse
    var AreaElements = [AreaPhilosophy, AreaScience, AreaEconomy, AreaEnglish, AreaTwoCourse,AreaThreeCourse ];
    AreaElements.forEach(function(AreaElement) {
        AreaElement.hide();
    });
    //選択した科目フィールドのセレクト(select)を取得する関数
    function getSelectElement(Area) {
        var selectElement = Area.find('select');  // 返すのもの
        return selectElement;
    }
    //選択した科目フィールドのセレクト(select)のオプションを操作する関数
    function selectOptionByIndex(Area, optionIndex = 0) {
        var selectElement = getSelectElement(Area); // 既存の関数を利用
        // console.log(selectElement);
        selectElement.find(`option:eq(${optionIndex})`).prop('selected', true); // 指定された番号の<option>を選択
        return selectElement; // <select>要素を返す
    }

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
    if (isBuySubjectMainArray(['philosophy']) && !isBuySubjectMainArray(['science','economy'])) {
        AreaPhilosophy.show();
        selectOptionByIndex(AreaSingleCourse, 1); //1科目受講を哲学に
        // selectOptionByIndex(AreaTwoCourse, 0); //2科目受講セレクトを初期化
        // selectOptionByIndex(AreaThreeCourse, 0);  //3科目受講セレクトを初期化
        // AreaPhilosophy.show();
        handleMultipleSelectChange(getSelectElement(AreaPhilosophy), function (selectedIndexes) {
            console.log("選ばれたインデックスの配列: " + selectedIndexes);
            if(!selectedIndexes.includes(0)){
                 $('body').after('<div class="fixed-scroll">↓スクロールして受講レベルを確定しましょう↓</div>');
            }
        });
    }
    //科学のみ購入
    if (isBuySubjectMainArray(['science']) && !isBuySubjectMainArray(['philosophy','economy'])) {
        AreaScience.show();
        selectOptionByIndex(AreaSingleCourse, 2); //1科目受講を科学に
        // selectOptionByIndex(AreaTwoCourse, 0); //2科目受講セレクトを初期化
        // selectOptionByIndex(AreaThreeCourse, 0); //3科目受講セレクトを初期化
        // AreaPhilosophy.show();
        handleMultipleSelectChange(getSelectElement(AreaPhilosophy), function (selectedIndexes) {
            console.log("選ばれたインデックスの配列: " + selectedIndexes);
            if(!selectedIndexes.includes(0)){
                    $('body').after('<div class="fixed-scroll">↓スクロールして受講レベルを確定しましょう↓</div>');
            }
        });
    }
    if (isBuySubjectMainArray(['economy']) && !isBuySubjectMainArray(['philosophy','science'])) {
        alert('経済');
        AreaEconomy.show(); //経済エリアを表示
        selectOptionByIndex(AreaSingleCourse, 3); //1科目受講を経済に
        // selectOptionByIndex(AreaTwoCourse, 0); //2科目受講セレクトを初期化
        // selectOptionByIndex(AreaThreeCourse, 0); //3科目受講セレクトを初期化
        // AreaPhilosophy.show();
        handleMultipleSelectChange(getSelectElement(AreaPhilosophy), function (selectedIndexes) {
            console.log("選ばれたインデックスの配列: " + selectedIndexes);
            if(!selectedIndexes.includes(0)){
                    $('body').after('<div class="fixed-scroll">↓スクロールして受講レベルを確定しましょう↓</div>');
            }
        });
    }

    //【２科目】２科目パック
    if (isBuySubjectMainArray(['TwoSubjectPack'], true)) {
        //2科目セットの場合は選べるので2科目のプルダウンは抑制しない
        alert('2科目セット');
        AreaTwoCourse.show(); //2科のプルダウンを表示
        selectOptionByIndex(AreaSingleCourse, 0); //1科目受講
        selectOptionByIndex(AreaThreeCourse, 0); //3科目受講
        // // 2科目変更ロジック
        function updateAreaOnSelection() {
            var selectedIndex = getSelectElement(AreaTwoCourse).prop('selectedIndex'); // 選択された<option>のインデックスを取得

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
        // 変更した時も実行
        getSelectElement(AreaTwoCourse).on('change', updateAreaOnSelection);
    }

    //【３科目】３科目パックと単品で３科目勝った時
    if (isBuySubjectMainArray(['ThreeSubjectPack'], true)||isBuySubjectMainArray(['philosophy','economy','science'], true)) {
        alert('3科目セット');
        AreaPhilosophy.show(); //科学を表示
        AreaScience.show(); //哲学を表示
        AreaEconomy.show(); //経済を表示
        // selectOptionByIndex(AreaSingleCourse, 0); //1科目受講
        // selectOptionByIndex(AreaTwoCourse, 0); //2科目受講
        selectOptionByIndex(AreaThreeCourse, 1); //3科目受講
    }

    //メイン科目で哲学設定｜哲学L1~L4は未設定
    if (isBuySubjectMainArray(['philosophy'])&& (!isBuySubjectChildArray('philosophy', ['ph_L1', 'ph_L2', 'ph_L3', 'ph_L4']))){
        AreaPhilosophy.show();
    }
    alert('3');

    //哲学いずれかサブレベル持っているとき
    if  (isBuySubjectChildArray('philosophy', ['ph_L1', 'ph_L2', 'ph_L3', 'ph_L4'])){
    alert('効いている?');
    getSelectElement(AreaPhilosophy).after('<p>受講レベルは月末に反映されます。変更しても即時で反映されませんのでご注意くださいませ。</p>');
    } else {
    getSelectElement(AreaPhilosophy).after('<p>受講レベルを設定してください</p>');
    }
    //経済いずれかサブレベル持っているとき
    if  (isBuySubjectChildArray('science', ['sc_L1', 'sc_L2', 'sc_L3', 'sc_L4'])){
    getSelectElement(AreaScience).after('<p>受講レベルは月末に反映されます。変更しても即時で反映されませんのでご注意くださいませ。</p>');
    } else {
    getSelectElement(AreaScience).after('<p>受講レベルを設定してください</p>');
    }
    //哲学いずれかサブレベル持っているとき
    if  (isBuySubjectChildArray('economy', ['ec_L1', 'ec_L2', 'ec_L3', 'ec_L4'])){
    getSelectElement(AreaEconomy).after('<p>受講レベルは月末に反映されます。変更しても即時で反映されませんのでご注意くださいませ。</p>');
    }else {
    getSelectElement(AreaEconomy).after('<p>受講レベルを設定してください</p>');
    }

    $('#id_category_10 > .d-flex').after(`
        <p class="subject-level-note">
          受講科目のレベルを選択してください。<br />
          選択した科目のレベルを設定しないと授業を受けることができません。<br />
          ※一度設定すると、次回のレベルの反映は月末になりますのでご注意くださいませ。
        </p>
      `);
}

// ==============================
// 汎用的な関数
// ==============================


// classを指定してスクロールできるように
$('.scroll-to').on('click', function (e) {
    e.preventDefault(); // デフォルトの動作を防ぐ
    var targetClass = $(this).data('target'); // data-target属性からターゲットのクラスを取得
    var $target = $(targetClass); // ターゲット要素を取得

    if ($target.length) { // ターゲットが存在する場合のみ実行
        $('html, body').animate(
            {
                scrollTop: $target.offset().top, // ターゲット要素の位置にスクロール
            },
            0 // スクロール速度 (ミリ秒)
        );
    }
});

   }
});