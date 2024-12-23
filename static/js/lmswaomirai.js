// 本番テナントの変数定義
const SubjectIds = {
    SubjectMain: {
        philosophy: { id: 9999, name: '哲学' },
        science: { id: 9999, name: '科学' },
        economy: { id: 9999, name: '経済' },
        ThreeSubjectPack: { id: 9999, name: '3科目セット' },
        TwoSubjectPack: { id: 9999, name: '2科目セット' },
    },
    SubjectChild: {
        philosophy: {
            L1: { id: 9999, name: '哲学 L1' },
            L2: { id: 9999, name: '哲学 L2' },
            L3: { id: 9999, name: '哲学 L3' },
            L4: { id: 9999, name: '哲学 L4' }
        },
        science: {
            L1: { id: 9999, name: '科学 L1' },
            L2: { id: 9999, name: '科学 L2' },
            L3: { id: 9999, name: '科学 L3' },
            L4: { id: 9999, name: '科学 L4' }
        },
        economy: {
            L1: { id: 9999, name: '経済 L1' },
            L2: { id: 9999, name: '経済 L2' },
            L3: { id: 9999, name: '経済 L3' },
            L4: { id: 9999, name: '経済 L4' }
        },
    },
    GlobalEnglish: { id: 9999, name: 'グローバル英語' },
    Programming: { id: 9999, name: 'プログラミング' }
};
$(document).ready(function() {
    const tenantIdNumber = $("html").data("tenantidnumber");
    if (tenantIdNumber === "lmswaomirai") {
const bodyId = $("body").attr("id");
const bodyClasses = $("body")
    .attr("class")
    .split(" ")
    .map(cls => parseInt(cls.replace("course-id-", "").trim()));

// 汎用的なグループチェック関数
function checkGroup(subjectIds) {
    return Object.values(subjectIds).some(id => bodyClasses.includes(id.id));
}

// 科目グループ判定
const isSubjectMain = checkGroup(SubjectIds.SubjectMain);
const isSubjectChild = ['philosophy', 'science', 'economy'].some(subject => checkGroup(SubjectIds.SubjectChild[subject]));
const isGlobalEnglish = bodyClasses.includes(SubjectIds.GlobalEnglish.id);
const isProgramming = bodyClasses.includes(SubjectIds.Programming.id);

// ==============================
// ダッシュボードページでの処理
// ==============================
if (bodyId === "page-my-index") {

    ////////////////////////////
    // 受講中科目の処理
    ////////////////////////////
    // $(".instance-282-header").on("click", function() {
    //     // a[data-event-id="479"]をクリック
    //     $("a[data-event-id='479']").trigger("click");
    // });
    $("#instance-282-header").on("click", function() {
        alert('a');
        // a[data-event-id="479"]をクリック
        // $("li#yui_3_18_1_1_1734662794127_232").hide();
        $(".today li[data-region='event-item']").click();
        // $("#yui_3_18_1_1_1734662477888_160").trigger("click");
    });

    $("#instance-255-header").on("click", function() {
        alert('a');
        // a[data-event-id="479"]をクリック
        // $("li#yui_3_18_1_1_1734662794127_232").hide();
        $(".today li[data-region='event-item']").click();
        // $("#yui_3_18_1_1_1734662477888_160").trigger("click");
    });

    function renderSubject(subject, icon, isSubjectMain) {
        // SubjectMain の場合のリンクを変更
        const courseLink = isSubjectMain ?
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
        if (subject.name === 'グローバル英語') return "&#x1f4D6;"; // 📖
        if (subject.name === 'プログラミング') return "&#x1f52C;"; // 🔬
        return "&#x1f9ea;"; // デフォルト
    };

    // メイン科目（SubjectMain）の処理
    if (!isSubjectChild && isSubjectMain) {
        console.log("メイン科目（SubjectMain）に該当しています");
        const subjectMainNames = Object.values(SubjectIds.SubjectMain)
            .filter(subSubject => bodyClasses.includes(subSubject.id))
            .map(subSubject => renderSubject(subSubject, getIcon(subSubject), true)) // true を渡してSubjectMain用のリンクにする
            .join("");
        if (subjectMainNames) {
            $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(subjectMainNames);
        }
    }

    // 詳細科目（SubjectChild）の処理
    if (isSubjectChild) {
        console.log("詳細科目（SubjectChild）に該当しています");
        const subjectChildNames = [];
        ['philosophy', 'science', 'economy'].forEach(subjectKey => {
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

    // グローバル英語（GlobalEnglish）の処理
    if (isGlobalEnglish) {
        console.log("グローバル英語に該当しています");
        $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(renderSubject(SubjectIds.GlobalEnglish, getIcon(SubjectIds.GlobalEnglish), false));
    }

    // プログラミング（Programming）の処理
    if (isProgramming) {
        console.log("プログラミングに該当しています");
        $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(renderSubject(SubjectIds.Programming, getIcon(SubjectIds.Programming), false));
    }

    // どの科目にも該当しない場合のエラーハンドリング
    if (!isSubjectMain && !isSubjectChild && !isGlobalEnglish && !isProgramming) {
        console.error("指定された科目に該当しません");
        // 特定のHTMLを指定要素に挿入する
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
            if (cellDay === todayDay && cellMonth === todayMonth && cellYear === todayYear) {
                console.log('今日の日付に一致しました:', { cellDay, cellMonth, cellYear });

                const $dayContent = $cell.find('[data-region="day-content"]');
                if ($dayContent.length > 0) {
                    const $events = $dayContent.find('li a[data-action="view-event"]');
                    $events.each(function() {
                        const courseName = $(this).text().trim();
                        eventDetails.push(courseName);
                        console.log(`今日のイベント: ${courseName}`);
                    });
                }

                eventFound = true; // 今日授業あり
            }
        });

        // 今日のイベントがあればダッシュボードメッセージを更新
        if (eventFound) {
            $('.dashboard-banner-text-title').text(
                `本日は、「${eventDetails.join('」「')}」の授業があります。`
            );
            console.log('ダッシュボードメッセージを更新しました。');
        } else {
            $('.dashboard-banner-text-title').text('本日は授業はありません。');
            console.log('本日は授業がありません。');
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








}
// ==============================
// トップページの処理
// ==============================
if (bodyId === "page-my-index" || bodyId === "page-site-index") {
    if (!isSubjectChild && isSubjectMain) {
        $('.header-banner.alert-setting-level').css("display", "flex");
        // ナビゲーションバーの位置を調整
        $('.navbar.fixed-top').css({ "top": "70px", "position": "fixed" });
        // bodyのpaddingを調整
        $('body').css("padding", "70px 0 0");

    }
}



// ==============================
// ログイン・サインアップページの処理
// ==============================
if (bodyId === "page-login-signup") {
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
    const $loginWrapper = $(".login-wrapper");
    if ($loginWrapper.length) {
        const signupLogoHtml = `
                <div class="signup-logo">
                    <img src="https://go.waomirai.com/l/1026513/2023-11-16/gddzt/1026513/1700192228BDlbz92f/logo_basic_white.png" style="width: 100%;">
                </div>`;
        $loginWrapper.before(signupLogoHtml);
    }
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
}   }
});