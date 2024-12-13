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
        // ダッシュボードページの処理（ページIDがpage-my-indexまたはpage-site-indexの場合）
        // ==============================
        if (bodyId === "page-my-index" || bodyId === "page-site-index") {
            

            // // alertSettingLevelの設定
            // const alertSettingLevel = document.querySelector(".alert-setting-level");

            // if (courseLink && !foundMatch) {
            //     if (alertSettingLevel) alertSettingLevel.style.display = "flex"; // alert設定レベルを表示

            //     // ナビゲーションバーの位置を調整
            //     const navbar = document.querySelector('.navbar.fixed-top');
            //     const navbarAlert = document.querySelector('.header-banner.alert-setting-level');
            //     if (navbar) {
            //         navbar.style.cssText = "top:70px !important; position: fixed;";
            //         navbarAlert.style.display = "flex"; // alert設定レベルを表示
            //     }

            //     // bodyのpaddingを調整
            //     document.body.style.cssText = "padding:70px 0 0 !important;";
            // }
            

        }

        // ==============================
        // .toppage-coursesにa要素が1個もない時に.alert-buy-courseをflexにする
        // ==============================
        if (bodyId === "page-my-index") {
            const alertBuyCourse = document.querySelector(".dashboard-banner-right");
            const toppageCourses = document.querySelector(".toppage-courses");
            const courseLinks = toppageCourses ? toppageCourses.querySelectorAll("a") : [];
            console.log("courseLinks:", courseLinks);

            // 特定のコースIDを持つ要素とリンクを取得
            const courseDiv = document.querySelector('div[data-courseid="211"]');
            console.log("courseDiv:", courseDiv ? "Found" : "Not Found");

            const courseLink = document.querySelector('.toppage-courses a[href="https://lms.waomirai.com/course/view.php?id=211"]');
            console.log("courseLink:", courseLink ? "Found" : "Not Found");

            // ターゲット文字列
            const targetTexts = ["L1", "L2", "L3", "L4", "Ｌ１", "Ｌ２", "Ｌ３", "Ｌ４"];

            // ターゲット文字列の配列（「科学」「英語」「経済」「哲学」「プログラミング」）
            const targetTextsSubject = ['科学', '英語', '経済', '哲学', 'プログラミング'];

            // .toppage-courses内のテキストを取得
            let foundMatch = false;
            let foundMatchSubject = false;

            // .toppage-coursesが存在し、ターゲット文字列が含まれているかチェック
            if (toppageCourses) {
                const toppageText = toppageCourses.innerText;

                targetTexts.forEach(target => {
                    const regex = new RegExp(`\\S*${target}\\S*`, 'g'); // 空白以外の文字にマッチ
                    const matches = toppageText.match(regex);
                    if (matches) {
                        foundMatch = true; // 一致した場合、フラグをtrueに設定
                    }
                });

                ////////////////////////////////////////
                // サイドバー、現在受講中の科目の処理
                ////////////////////////////////////////

                targetTextsSubject.forEach(target => {
                    const regex = new RegExp(`\\S*${target}\\S*`, 'g'); // 空白以外の文字にマッチ
                    const matches = toppageText.match(regex);
                    if (matches) {
                        foundMatchSubject = true;

                        // 科学を含むワードが見つかった場合
                        if (target.includes("科学")) {
                            const subjectScience = document.querySelector(".subject-science");
                            if (subjectScience) {
                                subjectScience.style.display = "flex";
                                subjectScience.classList.add("active");
                            }
                        }

                        // 英語を含むワードが見つかった場合
                        if (target.includes("英語")) {
                            const subjectEnglish = document.querySelector(".subject-english");
                            if (subjectEnglish) {
                                subjectEnglish.style.display = "flex";
                                subjectEnglish.classList.add("active");
                            }
                            // 英語学習のブロックを表示
                            const DashboardEnglish = document.querySelector(".dashboard-left-block-english");
                            if (DashboardEnglish) {
                                DashboardEnglish.style.display = "block";
                            }
                        }
                    }
                });
            }
            // 現在受講中の科目自体の表示
            if (foundMatchSubject) {
                console.log('foundMatchSubject');
                const DashboardLeftBlockSubject = document.querySelector(".dashboard-left-block-subject");
                if (DashboardLeftBlockSubject) {
                    DashboardLeftBlockSubject.style.display = "block"; // alert設定レベルを表示
                }
            }


            ////////////////////////////////////////
            // カレンダー上部の「今日は授業があります。」などの制御
            ////////////////////////////////////////

            //以下カレンダー
            // 今日の日付を取得
            const today = new Date();
            const todayDay = today.getDate();
            const todayMonth = today.getMonth() + 1; // 月は0から始まるため+1
            const todayYear = today.getFullYear();

            // カレンダーの全セルを取得
            const dayCells = document.querySelectorAll('.day');

            // 今日があるかを確認
            let eventFound = false;

            dayCells.forEach(cell => {
                const cellDay = parseInt(cell.getAttribute('data-day'), 10);
                const cellYear = parseInt(cell.querySelector('a')?.getAttribute('data-year') || todayYear, 10);
                const cellMonth = parseInt(cell.querySelector('a')?.getAttribute('data-month') || todayMonth, 10);
                
                if (cellDay === todayDay && cellMonth === todayMonth && cellYear === todayYear) {
                    // 該当日のdiv(data-region='day-content')内のli要素を確認
                    const dayContent = cell.querySelector('[data-region="day-content"]');
                    if (dayContent && dayContent.querySelectorAll('li').length > 0) {
                        eventFound = true;
                        // li要素内のa要素をすべて取得し、授業名と時間を出力
                        const events = dayContent.querySelectorAll('li a[data-action="view-event"]');
                        const eventDetails = [];  // 授業名と時間を格納する配列
                        
                        events.forEach(event => {
                            const courseName = event.textContent.trim();
                            const courseTime = event.getAttribute('data-time'); // 仮に授業時間がdata-time属性に入っていると仮定
                            
                            if (courseTime) {
                                eventDetails.push(`${courseTime} ${courseName}`);  // 授業時間と名前を格納
                            } else {
                                eventDetails.push(courseName);  // 時間が無ければ名前だけを格納
                            }
                        });
            
                        // .dashboard-banner-text-titleに授業名と時間を「本日は、『授業名』、『授業名』の授業があります。」の形式で挿入
                        const dashboardBannerTextTitle = document.querySelector('.dashboard-banner-text-title');
                        if (dashboardBannerTextTitle) {
                            const eventText = eventDetails.length > 0 
                                ? `本日は、「${eventDetails.join('」「')}」の授業があります。`
                                : '本日は授業はありません。';
                            dashboardBannerTextTitle.innerText = eventText;  // フォーマットしてテキストを設定
                        }
                    }
                }
            });
                 
            if (!eventFound) {
                const dashboardBannerTextTitle = document.querySelector('.dashboard-banner-text-title');
                if (dashboardBannerTextTitle) {
                    dashboardBannerTextTitle.innerText = '本日は授業はありません。';
                }
                console.log("授業ないよ");
            }

            const hasLinks = !!toppageCourses.querySelector("a"); // 1つでも `a` 要素があれば true
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