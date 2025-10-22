// ==============================
// ログイン・サインアップページの処理
// ==============================
if (bodyId === "page-login-signup" || bodyId === "page-login-forgot_password") {
    // ログインページのタイトルを「新規会員登録」に変更
    $(".login-heading").text("新規会員登録");
    $("#id_username_label").append("※好きな文字列で作成いただけます");
    // フォームの各入力フィールドにプレースホルダーを設定
    const placeholders = {
      id_username: "例）waomirai", // ユーザー名のプレースホルダー
      id_email: "例）sample@gmail.com", // メールアドレスのプレースホルダー
      id_email2: "例）sample@gmail.com", // メールアドレス確認のプレースホルダー
      id_lastname: "例）鈴木", // 姓のプレースホルダー
      id_firstname: "例）太郎", // 名のプレースホルダー
      id_profile_field_furigana: "例）スズキタロウ", // フリガナのプレースホルダー
      id_profile_field_postnumber: "例）0000000", // 郵便番号のプレースホルダー
      id_profile_field_wao_membersid: "こちらに会員番号を入れてください", // ワオ未来塾会員番号のプレースホルダー
      id_profile_field_wao_schoolname:  "例）能開⚪︎⚪︎校、Axis⚪︎⚪︎校、オンライン家庭教師", // ワオ未来塾校名のプレースホルダー
    };
  
    // 各入力フィールドにプレースホルダーを設定
    $.each(placeholders, function (id, placeholder) {
      $("#" + id).attr("placeholder", placeholder);
    });
  
    // パスワードポリシーの説明をパスワードラベルの下に移動
    const $sourceElement = $("#fitem_id_passwordpolicyinfo .form-control-static");
    const $targetParent = $("label#id_password_label");
    if ($sourceElement.length && $targetParent.length) {
      $targetParent.append($sourceElement);
    }
  
    // アイコン（!）を "*" に置き換え
    $(".fa-exclamation-circle").each(function () {
      $(this).replaceWith("*");
    });
  
    // ログインラッパーの前にロゴを挿入
    const $loginWrapper = $("#page-login-signup .login-wrapper");
    if ($loginWrapper.length) {
      const signupLogoHtml = `
                  <div class="signup-logo">
                      <img src="https://waomirai.com/lp/assets/moodle/images/logo_waomirai.svg" style="width: 100%;">
                  </div>`;
      $loginWrapper.before(signupLogoHtml);
    }
    //////////////////////////////
    // ID生成ボタンをDOMに追加
    //////////////////////////////
    // 【目的】
    // ユーザ登録フォームなどで、ユーザ名（ID）を自動生成するボタンを追加し、
    // ユーザがワンクリックで一意性の高いIDを入力できるようにする。
  
    // 1. ユーザ名入力欄（#id_username）の直後に、自動生成ボタンを追加
    $('#id_username').after(
      $('<button/>', {
          type: 'button', // フォーム送信を防ぐための button タイプ
          id: 'generateUserIdBtn', // ボタンのID（イベントバインド用）
          class: 'btn-generate-userid', // 任意のクラス（スタイリング用）
          text: 'ユーザIDを自動生成' // ボタンに表示するテキスト
      })
    );
  
    // 2. ランダムな英小文字の文字列を生成する関数
    // 【目的】ユーザIDの末尾にユニーク性を出すためのランダム文字列を付加する。
    function getRandomLetters(length) {
        const letters = 'abcdefghijklmnopqrstuvwxyz'; // 使用する文字のセット（英小文字のみ）
        let result = '';
        for (let i = 0; i < length; i++) {
            // 文字セットの中からランダムに1文字選び、結果に追加
            result += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return result;
    }
  
    // 3. ユーザIDを生成する関数
    // 【目的】日付・時刻・ランダム文字を組み合わせて一意性の高いユーザIDを生成する。
    function generateUserId() {
        const now = new Date(); // 現在日時を取得
  
        // 日付部分をYYMMDD形式で生成（例: 25年3月28日 → "250328"）
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
  
        // 時間部分をHHmm形式で生成（例: 15時7分 → "1507"）
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
  
        // ランダムな3文字の英小文字を生成（例: "xwe"）
        const randomLetters = getRandomLetters(3);
  
        // すべてを結合してIDにする（例: "2503281507xwe"）
        return year + month + day + hours + minutes + randomLetters;
    }
  
    // 4. ボタンクリック時の処理を定義
    // 【目的】ユーザがボタンをクリックすると、自動的にIDが生成され、入力欄に反映されるようにする。
    $(document).on('click', '#generateUserIdBtn', function() {
        // ユーザIDを生成
        const userId = generateUserId();
  
        // 生成したIDを #id_username の入力欄にセット
        $('#id_username')
            .val(userId)         // 値をセット
            .trigger('change')   // 入力変更イベントを発火（他の処理と連携するため）
            .focus();            // 入力欄にフォーカス（視認性向上）
  
        // コンソールに生成されたIDを出力（デバッグ目的）
        console.log('生成されたユーザID:', userId);
    });
  
    // 個人情報保護方針と利用規約のリンク設定
    $('label[for="id_profile_field_kojin_check"]').on('click', function() {
      window.open("https://www.wao-corp.com/privacy/", '_blank');
    });
  
    $('label[for="id_profile_field_termsofservice"]').on('click', function() {
      window.open("https://go.waomirai.com/terms", '_blank');
    });
  }
  