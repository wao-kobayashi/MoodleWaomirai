document.addEventListener("DOMContentLoaded", function() {
    // <html>タグの属性を取得
    const htmlElement = document.querySelector("html");
    const tenantIdNumber = htmlElement.getAttribute("data-tenantidnumber");

    // stg環境の場合の処理
    if (tenantIdNumber === "stg") {
        console.log("stg!!");

        const bodyElement = document.querySelector("body");
        const bodyId = bodyElement.getAttribute("id");
        const courseDiv = document.querySelector('div[data-courseid="211"]');

        // ==============================
        // ダッシュボードページの処理
        // ==============================
        if (bodyId === "page-my-index") {
            const alertSettingLevel = document.querySelector(".alert-setting-level");
            const alertBuyCourse = document.querySelector(".alert-buy-course");

            if (courseDiv) {
                if (alertSettingLevel) alertSettingLevel.style.display = "flex";
            } else {
                if (alertBuyCourse) alertBuyCourse.style.display = "flex";
            }
        }

        // ==============================
        // ログイン・サインアップページの処理
        // ==============================
        if (bodyId === "page-login-signup") {
            // ステップ画像を挿入
            const loginHeading = document.querySelector(".login-heading");
            if (loginHeading) {
                // loginHeading.insertAdjacentHTML(
                //     "afterend",
                //     '<div class="signup-step"><img src="https://go.waomirai.com/l/1026513/2024-12-05/h94s4/1026513/17334611648lNVAMvK/step.svg" alt="ステップ画像"></div>'
                // );
                loginHeading.textContent = "新規会員登録";
            }

            // フォームプレースホルダーの設定
            const placeholders = {
                id_username: "例）waomirai",
                id_email: "例）sample@gmail.com",
                id_email2: "例）sample@gmail.com",
                id_lastname: "例）鈴木",
                id_firstname: "例）太郎",
                id_profile_field_furigana: "例）スズキタロウ",
                id_profile_field_postnumber: "例）0000000"
            };

            for (const [id, placeholder] of Object.entries(placeholders)) {
                const input = document.getElementById(id);
                if (input) input.placeholder = placeholder;
            }

            // パスワードポリシーの説明を移動
            const sourceElement = document.querySelector("#fitem_id_passwordpolicyinfo .form-control-static");
            const targetParent = document.querySelector("label#id_password_label");
            if (sourceElement && targetParent) {
                targetParent.appendChild(sourceElement);
            }

            // アイコンを "*" に置き換え
            document.querySelectorAll(".fa-exclamation-circle").forEach((icon) => {
                const star = document.createTextNode("*");
                icon.parentNode.replaceChild(star, icon);
            });

            // ロゴを挿入
            const loginWrapper = document.querySelector(".login-wrapper");
            if (loginWrapper) {
                const signupLogoDiv = document.createElement("div");
                signupLogoDiv.className = "signup-logo";

                const logo = document.createElement("img");
                logo.src =
                    "https://go.waomirai.com/l/1026513/2023-11-16/gddzt/1026513/1700192228BDlbz92f/logo_basic_white.png";
                logo.style.width = "100%";

                signupLogoDiv.appendChild(logo);
                loginWrapper.parentNode.insertBefore(signupLogoDiv, loginWrapper);
            }
        }
        if (bodyId === "page-login-confirm") {
            const boxParagraph = document.querySelector(".boxaligncenter h3");
            const singleButtons = document.querySelector(".singlebutton button");
            // テキストを変更
            if (boxParagraph) {
                boxParagraph.textContent = "ご登録ありがとうございます。"; // 必要に応じて新しいテキストを設定
            }
            if (singleButtons) {
                singleButtons.textContent = "ワオ未来塾TOPへ"; // 必要に応じて新しいテキストを設定
            }
        }
    }
});