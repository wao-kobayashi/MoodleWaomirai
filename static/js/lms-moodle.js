document.addEventListener("DOMContentLoaded", function() {
    // <html>タグの属性を取得し、tenantIdNumberを取得
    const htmlElement = document.querySelector("html");
    const tenantIdNumber = htmlElement.getAttribute("data-tenantidnumber");

    // tenantIdが"stg"の場合の処理
    if (tenantIdNumber === "stg") {
        console.log("stg!!"); // stg環境の確認

        // body要素のIDを取得
        const bodyElement = document.querySelector("body");
        const bodyId = bodyElement.getAttribute("id");

        // 特定のコースIDを持つdiv要素とリンクを取得
        const courseDiv = document.querySelector('div[data-courseid="211"]');
        const courseLink = document.querySelector('.toppage-courses a[href="https://lms.waomirai.com/course/view.php?id=211"]');

        // .toppage-courses内にL1、L2、L3、L4のいずれかのクラスが存在するかを確認
        const toppageCourses = document.querySelector('.toppage-courses');
        const hasLClasses = toppageCourses && (
            toppageCourses.classList.contains("L1") ||
            toppageCourses.classList.contains("L2") ||
            toppageCourses.classList.contains("L3") ||
            toppageCourses.classList.contains("L4") ||
            toppageCourses.classList.contains("Ｌ１") ||
            toppageCourses.classList.contains("Ｌ２") ||
            toppageCourses.classList.contains("Ｌ３") ||
            toppageCourses.classList.contains("Ｌ４")
        );

        // ==============================
        // ダッシュボードページの処理（ページIDがpage-my-indexまたはpage-site-indexの場合）
        // ==============================
        if (bodyId === "page-my-index" || bodyId === "page-site-index") {
            const alertSettingLevel = document.querySelector(".alert-setting-level");

            // courseLinkが存在し、かつL1、L2、L3、L4クラスがtoppage-coursesに存在する場合
            if (courseLink && !hasLClasses) {
                if (alertSettingLevel) alertSettingLevel.style.display = "flex"; // alert設定レベルを表示

                // ナビゲーションバーの位置を調整
                var navbar = document.querySelector('.navbar.fixed-top');
                if (navbar) {
                    navbar.setAttribute('style', 'top:70px !important; position: fixed;'); // ナビゲーションバーの位置を変更
                }

                // bodyのpaddingを調整
                var body = document.body;
                body.setAttribute('style', 'padding:70px 0 0 !important;'); // bodyに余白を追加
            } else {
                // alert('ないよ');  // courseLinkがない場合の処理（現在はコメントアウト）
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
    }
});