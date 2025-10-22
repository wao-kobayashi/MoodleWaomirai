// ==============================
// ログイン確認ページの処理
// ==============================
if (bodyId === "page-login-confirm") {
  createModal({
    wrapClass: "c-modal-wrap-wrapline",
    customModalHtml: `
    <div class="c-modal-wrap-close"></div>
    <div class="c-modal-wrap-title">会員登録ありがとうございます！</div>
    <div class="c-modal-wrap-text">
      <span>ワオ未来塾の公式LINEを</span>登録しましょう!<br>
      授業サポートのお知らせをこちらの<br>公式LINEから配信します。
    </div>
    <div class="c-modal-wrap-qr c-sp-hidden">
      <img src="${ImgLiffMoodle}">
    </div>
    <div class="c-modal-wrap-text c-modal-wrap-text-notice">
      ※すでに友だち追加済の方も、<br>
      会員連携のために必ずQRを読み取ってください。
    </div>
    <div class="c-modal-button-line c-pc-hidden">
      <a href="${UrlLiffMoodle}">
        <img src="https://waomirai.com/lp/assets/moodle/images/icn_linewhite.svg">
      </a>
    </div>
    <button class="c-modal-wrap-button c-modal-wrap-button-close c-modal-wrap-close-tag">閉じる</button>
  `
  });
  $(".boxaligncenter h3").text("ご登録ありがとうございます。");
  $(".singlebutton button").text("ワオ未来塾TOPへ");
}
