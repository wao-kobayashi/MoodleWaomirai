////////////////////////////////
// テストテナント(defalut tenant)tはもう使われないテナントで
// ユーザーがまれにアクセスする可能性があるため
// アクセスした場合に最新の学習サイトへ誘導するモーダルを表示するJS
////////////////////////////////

$(document).ready(function () {
  const tenantId = $("html").data("tenantid");
  //tenantId1はdefalut-tenant
  if (tenantId === 1) {
    const bodyId = $("body").attr("id");

    //page-site-index：サイトのホーム画面
    //page-login-index：ログイン画面
    //page-login-signup：アカウント作成画面
    if (
      bodyId === "page-site-index" ||
      bodyId === "page-login-index" ||
      bodyId === "page-login-signup"
    ) {
      // bodyIdに応じてリンク先を設定
      let linkUrl = "https://lms.waomirai.com/?tenant=lmswaomirai"; // デフォルト

      if (bodyId === "page-site-index") {
        linkUrl = "https://lms.waomirai.com?tenant=lmswaomirai";
      } else if (bodyId === "page-login-index") {
        linkUrl = "https://lms.waomirai.com/login/index.php?tenant=lmswaomirai";
      } else if (bodyId === "page-login-signup") {
        linkUrl = "https://lms.waomirai.com/signup?tenant=lmswaomirai";
      }

      const modal = `
                <div class="c-modal">
                    <div class="c-modal-wrap">
                        <div class="c-modal-wrap-title">
                            この学習サイトは旧バージョンです。<br>
                            最新の学習サイトをご利用ください。
                        </div>
                        <div class="c-modal-wrap-button-wrap">
                            <a href="${linkUrl}" class="c-modal-wrap-button btn-primary">最新のサイトにアクセス</a>
                        </div>
                    </div>
                </div>
                <div class="c-modal-bg"></div>
            `;

      const $modal = $(modal).appendTo("body");
    }
  }
});
