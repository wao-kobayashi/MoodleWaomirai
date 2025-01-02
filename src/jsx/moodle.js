////////////////////////////
// すでに購入しているコースの判定
////////////////////////////
const bodyId = $("body").attr("id");
const bodyClasses = $("body")
    .attr("class")
    .split(" ")
    .map(cls => parseInt(cls.replace("course-id-", "").trim()));

// 汎用的なグループチェック関数
function checkGroup(subjectIds) {
    return Object.values(subjectIds).some(id => bodyClasses.includes(id.id)); //someは1個でも要素があればtrueを返す
}

////////////////////////////////////////////////
// 汎用的な科目チェック関数
////////////////////////////////////////////////
function isBuySubjectMainCategory(subject) {
  return bodyClasses.includes(SubjectIds.SubjectMain[subject]?.id); //subjectMainが存在するかどうかを返す
}
// 検証する科目
const subjects = ['philosophy', 'science','economy', 'ThreeSubjectPack', 'TwoSubjectPack', 'GlobalEnglish'];

// 各科目に該当するかどうかをチェック
const subjectFlags = subjects.reduce((flags, subject) => {
  flags[subject] = isBuySubjectMainCategory(subject);
  return flags;
}, {});

// 判定結果をログに表示
Object.entries(subjectFlags).forEach(([subject, flag]) => {
  const subjectName = SubjectIds.SubjectMain[subject]?.name || subject;
  console.log(`${subjectName}に該当:`, flag);
});

////////////////////////////////////////////////
// 汎用的なグループチェック関数（SubjectChild用）
////////////////////////////////////////////////
function isBuySubjectChildSingle(subject, level) {
  const subjectGroup = SubjectIds.SubjectChild[subject];
  if (!subjectGroup || !subjectGroup[level]) return false; // グループまたはレベルが存在しない場合はfalse
  return bodyClasses.includes(subjectGroup[level].id); // 該当するかを判定
}

// 複数のレベルをまとめてチェックする関数
function isBuySubjectChildLevels(subject, levels) {
  const subjectGroup = SubjectIds.SubjectChild[subject];
  if (!subjectGroup) return false; // グループが存在しない場合はfalse
  return levels.some(level => subjectGroup[level] && bodyClasses.includes(subjectGroup[level].id));
}

/// 哲学、経済、科学、英語、２科目、３科目パックに属しているか
const isBuySubjectMain = checkGroup(SubjectIds.SubjectMain); //メイン科目に該当しているかどうか
const isBuySubjectMainPhilosophy = subjectFlags['philosophy']; //哲学買っているかどうか
const isBuySubjectMainScience = subjectFlags['science']; //科学買っているかどうか
const isBuySubjectMainEconomy = subjectFlags['economy']; //経済買っているかどうか
const isBuySubjectMainTwoSubjectPack = subjectFlags['TwoSubjectPack']; //２科目パック買っているかどうか
const isBuySubjectMainThreeSubjectPack = subjectFlags['ThreeSubjectPack']; //３科目パック買っているかどうか
const isBuySubjectMainGlobalEnglish = subjectFlags['GlobalEnglish']; //英語買っているかどうか

/// L1~L4のグループ判定
const isBuySubjectChild = ['philosophy', 'science', 'economy', 'GlobalEnglish'].some(subject => checkGroup(SubjectIds.SubjectChild[subject])); //サブ科目1個でもあるかどうか


/// プログラミング受講判定
const isBuyProgramming = bodyClasses.includes(SubjectIds.Programming.id); //プログラミング買っているかどうか



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

    ////////////////////////////
    // 受講中科目の処理
    ////////////////////////////

    function renderSubject(subject, icon, isBuySubjectMain) {
        // SubjectMain の場合のリンクを変更
        const courseLink = isBuySubjectMain ?
            `https://lms.waomirai.com/admin/tool/catalogue/courseinfo.php?id=${subject.id}` :
            `https://lms.waomirai.com/course/view.php?id=${subject.id}`;
        return `
            <div class="dashboard-left-block-subject-child">
                <div class="dashboard-left-block-subject-child-icon">${icon}</div>
                <div class="dashboard-left-block-subject-child-text">
                    <a href="${courseLink}" target="_blank">${subject.name}</a>
                </div>
            </div>
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
        $("#todays-event-subject-none,#dashboard-main-upcoming-class-none").show();
        $('#todays-subject-pc').hide();
        const errorHtml = `
        <div class="dashboard-left-block-subject-child">
            <p>受講している科目がありません。</p>
        </div>
    `;
        $('.dashboard-left-block-wrap.dashboard-left-block-wrap-subject').html(errorHtml); // 挿入先要素（例: .target-container）にHTMLを挿入
    }
    /////////////////////////////////////
    ///カレンダー
    ////////////////////////////////////

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
            if (cellDay === todayDay) {
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
                
                        // リンクのクリックイベント設定（通常のリンク動作）
                        $lessonLink.on('click', function(event) {
                            // event.preventDefault(); // デフォルトのリンク動作を無効化
                            console.log('リンクがクリックされました:', courseName);
                
                            // ここで元のリンクの動作を発火させる場合は次の行を有効にできます。
                            // window.location.href = $(this).attr('href');
                        });
                
                        // コンテナに要素を追加
                        $lessonContainer.append($lessonTitle).append($lessonLink);
                        $('#todays-event-class-scheduled').prepend($lessonContainer);
                    });
                }

                eventFound = true; // 今日授業あり
            }
            // 今日以降のイベント（明日以降も含む）をアップカミングに追加
            if (cellDay > todayDay) {
                const $dayContent = $cell.find('[data-region="day-content"]');
                console.log('$dayContent:', $dayContent); // 取得したdayContentを確認
            
                if ($dayContent.length > 0) {
                    const $events = $dayContent.find('li a[data-action="view-event"]');
                    console.log('$events:', $events); // 取得したeventsを確認
            
                    $events.each(function() {
                        var courseName = $(this).text().trim();
                        console.log('courseName:', courseName); // courseNameを確認
                        //今日の日付を取得
                        const today = new Date();
                        const currentMonth = today.getMonth() + 1; // 現在の月（0から始まるので1を足す）
                        const todayDay = today.getDate(); // 今日の日付
                        const todayYear = today.getFullYear(); // 今日の年
                        console.log('Today:', today); // 今日の日付を確認
                        // cellMonthは現在の月
                        const cellDay = parseInt($cell.attr('data-day'), 10); // カレンダーの日付
                        const cellMonth = currentMonth; // 現在の月を設定
                        const cellYear = parseInt($cell.attr('data-year'), 10); // カレンダーの年
                        console.log('cellDay:', cellDay);  // cellDay
                        console.log('cellMonth:', cellMonth); // cellMonth
                        console.log('cellYear:', cellYear); // cellYear
            
                        // イベントの日付を作成
                        const eventDate = new Date(cellYear, cellMonth - 1, cellDay); // 月は0から始まるので、cellMonth - 1にする
                        console.log('Event Date Object:', eventDate); // イベントの日付オブジェクトを確認
            
                        // 日付を「12/27(金)」の形式でフォーマット
                        const dateString = `${cellMonth}/${cellDay }`;
                        console.log('Formatted event dateString:', dateString); // フォーマットされた日付を確認
            
                        // 新しいdivを作成
                        var $lessonContainer = $('<div>', { 'class': 'dashboard-main-class-content-lesson' });
            
                        // courseName と dateString を同じ div 内に追加
                        var $lessonTitleAndDate = $('<span>', { 'class': 'dashboard-main-class-content-lesson-details' })
                            .append($('<span>', { 'class': 'date', 'text': dateString }))
                            .append($('<span>', { 'class': 'title', 'text': courseName }));
            
                        // $lessonContainer に $lessonTitleAndDate を追加
                        $lessonContainer.append($lessonTitleAndDate);
            
                        // 画面に追加
                        $('#dashboard-main-upcoming-class-scheduled').append($lessonContainer);
                        upcomingEventFound = true; // 明日以降のイベントが見つかった
                    });
                }
            }

        });

        // 今日のイベントがあればダッシュボードメッセージを更新
        if (!flagTodaysCalendar) {
            let message = '本日は授業はありません。'; // デフォルトメッセージ

            if (eventFound) {
                message = `本日は、「${eventDetails.join('」「')}」の授業があります。`;
                console.log('ダッシュボードメッセージを更新しました。');
            } else {
                console.log('本日は授業がありません。');
                $('#todays-event-class-none').show();
            }

            // メッセージをダッシュボードに設定
            $('#todays-subject-pc .c-alert-banner-text-title').text(message);
           
            

            // 今日のカレンダーが見つかったことを示すフラグを設定
            flagTodaysCalendar = true;
        }
         // 明日以降のスケジュールがない場合は、Noneメッセージを表示
        if (!upcomingEventFound) {
            $('#dashboard-main-upcoming-class-none').show();
        }
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

    // .dashboard-leftの内容を取得してclone
    var contentToClone = $('.dashboard-left').clone();

    // #page-content直下に配置
    var wrappedContent = $('<div>', { id: 'dashboard-sp-content' }).append(contentToClone);

    // #page-content直下に配置
    $('#page-content').append(wrappedContent);

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
  
  // コースに応じた処理を実行
  if (CurrentViewCourseData.category === 'philosophy') {
    if (isBuySubjectMainTwoSubjectPack) {
     console.log('君は２科目パックを買っているよ')
   }
  }


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