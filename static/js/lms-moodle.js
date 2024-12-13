document.addEventListener("DOMContentLoaded", function() {
    // <html>タグの属性を取得し、tenantIdNumberを取得
    const htmlElement = document.querySelector("html");
    const tenantIdNumber = htmlElement.getAttribute("data-tenantidnumber");

    // tenantIdが"stg"の場合の処理
    if (tenantIdNumber === "stg") {
        console.log("stg!!"); // stg環境の確認

        // body要素のIDを取得
        const bodyElement = document.querySelector("body");
        const bodyId = document.body.getAttribute("id");



// ==============================
// ホームページまたはダッシュボードページでの処理
// ==============================
if (bodyId === "page-my-index" || bodyId === "page-site-index") {
    // 監視するコースIDを指定（複数）
    const courseIds = ["211", "255", "123", "456"];  // 必要なコースIDを追加

    // コースリンクを格納する配列
    const courseLinks = [];
    
    // 指定されたコースIDごとにリンクを検索
    courseIds.forEach(id => {
        const link = document.querySelector(`.toppage-courses a[href="https://lms.waomirai.com/course/view.php?id=${id}"]`);
        if (link) {
            // 見つかったリンクを配列に追加
            courseLinks.push(link);
        }
    });

    // コースリンクが見つかったかどうかをログに表示
    console.log("courseLinks:", courseLinks.length > 0 ? "Found" : "Not Found");

    // 検索するターゲット文字列（L1, L2, L3, L4など）
    const targetTexts = ["L1", "L2", "L3", "L4", "Ｌ１", "Ｌ２", "Ｌ３", "Ｌ４"];

    // .toppage-courses内のテキストを取得
    const toppageCourses = document.querySelector('.toppage-courses');
    let foundMatch = false;

    // ターゲット文字列がページに含まれているかチェック
    if (toppageCourses) {
        const toppageText = toppageCourses.innerText;

        // それぞれのターゲット文字列が一致するかを調べる
        targetTexts.forEach(target => {
            const regex = new RegExp(`\\S*${target}\\S*`, 'g'); // 空白以外の文字にマッチ
            const matches = toppageText.match(regex);
            if (matches) {
                foundMatch = true; // 一致した場合、フラグをtrueに設定
                console.log(`${target} found in the following elements:`);
                matches.forEach(match => {
                    console.log(`- ${match}`); // マッチした要素をログに表示
                });
            } else {
                console.log(`${target} not found.`);
            }
        });
    }

    // 警告設定レベルの表示（ターゲット文字列が見つからない場合）
    const alertSettingLevel = document.querySelector(".alert-setting-level");

    // コースリンクがあり、ターゲット文字列が一致しない場合に処理
    if (courseLinks.length > 0 && !foundMatch) {
        if (alertSettingLevel) alertSettingLevel.style.display = "flex"; // 警告設定レベルを表示

        // ナビゲーションバーの位置を調整
        const navbar = document.querySelector('.navbar.fixed-top');
        if (navbar) {
            navbar.style.cssText = "top:70px !important; position: fixed;";
        }

        // ボディの上部余白を調整
        document.body.style.cssText = "padding:70px 0 0 !important;";
    }
}

// ==============================
// ダッシュボードページでの処理
// ==============================
if (bodyId === "page-my-index") {
    // 「購入していないコース」の警告
    const alertBuyCourse = document.querySelector(".dashboard-banner-right");

    // .toppage-courses内のリンクを取得
    const toppageCourses = document.querySelector(".toppage-courses");
    const courseLinks = toppageCourses ? toppageCourses.querySelectorAll("a") : [];
    console.log("courseLinks:", courseLinks);

    // ターゲット文字列（L1, L2, L3, L4）と科目（科学、英語など）
    const targetTexts = ["L1", "L2", "L3", "L4", "Ｌ１", "Ｌ２", "Ｌ３", "Ｌ４"];
    const targetTextsSubject = ['科学', '英語', '経済', '哲学', 'プログラミング'];

    // ターゲット文字列と科目名のチェック
    checkForTargetTexts(toppageCourses, targetTexts, targetTextsSubject);

    // カレンダー処理（本日の授業の確認）
    handleCalendar();

    // リンクの有無を確認し、必要な処理を行う
    handleLinks(alertBuyCourse, toppageCourses);
}

// ターゲット文字列チェックと科目表示
function checkForTargetTexts(toppageCourses, targetTexts, targetTextsSubject) {
    let foundMatchSubject = false;

    if (toppageCourses) {
        const toppageText = toppageCourses.innerText;

        // ターゲット文字列（L1, L2, L3, L4など）がページに含まれているかチェック
        targetTexts.forEach(target => {
            if (toppageText.includes(target)) {
                console.log(`${target} found.`);
            }
        });

        // 科目名（科学、英語など）がページに含まれているかチェック
        targetTextsSubject.forEach(target => {
            if (toppageText.includes(target)) {
                foundMatchSubject = true;
                // 科目を表示する処理
                handleSubjectVisibility(target);
            }
        });
    }

    // 科目が見つかった場合、科目表示のブロックを表示
    if (foundMatchSubject) {
        const DashboardLeftBlockSubject = document.querySelector(".dashboard-left-block-subject");
        if (DashboardLeftBlockSubject) {
            DashboardLeftBlockSubject.style.display = "block";
        }
    }
}

// 科目の表示
function handleSubjectVisibility(target) {
    // 科目名に応じて、対応する科目を表示
    if (target.includes("科学")) toggleVisibility(".subject-science", "flex");
    if (target.includes("英語")) {
        toggleVisibility(".subject-english", "flex");
        toggleVisibility(".dashboard-left-block-english", "block");
    }
}

// 表示方法を選択
function toggleVisibility(selector, displayType = "flex") {
    const element = document.querySelector(selector);
    if (element) {
        element.style.display = displayType;
        element.classList.add("active");
    }
}

// カレンダー処理（本日の日付とイベントを確認）
function handleCalendar() {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;
    const todayYear = today.getFullYear();

    const dayCells = document.querySelectorAll('.day');
    let eventFound = false;

    // カレンダーの日付セルをループして、今日の授業があるか確認
    dayCells.forEach(cell => {
        const cellDay = parseInt(cell.getAttribute('data-day'), 10);
        const cellYear = parseInt(cell.querySelector('a')?.getAttribute('data-year') || todayYear, 10);
        const cellMonth = parseInt(cell.querySelector('a')?.getAttribute('data-month') || todayMonth, 10);

        // 今日の日付と一致する場合に授業の有無を確認
        if (cellDay === todayDay && cellMonth === todayMonth && cellYear === todayYear) {
            const dayContent = cell.querySelector('[data-region="day-content"]');
            if (dayContent && dayContent.querySelectorAll('li').length > 0) {
                eventFound = true;
                displayEvents(dayContent);
            }
        }
    });

    // 本日授業があるかないかを表示
    const dashboardBannerTextTitle = document.querySelector('.dashboard-banner-text-title');
    if (dashboardBannerTextTitle) {
        dashboardBannerTextTitle.innerText = eventFound ? '本日は授業があります。' : '本日は授業はありません。';
    }
}

// イベント表示（本日の授業詳細を表示）
function displayEvents(dayContent) {
    const events = dayContent.querySelectorAll('li a[data-action="view-event"]');
    const eventDetails = [];
    events.forEach(event => {
        const courseName = event.textContent.trim();
        const courseTime = event.getAttribute('data-time');
        eventDetails.push(courseTime ? `${courseTime} ${courseName}` : courseName);
    });

    // 本日授業がある場合、その詳細を表示
    const dashboardBannerTextTitle = document.querySelector('.dashboard-banner-text-title');
    if (dashboardBannerTextTitle) {
        dashboardBannerTextTitle.innerText = `本日は、「${eventDetails.join('」「')}」の授業があります。`;
    }
}

// リンクの存在確認（受講中の科目がない場合の処理）
function handleLinks(alertBuyCourse, toppageCourses) {
    const hasLinks = !!toppageCourses.querySelector("a");
    if (!hasLinks && alertBuyCourse) {
        alertBuyCourse.style.display = "flex";
        const dashboardBannerTextTitle = document.querySelector('.dashboard-banner-text-title');
        dashboardBannerTextTitle.innerText = '受講してる科目がありません。';
    } else {
        console.log("At least one link exists.");
    }
}


        

        // ==============================
        // ログイン・サインアップページの処理（ページIDがpage-login-signupの場合）
        // ==============================
        if (bodyId === "page-login-signup") {
            // ログインページのタイトルを変更
            const loginHeading = document.querySelector(".login-heading");
            if (loginHeading) {
                loginHeading.textContent = "新規会員登録"; // タイトルのテキストを変更
            }

            // フォームのプレースホルダーを設定（フィールドIDとプレースホルダーのマッピング）
            const placeholders = {
                id_username: "例）waomirai",
                id_email: "例）sample@gmail.com",
                id_email2: "例）sample@gmail.com",
                id_lastname: "例）鈴木",
                id_firstname: "例）太郎",
                id_profile_field_furigana: "例）スズキタロウ",
                id_profile_field_postnumber: "例）0000000"
            };

            // 各フォームフィールドに対応するプレースホルダーを設定
            for (const [id, placeholder] of Object.entries(placeholders)) {
                const input = document.getElementById(id);
                if (input) input.placeholder = placeholder;
            }

            // パスワードポリシーの説明を移動
            const sourceElement = document.querySelector("#fitem_id_passwordpolicyinfo .form-control-static");
            const targetParent = document.querySelector("label#id_password_label");
            if (sourceElement && targetParent) {
                targetParent.appendChild(sourceElement); // パスワードポリシーの説明をターゲット位置に移動
            }

            // アイコン（!）を "*" に置き換え
            document.querySelectorAll(".fa-exclamation-circle").forEach((icon) => {
                const star = document.createTextNode("*"); // 新しいテキストノード（*）を作成
                icon.parentNode.replaceChild(star, icon); // アイコンを*に置き換え
            });

            // ロゴを挿入（サインアップページにロゴを追加）
            const loginWrapper = document.querySelector(".login-wrapper");
            if (loginWrapper) {
                const signupLogoDiv = document.createElement("div");
                signupLogoDiv.className = "signup-logo";

                const logo = document.createElement("img");
                logo.src = "https://go.waomirai.com/l/1026513/2023-11-16/gddzt/1026513/1700192228BDlbz92f/logo_basic_white.png"; // ロゴのURL
                logo.style.width = "100%"; // ロゴの幅を100%に設定

                signupLogoDiv.appendChild(logo); // ロゴをdivに追加
                loginWrapper.parentNode.insertBefore(signupLogoDiv, loginWrapper); // ロゴを親要素に挿入
            }
        }

        // ==============================
        // ログイン確認ページの処理（ページIDがpage-login-confirmの場合）
        // ==============================
        if (bodyId === "page-login-confirm") {
            const boxParagraph = document.querySelector(".boxaligncenter h3");
            const singleButtons = document.querySelector(".singlebutton button");

            // テキストを変更（確認ページ）
            if (boxParagraph) {
                boxParagraph.textContent = "ご登録ありがとうございます。"; // 新しいテキストを設定
            }
            if (singleButtons) {
                singleButtons.textContent = "ワオ未来塾TOPへ"; // 新しいボタンテキストを設定
            }
        }
        // ==============================
        // 購入処理（ページIDがpage-enrol-indexの場合）
        // ==============================
        if (bodyId === "page-enrol-index") {
            const buttonElement = document.querySelector('.enrol_fee_payment_region button');

            if (buttonElement) {
                // 新しい要素を作成
                const customDiv = document.createElement("div");
                customDiv.className = "page-enrol-set-discount";
                customDiv.innerHTML = "<p>セット受講割引でお得！</p><p><a href='#'>詳細を見る</a></p>";
                // buttonの親要素に新しい要素を挿入
                buttonElement.parentNode.insertBefore(customDiv, buttonElement.nextSibling);
            }
        }
        // ==============================
        // カテゴリページの時
        // ==============================
        //カテゴリページは意味ないので、トップページへリダイレクト
        if (bodyId === "page-course-index-category") {
            window.location.href = "https://lms.waomirai.com/";
        }

        // ==============================
        // マイページ（ページIDが#page-user-profileの場合）
        // ==============================

        // if (bodyId === "page-user-profile") {
        //     // 非表示にする単語を配列で定義
        //     const blockWords = ["その他", "レポート", "ログイン活動"]; // ここにブロックしたい単語を追加

        //     const nodeCategories = document.querySelectorAll(".node_category");

        //     nodeCategories.forEach(nodeCategory => {
        //         const leadElement = nodeCategory.querySelector(".lead");
        //         if (leadElement) {
        //             // テキストに配列内のいずれかの単語が含まれている場合に非表示
        //             if (blockWords.some(word => leadElement.textContent.includes(word))) {
        //                 // display:none を !important に設定
        //                 nodeCategory.style.cssText += "display: none !important;";
        //             }
        //         }
        //     });
        // }
        // if (bodyId === "page-user-preferences") {
        //     // 非表示にするキーワードを配列で定義
        //     const keywordsToHide = [
        //         "user/language.php",
        //         "user/forum.php",
        //         "user/calendar.php",
        //         "/user/contentbank.php",
        //         "/user/editor.php"
        //     ];
        //     const preferencesSection = document.querySelector("#page-content");

        //     // セクションが存在する場合に実行
        //     if (preferencesSection) {
        //         console.log("セクションが見つかりました");

        //         // セクション内のすべてのリンクを取得
        //         const links = preferencesSection.querySelectorAll("a");

        //         // 各リンクをチェックして部分一致する場合に非表示
        //         links.forEach(link => {
        //             console.log("チェック中のリンク:", link.href);

        //             if (keywordsToHide.some(keyword => link.href.includes(keyword))) {
        //                 console.log("非表示にするリンク:", link.href);
        //                 link.style.display = "none"; // 非表示
        //             }
        //         });
        //     } else {
        //         console.log("指定されたセクションが見つかりません");
        //     }
        // }

    }
});