// ==============================
// ダッシュボードページでのバッジ処理
// bodyId が "page-my-index" の時だけ実行
// ==============================
// 【概要】
// このコードは月次バッジの獲得・表示・管理を行います。
// - 新規獲得バッジを「おめでとうモーダル」で通知（Cookie管理で1回のみ）
// - ダッシュボードに最大6件のバッジカードを表示（7件以上で「もっと見る」）
// - 各バッジに「NEW」ピルを表示（期間内 && 未閲覧の場合）
// - クリックで詳細モーダルを開く（開くとNEWが消える）
// ==============================

if (bodyId === "page-my-index") {
  // ===== 設定値の定義 =====
  // 各種定数をCONFIGオブジェクトに集約して管理しやすくする
  const CONFIG = {
    // Cookie設定: 365日間有効、サイト全体（path: "/"）で共有
    cookieOpts: { expires: 365, path: "/" },

    // 獲得モーダルを表示済みか記録するCookie名のプレフィックス
    // 例: badge_modal_seen_2024-01-sample-title
    modalPrefix: "badge_modal_seen_",

    // NEWバッジを非表示にしたか記録するCookie名のプレフィックス
    // 例: badge_new_dismiss_2024-01-sample-title
    newPrefix: "badge_new_dismiss_",

    // デフォルトで表示するバッジの最大件数
    defaultMaxBadges: 6,

    // 獲得モーダルで使用するキラキラ画像のURL
    shineImageUrl: "http://localhost:3000/static/images/modal-shine.png",

    // バッジ画像が無い時に表示するダミーSVG（グレーの四角）
    // encodeURIComponentでdata URI化して直接埋め込める形式にする
    dummySvg: encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="16" fill="#EEE"/>
        <circle cx="80" cy="64" r="28" fill="#CCC"/>
        <rect x="32" y="104" width="96" height="32" rx="8" fill="#DDD"/>
      </svg>`
    ),
  };

  // ===== Cookie操作のユーティリティ =====
  // jQuery Cookieプラグインを使ったCookie操作を抽象化
  // プラグインが無い環境でもエラーを起こさないようガード処理を含む
  const Cookie = {
    // jQuery Cookieプラグインが利用可能かチェック
    // 戻り値: true = 利用可能, false = 未ロード
    isAvailable: () => typeof $.cookie === "function",

    // Cookieをセット（プラグイン利用可能な場合のみ）
    // key: Cookie名, val: 保存する値（通常は "1"）
    // 戻り値: 成功時はtrueish、失敗時はfalse
    set: (key, val) =>
      Cookie.isAvailable() && $.cookie(key, val, CONFIG.cookieOpts),

    // Cookieが "1" にセットされているかチェック
    // key: Cookie名
    // 戻り値: true = "1"が保存されている, false = 未設定or別の値
    get: (key) => (Cookie.isAvailable() ? $.cookie(key) === "1" : false),

    // Cookieを削除
    // key: Cookie名
    remove: (key) =>
      Cookie.isAvailable() && $.removeCookie(key, CONFIG.cookieOpts),
  };

  // ===== バッジ関連のユーティリティ =====
  // バッジデータの解析・生成・取得を行う関数群
  const Badge = {
    // バッジを一意に識別するキーを生成
    // フォーマット: YYYY-MM-normalized-title
    // 例: 2024-01-sample-badge-title
    // y: 年（4桁）, m: 月（1〜12）, title: バッジタイトル
    // 戻り値: 正規化されたキー文字列
    makeKey: (y, m, title) =>
      `${y}-${String(m).padStart(2, "0")}-${
        title
          .toLowerCase() // 小文字化
          .replace(/\s+/g, "-") // 空白をハイフンに
          .replace(/[^\w\-ぁ-んァ-ヶ一-龠]/g, "") // 英数字・ハイフン・和文以外を除去
      }`,

    // Cookie名を生成（プレフィックス + バッジキー）
    // prefix: "badge_modal_seen_" or "badge_new_dismiss_"
    // badge: バッジオブジェクト（year, month, titleプロパティ必須）
    // 戻り値: 完全なCookie名
    cookieKey: (prefix, badge) =>
      prefix + Badge.makeKey(badge.year, badge.month, badge.title),

    // バッジタイトル文字列を構造化データにパース
    // 期待フォーマット: "2024年 1月： サンプルタイトル"
    // raw: 元のタイトル文字列
    // 戻り値: パース成功時は { year, month, title, dateLabel, start, end }、失敗時はnull
    parseTitle: (raw) => {
      // 正規表現で年・月・タイトルを抽出
      const m = String(raw)
        .trim()
        .match(/^(\d{4})年\s*(\d{1,2})月\s*[:：]\s*(.+)$/);
      if (!m) return null; // フォーマット不正

      const [, year, month, title] = m;
      const y = parseInt(year),
        mo = parseInt(month);

      return {
        year: y, // 年（数値）
        month: mo, // 月（数値）
        title: title.trim(), // タイトル（前後の空白除去）
        dateLabel: `${y}年${mo}月`, // 表示用ラベル
        start: new Date(y, mo - 1, 1), // 期間開始: 当月1日 0:00
        end: new Date(y, mo, 5), // 期間終了: 翌月5日 0:00（NEW表示期間）
      };
    },

    // NEW表示期間内かどうかをチェック
    // start: 期間開始日時, end: 期間終了日時, now: 現在日時（省略時は実際の現在時刻）
    // 戻り値: true = 期間内, false = 期間外
    isInNewWindow: (start, end, now = new Date()) => now >= start && now < end,

    // バッジ画像のソースURLを取得（無い場合はダミーSVGを返す）
    // src: 画像URL（空の場合もある）
    // 戻り値: 有効な画像URL（data URI含む）
    getImgSrc: (src) =>
      src || `data:image/svg+xml;charset=UTF-8,${CONFIG.dummySvg}`,

    // DOM（ul.badges li）から全バッジ情報を収集
    // 戻り値: バッジオブジェクトの配列 [{ year, month, title, index, raw, img, href, ... }, ...]
    collectAll: () => {
      const list = [];

      // 各<li>要素を走査
      $("ul.badges li").each(function (idx) {
        const $li = $(this),
          $a = $li.find("> a").first();

        // タイトルを取得（<a title="..."> > .badge-name のテキスト の優先順）
        const rawTitle =
          $a.attr("title") || $li.find(".badge-name").first().text() || "";

        // タイトルをパース
        const parsed = Badge.parseTitle(rawTitle);

        // パース失敗時は警告を出してスキップ
        if (!parsed) {
          console.warn("[WARN] バッジ形式不正:", rawTitle);
          return; // このバッジは無視
        }

        // パース済みデータに追加情報を付与してリストに追加
        list.push({
          ...parsed, // year, month, title, dateLabel, start, end
          index: idx, // DOMでの順序（0始まり）
          raw: rawTitle, // 元のタイトル文字列
          img: $li.find("img.badge-image").first().attr("src") || "", // 画像URL
          href: $a.attr("href") || "#", // リンク先
        });
      });

      return list;
    },
  };

  // ===== モーダル表示処理 =====
  // 獲得モーダルと詳細モーダルの表示ロジック
  const Modal = {
    // 獲得モーダルを表示（新規獲得バッジがあれば順次表示）
    // now: 現在日時（省略時は実際の現在時刻）
    showAcquired: (now = new Date()) => {
      const list = Badge.collectAll(); // 全バッジ取得

      // 表示対象バッジを抽出:
      // 1. NEW期間内（翌月5日まで）
      // 2. まだ獲得モーダルを表示していない（Cookie未設定）
      const targets = list
        .filter((b) => {
          const inWindow = Badge.isInNewWindow(b.start, b.end, now); // 期間チェック
          const seen = Cookie.get(Badge.cookieKey(CONFIG.modalPrefix, b)); // Cookie確認
          return inWindow && !seen; // 両方満たすもののみ
        })
        .sort((a, b) => a.index - b.index); // DOM順にソート（古い順）

      // 対象が無ければ何もしない
      if (!targets.length) return;

      // 再帰的に1つずつモーダルを表示する内部関数
      // index: 現在表示中のターゲット配列のインデックス
      const showNext = (index) => {
        // 全て表示し終わったら終了
        if (index >= targets.length) return;

        const badge = targets[index];
        const imgSrc = Badge.getImgSrc(badge.img); // 画像URL取得

        // キラキラエフェクト用のShineエレメントを8個生成
        // CSSで shine01〜shine08 のアニメーションが定義されている前提
        const shineElements = Array.from(
          { length: 8 },
          (_, i) =>
            `<div class="badge-acquired-head-shine shine0${i + 1}">
            <img src="${CONFIG.shineImageUrl}" alt="">
          </div>`
        ).join("");

        // モーダルのHTML構造を組み立て
        const html = `
          ${shineElements}
          <div class="badge-acquired-head"></div>
          <div class="badge-acquired-image">
            <img src="${imgSrc}" alt="${badge.raw}">
          </div>
          <h2 class="c-modal-wrap-title">
            おめでとうございます！<br />新しいバッジを獲得しました
          </h2>
          <a class="c-modal-wrap-button c-modal-wrap-close-tag badge-acquired-next-btn">確認しました</a>
        `;

        // このバッジの獲得モーダルを「表示済み」としてCookieに記録
        // これにより、次回ページ訪問時には同じバッジで再度モーダルが出ない
        Cookie.set(Badge.cookieKey(CONFIG.modalPrefix, badge), "1");

        // createModal関数（グローバルで定義済み想定）を使ってモーダルを生成・表示
        const modal = createModal({
          wrapClass: `badge-acquired-event badge-acquired badge-acquired-${index}`, // ユニークなクラス
          customModalHtml: html,
        });

        // 紙吹雪エフェクトを発動（canvas-confetti ライブラリ使用）
        confetti({
          colors: ["#FCAF17", "#B6D43E", "#28AFE7", "#AA68AA"], // 色の配列
          particleCount: 200, // パーティクル数
          spread: 120, // 広がり角度
          origin: { y: 0.6 }, // 発生位置（画面の60%の高さ）
          zIndex: 1000, // 重ね順
          ticks: 50, // アニメーション時間
          drift: 3, // 横方向のドリフト
        });

        // 「確認しました」ボタンをクリックしたら次のモーダルへ
        // .one() で1回だけ実行されるよう制御
        $(".badge-acquired-next-btn").one("click", function () {
          modal?.close(); // 現在のモーダルを閉じる
          setTimeout(() => showNext(index + 1), 300); // 0.3秒後に次を表示
        });
      };

      // 最初のモーダルから表示開始
      showNext(0);
    },

    // バッジ詳細モーダルを表示
    // badge: 表示するバッジオブジェクト
    // hadNew: このバッジにNEWが付いていたか（trueの場合、開くとNEWを既読化する）
    showDetail: (badge, hadNew = false) => {
      // NEWバッジが付いていた場合の処理
      if (hadNew) {
        // NEWを「非表示にした」フラグをCookieに保存
        // これにより次回以降はこのバッジにNEWが表示されなくなる
        Cookie.set(Badge.cookieKey(CONFIG.newPrefix, badge), "1");

        // DOMからNEWアイコンを即座に削除（視覚的にも消す）
        // data-badge-index でカードを特定
        $(
          `.dashboard-left-block-wrap-badge-block[data-badge-index="${badge.index}"] .newicon`
        ).remove();
      }

      const imgSrc = Badge.getImgSrc(badge.img); // 画像URL取得

      // 詳細モーダルのHTML構造
      const html = `
        <div class="badge-acquired-image">
          <img src="${imgSrc}" alt="${badge.raw}">
        </div>
        <h2 class="c-modal-wrap-title">
          ${badge.dateLabel}<br />${badge.title}
        </h2>
        <a class="c-modal-wrap-button c-modal-wrap-close-tag badge-acquired-next-btn">閉じる</a>
      `;

      // モーダル生成・表示
      const modal = createModal({
        close: true, // 閉じるボタンを表示
        wrapClass: "badge-acquired", // CSSクラス
        customModalHtml: html,
      });

      // 閉じるボタンのイベント設定
      // 名前空間（.badgeDetailClose）を使って多重登録を防止
      $(document)
        .off("click.badgeDetailClose") // 既存のイベントを削除
        .on("click.badgeDetailClose", ".badge-detail-modal .cm-close-btn", () =>
          modal?.close()
        );
    },
  };

  // ===== UI レンダリング処理 =====
  // 画面上のバッジカード表示とインタラクションを管理
  const UI = {
    // バッジブロック（カード一覧）を描画
    // max: 表示する最大件数（デフォルト6件）
    // now: 現在日時（NEW判定に使用）
    renderBadges: (max = CONFIG.defaultMaxBadges, now = new Date()) => {
      // コンテナ要素を取得または生成
      let $out = $(".dashboard-left-block-wrap-badge-content");
      if (!$out.length) {
        // 無ければ新規作成
        $out = $('<div class="dashboard-left-block-wrap-badge-content"></div>');
        // ul.badges の直後に挿入（無ければbody末尾）
        $("ul.badges").length
          ? $("ul.badges").after($out)
          : $("body").append($out);
      }

      const list = Badge.collectAll(); // 全バッジ取得
      const items = list.slice(0, max); // 指定件数に制限
      $out.empty(); // 既存の内容をクリア（再描画）

      // 実際のバッジカードを生成
      items.forEach((b) => {
        // NEW表示判定:
        // 1. NEW期間内か
        const inWindow = Badge.isInNewWindow(b.start, b.end, now);
        // 2. まだ詳細を見ていない（NEW非表示Cookieが無い）
        const dismissed = Cookie.get(Badge.cookieKey(CONFIG.newPrefix, b));
        // 両方満たせばNEWを表示
        const showNew = inWindow && !dismissed;

        const imgSrc = Badge.getImgSrc(b.img); // 画像URL取得

        // カードのDOM要素を生成
        // data-badge-index: 後でこのカードを特定するための識別子
        const $card = $(`
          <div class="dashboard-left-block-wrap-badge-block" data-badge-index="${
            b.index
          }">
            <div class="dashboard-left-block-wrap-badge-block-img">
              ${
                showNew
                  ? '<div class="newicon"><img src="http://localhost:3000/static/images/icon_badge_new.svg"></div>'
                  : ""
              }
              <img src="${imgSrc}" alt="${b.raw}" class="badge-image">
            </div>
          </div>
        `).on("click", () => Modal.showDetail(b, showNew)); // クリックで詳細モーダルを開く
        // showNew=true の場合、モーダルを開くとNEWが既読化される

        $out.append($card); // カードを追加
      });

      // ダミーカードで穴埋め（表示枠を統一するため）
      // 例: バッジが4件の場合、残り2件分のダミーを追加
      for (let i = items.length; i < max; i++) {
        $out.append(`
          <div class="dashboard-left-block-wrap-badge-block">
            <div class="dashboard-left-block-wrap-badge-block-img">
              <div><img src="http://localhost:3000/static/images/badge_dummy.svg" class="badge-image"></div>
            </div>
          </div>
        `);
      }

      // 全件表示時（max > CONFIG.defaultMaxBadges）で奇数の場合、空のダミーを1つ追加
      // レイアウトを整えるため（2列表示の場合に1つだけ余るのを防ぐ）
      if (max > CONFIG.defaultMaxBadges && items.length % 2 === 1) {
        $out.append(`
          <div class="dashboard-left-block-wrap-badge-block" data-badge-index="dummy">
            <div class="dashboard-left-block-wrap-badge-block-img">
            </div>
          </div>
        `);
      }

      // UI要素の表示/非表示制御
      // .display-badge: バッジが1件以上あれば表示
      $(".display-badge").toggle(list.length >= 1);
      // .dashboard-left-block-wrap-badge-readmore: バッジが7件以上あれば「もっと見る」を表示
      $(".dashboard-left-block-wrap-badge-readmore").toggle(list.length >= 7);
    },

    // 「もっと見る」「表示を元に戻す」トグル機能のセットアップ
    setupToggle: () => {
      let isExpanded = false; // 展開状態を管理するフラグ

      // 「もっと見る」リンクのクリックイベント
      $(document).on(
        "click",
        ".dashboard-left-block-wrap-badge-readmore a",
        function (e) {
          e.preventDefault(); // デフォルトのリンク動作を無効化

          const list = Badge.collectAll(); // 現在のバッジ数を取得

          // 展開状態に応じて表示件数を切り替え
          const max = isExpanded ? CONFIG.defaultMaxBadges : list.length; // 閉じる: 6件、開く: 全件
          UI.renderBadges(max); // 再描画

          // リンクテキストを切り替え
          $(this).text(isExpanded ? "もっと見る" : "表示を元に戻す");

          // 状態を反転
          isExpanded = !isExpanded;
        }
      );
    },
  };

  // ===== デバッグ機能（本番では削除可能） =====
  // 開発時のテスト・デバッグ用機能
  // 本番リリース時は Debug.createButton() の呼び出しを削除すればOK
  const Debug = {
    // バッジ関連のCookieを全て削除
    // 獲得モーダルやNEW表示のテストを何度も行いたい時に使用
    clearAllCookies: () => {
      // document.cookie から全てのCookieを取得
      const cookies = document.cookie
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);

      // バッジ関連Cookie（MODAL_PREFIX or NEW_PREFIX で始まるもの）を抽出
      const targets = cookies.filter(
        (c) =>
          c.startsWith(CONFIG.modalPrefix) || c.startsWith(CONFIG.newPrefix)
      );

      // 対象が無ければ終了
      if (!targets.length) {
        console.log("[DEBUG] 対象Cookieなし");
        return;
      }

      // 各Cookieを削除
      targets.forEach((c) => {
        const name = c.split("=")[0]; // Cookie名を抽出
        Cookie.remove(name); // jQuery Cookieで削除
        // 念のため生のCookie操作でも削除（Max-Age=0で即座に無効化）
        document.cookie = `${name}=; Max-Age=0; path=/;`;
      });

      console.log(
        "[DEBUG] 削除:",
        targets.map((c) => c.split("=")[0])
      );
      alert("バッジCookieをリセットしました"); // ユーザーへ通知
      location.reload(); // ページをリロードして変更を反映
    },

    // デバッグボタンUIを画面左下に生成
    // ボタンをクリックするとclearAllCookies()が実行される
    createButton: () => {
      const $btn = $(`
        <button id="badge-debug-btn" style="
          position: fixed;         /* 画面に固定 */
          bottom: 20px;            /* 下から20px */
          left: 20px;              /* 左から20px */
          z-index: 9999;           /* 最前面に表示 */
          padding: 10px 16px;      /* 内側の余白 */
          background: #333;        /* 背景色（ダークグレー） */
          color: #fff;             /* 文字色（白） */
          border: none;            /* 枠線なし */
          border-radius: 4px;      /* 角丸 */
          cursor: pointer;         /* カーソルをポインターに */
          font-size: 12px;         /* 文字サイズ */
          box-shadow: 0 2px 8px rgba(0,0,0,0.3); /* 影を付けて浮かせる */
        ">Cookie削除</button>
      `).on("click", Debug.clearAllCookies); // クリックでCookie削除実行

      $("body").append($btn); // bodyに追加
    },
  };

  // ===== 初期化処理 =====
  // DOMの準備が完了したら実行
  $(function () {
    const now = new Date(); // 現在日時を1回だけ取得（全処理で統一）

    UI.renderBadges(CONFIG.defaultMaxBadges, now); // バッジカード一覧を描画
    UI.setupToggle(); // 「もっと見る」機能をセットアップ
    Modal.showAcquired(now); // 新規獲得バッジがあればモーダル表示

    // ===== デバッグボタン有効化（本番では次の行をコメントアウトまたは削除） =====
    Debug.createButton();
  });
}
