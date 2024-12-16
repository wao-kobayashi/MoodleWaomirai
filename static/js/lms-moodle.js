
//変数定義
const SubjectIds = {
    // グループAのサブグループ
    SubjectMain: {
        philosophy:212, //哲学
        science:211, //科学
        economy:213, //経済
        ThreeSubjectPack:229, //3科目セット
        TwoSubjectPack:228, //2科目セット
    },
    // メイン3科目のL1~L4グループ
    SubjectChild: {
        philosophy: {
            L1: 221,
            L2: 225,
            L3: 242,
            L4: 243
        },
        science: {
            L1: 223,
            L2: 222,
            L3: 244,
            L4: 245
        },
        economy: {
            L1: 226,
            L2: 227,
            L3: 246,
            L4: 247
        }
    },
    // プログラミンググループ
    GlobalEnglish: 236, 
    // プログラミンググループ
    Programming: 235,
};


$(document).ready(function() {
    // <html>タグの属性を取得し、tenantIdNumberを取得
    const tenantIdNumber = $("html").data("tenantidnumber");

    // tenantIdが"stg"の場合の処理
    if (tenantIdNumber === "stg") {
        // body要素のIDを取得
        const bodyId = $("body").attr("id");
        // bodyのクラス名から科目IDを取り出し、配列に変換
        const bodyClasses = $("body")
            .attr("class") // bodyのclass属性を取得
            .split(" ")    // スペースで区切り、配列に変換
            .map(cls => parseInt(cls.replace("course-id-", "").trim())); // "course-id-"を取り除いて整数に変換

        // 汎用的なグループチェック関数
        function checkGroup(subjectIds) {
            // それぞれのID群をチェック
            return Object.values(subjectIds).some(function(id) {
            return bodyClasses.includes(id);
            });
        }

        // 各グループの判定
        const isSubjectMain = checkGroup(SubjectIds.SubjectMain); // SubjectMainをチェック
        const isSubjectChild = ['philosophy', 'science', 'economy'].some(subject => 
            checkGroup(SubjectIds.SubjectChild[subject]) // SubjectChildをチェック
        );
        const isGlobalEnglish = bodyClasses.includes(SubjectIds.GlobalEnglish); // GlobalEnglishをチェック
        const isProgramming = bodyClasses.includes(SubjectIds.Programming); // Programmingをチェック
        // ==============================
        // ホームページまたはダッシュボードページでの処理
        // ==============================
        if (bodyId === "page-my-index" || bodyId === "page-site-index") {
            // 必要な処理を追加
        }

        // ==============================
        // ダッシュボードページでの処理
        // ==============================
        if (bodyId === "page-my-index") {
            // 必要な処理を追加
             // 判定結果に基づく処理
                if (isSubjectMain) {
                    console.log("メイン科目（SubjectMain）に該当しています");
                    // メイン科目に関連する処理をここに追加
                }

                if (isSubjectChild) {
                    console.log("詳細科目（SubjectChild）に該当しています");
                    // 詳細科目に関連する処理をここに追加
                }

                if (isGlobalEnglish) {
                    console.log("グローバル英語に該当しています");
                    // グローバル英語に関連する処理をここに追加
                }

                if (isProgramming) {
                    console.log("プログラミングに該当しています");
                    // プログラミングに関連する処理をここに追加
                }

                // どの科目にも該当しない場合のエラーハンドリング
                if (!isSubjectMain && !isSubjectChild && !isGlobalEnglish && !isProgramming) {
                    console.error("何も買っていない");
                    // エラーメッセージを表示する処理をここに追加
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
            const sourceElement = $("#fitem_id_passwordpolicyinfo .form-control-static");
            const targetParent = $("label#id_password_label");
            if (sourceElement.length && targetParent.length) {
                targetParent.append(sourceElement);
            }

            // アイコン（!）を "*" に置き換え
            $(".fa-exclamation-circle").each(function() {
                $(this).replaceWith("*");
            });

            // ロゴを挿入
            const loginWrapper = $(".login-wrapper");
            if (loginWrapper.length) {
                const signupLogoDiv = $("<div>", { class: "signup-logo" }).append(
                    $("<img>", {
                        src: "https://go.waomirai.com/l/1026513/2023-11-16/gddzt/1026513/1700192228BDlbz92f/logo_basic_white.png",
                        css: { width: "100%" }
                    })
                );
                loginWrapper.before(signupLogoDiv);
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
        // 購入処理ページの処理
        // ==============================
        if (bodyId === "page-enrol-index") {
            const buttonElement = $(".enrol_fee_payment_region button");
            if (buttonElement.length) {
                const customDiv = $("<div>", { class: "page-enrol-set-discount" }).html(
                    "<p>セット受講割引でお得！</p><p><a href='#'>詳細を見る</a></p>"
                );
                buttonElement.after(customDiv);
            }
        }

        // ==============================
        // カテゴリページのリダイレクト処理
        // ==============================
        if (bodyId === "page-course-index-category") {
            window.location.href = "https://lms.waomirai.com/";
        }
    }
});
