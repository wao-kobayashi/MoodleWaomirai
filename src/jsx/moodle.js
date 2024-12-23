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

    // カレンダー処理（本日の日付とイベントを確認）
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;
    const todayYear = today.getFullYear();
    let eventFound = false;

    // カレンダーの日付セルをループして、今日の授業があるか確認
    $('.day').each(function() {
        const $cell = $(this);
        const $dayContent = $cell.find('[data-region="day-content"]');

        // 特定のHTMLを追加（当日のみ適用されていた処理を全てのイベントに拡張）
        if ($dayContent.length) {
            // $dayContent.append(`
            //     <div class="calender-today-speech">
            //         <img src="https://go.waomirai.com/l/1026513/2024-12-14/h9lsb/1026513/17342360883dgDGobr/speech_calender.png" alt="特別イベント">
            //     </div>
            // `);

            // // クリックで要素を非表示にする
            // $dayContent.on('click', '.calender-today-speech', function() {
            //     $(this).hide();
            // });

            // li要素を確認してイベントを収集
            const $events = $dayContent.find('li a[data-action="view-event"]');
            const eventDetails = [];
            $events.each(function() {
                const $eventLink = $(this);
                const courseName = $eventLink.text().trim();

                // デバッグ: 科目名をログに出力
                console.log(`Course Name: ${courseName}`);

                // 色を変更する条件が適用されているか確認
                if (courseName.includes('科学')) {
                    console.log('科学が見つかりました。背景色を青に変更します。');
                    $eventLink.attr('style', 'background: blue !important');
                } else if (courseName.includes('哲学')) {
                    console.log('哲学が見つかりました。背景色をオレンジに変更します。');
                    $eventLink.attr('style', 'background: orange !important');
                } else {
                    console.log('条件に一致しない科目: ', courseName);
                }

                eventDetails.push(courseName);
            });

            // イベントがあれば詳細を表示
            if ($events.length > 0) {
                console.log('イベント詳細: ', eventDetails); // イベント詳細を出力
            }
        }
    });
    // 本日授業がない場合のメッセージ表示
    if (!eventFound) {
        $('.dashboard-banner-text-title').text('本日は授業はありません。');
    }

    // .calendarwrapper の DOM 要素を監視
    const targetNode = document.querySelector('.calendarwrapper');

    if (targetNode) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log('DOM変更が検出されました:', mutation);

                    // 必要なロジックを発動
                    $('.day').each(function() {
                        const $cell = $(this);
                        const $dayContent = $cell.find('[data-region="day-content"]');

                        if ($dayContent.length) {
                            const $events = $dayContent.find('li a[data-action="view-event"]');
                            const eventDetails = [];
                            $events.each(function() {
                                const $eventLink = $(this);
                                const courseName = $eventLink.text().trim();

                                console.log(`Course Name: ${courseName}`);

                                // 条件に応じて色を変更
                                if (courseName.includes('科学')) {
                                    console.log('科学が見つかりました。背景色を青に変更します。');
                                    $eventLink.attr('style', 'background: blue !important');
                                } else if (courseName.includes('哲学')) {
                                    console.log('哲学が見つかりました。背景色をオレンジに変更します。');
                                    $eventLink.attr('style', 'background: orange !important');
                                } else {
                                    console.log('条件に一致しない科目: ', courseName);
                                }

                                eventDetails.push(courseName);
                            });

                            if ($events.length > 0) {
                                console.log('イベント詳細: ', eventDetails);
                            }
                        }
                    });
                }
            }
        });

        // オプション設定: 子ノードの追加/削除を監視
        const config = {
            childList: true,
            subtree: true,
        };

        // 監視を開始
        observer.observe(targetNode, config);

        console.log('MutationObserverで監視を開始しました。');
    } else {
        console.warn('.calendarwrapper が見つかりませんでした。');
    }




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
}