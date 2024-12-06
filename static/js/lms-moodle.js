document.addEventListener("DOMContentLoaded", function() {
    // <html>タグの属性を取得
    const htmlElement = document.querySelector("html");
    const tenantIdNumber = htmlElement.getAttribute("data-tenantidnumber");

    // テナントごとに処理を切り替え
    if (tenantIdNumber === "stg") {
        // stg環境の処理
        const bodyElement = document.querySelector("body");
        const bodyId = bodyElement.getAttribute("id");
        const courseDiv = document.querySelector('div[data-courseid="211"]');
        console.log('stg!!');
        // dashboard
        if (bodyId === "page-my-index") {
            if (courseDiv) {
                document.querySelector('.alert-setting-level').style.display = "flex";
            } else {
                document.querySelector('.alert-buy-course').style.display = "flex";
            }
        }
        //login
        if (bodyId === "page-login-signup") {
            document.querySelector('.login-heading').insertAdjacentHTML('afterend', '<div class="signup-step"><img src="https://go.waomirai.com/l/1026513/2024-12-05/h94s4/1026513/17334611648lNVAMvK/step.svg" alt="ステップ画像"></div>');
            // .login-heading 要素を取得
            var loginHeading = document.querySelector('.login-heading');

            // 要素のテキストを変更する
            if (loginHeading) {
                loginHeading.textContent = "新規会員登録"; // 新しいテキストを設定する（必要に応じて）
            }
            console.log('aaa');
            // ユーザー名の placeholder 設定
            document.getElementById("id_username").placeholder = "例）waomirai";

            // パスワードの placeholder 設定
            // document.getElementById("id_password").placeholder = "パスワードを入力してください";

            // メールアドレスの placeholder 設定
            document.getElementById("id_email").placeholder = "例）sample@gmail.com";

            // メールアドレス確認の placeholder 設定
            document.getElementById("id_email2").placeholder = "例）sample@gmail.com";

            // 姓の placeholder 設定
            document.getElementById("id_lastname").placeholder = "例）鈴木";

            // 名前の placeholder 設定
            document.getElementById("id_firstname").placeholder = "例）太郎";

            // フリガナの placeholder 設定
            document.getElementById("id_profile_field_furigana").placeholder = "例）スズキタロウ";

            // 郵便番号の placeholder 設定
            // document.getElementById("profile_field_postnumber").placeholder = "0000000"

            // 移動元の要素を取得
            const sourceElement = document.querySelector('#fitem_id_passwordpolicyinfo .form-control-static');
            console.log(sourceElement)
            const targetParent = document.querySelector('label#id_password_label'); // ここは移動先の親要素を指定

            // 要素を移動
            if (sourceElement && targetParent) {
                targetParent.appendChild(sourceElement); // 移動先に追加
            }
            // すべての対象要素を取得
            const icons = document.querySelectorAll('.fa-exclamation-circle');

            // 各要素を "*" に変更
            icons.forEach(icon => {
                // 新しいテキストノード '*' を作成
                const star = document.createTextNode("*");

                // 既存の <i> 要素を '*' に置き換え
                icon.parentNode.replaceChild(star, icon);
            });
            const loginWrapper = document.querySelector(".login-wrapper");
            if (loginWrapper) {
                // <div class="signup-logo"> を作成
                const signupLogoDiv = document.createElement("div");
                signupLogoDiv.className = "signup-logo";

                // <img> を作成して <div> 内に追加
                const logo = document.createElement("img");
                logo.src = "https://go.waomirai.com/l/1026513/2023-11-16/gddzt/1026513/1700192228BDlbz92f/logo_basic_white.png";
                logo.style.width = "100%";
                signupLogoDiv.appendChild(logo);

                // .login-wrapper の前に <div class="signup-logo"> を挿入
                loginWrapper.parentNode.insertBefore(signupLogoDiv, loginWrapper);
            }
        }
    }
});