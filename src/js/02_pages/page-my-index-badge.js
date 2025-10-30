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
  // ===== 設定値 =====
  // 各種定数をCONFIGオブジェクトに集約
  // メンテナンス時はここを編集するだけで全体に反映される
  const CONFIG = {
    // Cookie設定: 365日間有効、サイト全体で共有
    cookieOpts: { expires: 365, path: "/" },

    // 獲得モーダル表示済みフラグのCookie名プレフィックス
    // 例: "badge_modal_seen_2024-01-sample-title"
    modalPrefix: "badge_modal_seen_",

    // NEWバッジ非表示フラグのCookie名プレフィックス
    // 例: "badge_new_dismiss_2024-01-sample-title"
    newPrefix: "badge_new_dismiss_",

    // デフォルト表示件数（「もっと見る」クリック前）
    defaultMaxBadges: 6,

    // 獲得モーダルのキラキラエフェクト画像URL
    shineImageUrl: "http://localhost:3000/static/images/modal-shine.png",

    // バッジ画像が無い時のダミーSVG（data URI化してサーバーリクエスト回避）
    dummySvg: encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="16" fill="#EEE"/>
        <circle cx="80" cy="64" r="28" fill="#CCC"/>
        <rect x="32" y="104" width="96" height="32" rx="8" fill="#DDD"/>
      </svg>`
    ),
  };

  // ===== Cookie操作 =====
  // jQuery Cookieプラグイン（$.cookie）のラッパー
  // プラグイン未ロード時もエラーを起こさないようガード処理を含む
  const Cookie = {
    // jQuery Cookieプラグインが利用可能かチェック
    isAvailable: () => typeof $.cookie === "function",

    // Cookieをセット（プラグイン利用可能な場合のみ）
    // @param {string} key - Cookie名
    // @param {string} val - 保存する値（通常 "1" をフラグとして使用）
    set: (key, val) =>
      Cookie.isAvailable() && $.cookie(key, val, CONFIG.cookieOpts),

    // Cookieが "1" にセットされているかチェック
    // @param {string} key - Cookie名
    // @return {boolean} "1" なら true（フラグON）、それ以外は false
    get: (key) => (Cookie.isAvailable() ? $.cookie(key) === "1" : false),

    // Cookieを削除
    // 注意: $.removeCookie() は path 指定が必要なため CONFIG.cookieOpts を渡す
    remove: (key) =>
      Cookie.isAvailable() && $.removeCookie(key, CONFIG.cookieOpts),
  };

  // ===== バッジ関連ユーティリティ =====
  const Badge = {
    // バッジを一意に識別するキーを生成
    // フォーマット: YYYY-MM-normalized-title（例: 2024-01-sample-badge）
    // 
    // @param {number} y - 年
    // @param {number} m - 月
    // @param {string} title - バッジタイトル
    // @return {string} 正規化されたキー
    // 
    // 正規化: 小文字化、空白→ハイフン、英数字・ハイフン・和文以外を除去
    // 目的: Cookie名やdata属性に使える安全な文字列を生成
    makeKey: (y, m, title) =>
      `${y}-${String(m).padStart(2, "0")}-${title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-ぁ-んァ-ヶ一-龠]/g, "")}`,

    // Cookie名を生成（プレフィックス + バッジキー）
    // @param {string} prefix - modalPrefix or newPrefix
    // @param {Object} badge - バッジオブジェクト
    cookieKey: (prefix, badge) =>
      prefix + Badge.makeKey(badge.year, badge.month, badge.title),

    // バッジタイトルをパースして構造化データに変換
    // 入力例: "2024年 1月： サンプルタイトル"
    // 
    // @param {string} raw - 元のタイトル文字列
    // @return {Object|null} パース成功時は構造化データ、失敗時は null
    // 
    // 戻り値の構造:
    // {
    //   year: 2024,
    //   month: 1,
    //   title: "サンプルタイトル",
    //   dateLabel: "2024年1月",
    //   start: Date,  // NEW期間開始: 当月1日 0:00
    //   end: Date     // NEW期間終了: 翌月5日 0:00
    // }
    parseTitle: (raw) => {
      // 正規表現で年・月・タイトルを抽出
      // パターン: "YYYY年 M月： タイトル"（空白は任意）
      const m = String(raw)
        .trim()
        .match(/^(\d{4})年\s*(\d{1,2})月\s*[:：]\s*(.+)$/);

      if (!m) return null;

      const [, year, month, title] = m;
      const y = parseInt(year, 10);
      const mo = parseInt(month, 10);

      return {
        year: y,
        month: mo,
        title: title.trim(),
        dateLabel: `${y}年${mo}月`,
        // NEW表示期間: 当月1日〜翌月5日
        // 注意: Dateコンストラクタの月は0始まりなので mo - 1
        start: new Date(y, mo - 1, 1),
        end: new Date(y, mo, 5),
      };
    },

    // NEW表示期間内かチェック（start <= now < end）
    // @param {Date} start - 期間開始
    // @param {Date} end - 期間終了
    // @param {Date} [now] - 現在日時（省略時は実際の現在時刻）
    isInNewWindow: (start, end, now = new Date()) => now >= start && now < end,

    // バッジ画像URLを取得（無い場合はダミーSVGを返す）
    // @param {string} src - 画像URL
    // @return {string} 有効な画像URL（data URI含む）
    getImgSrc: (src) =>
      src || `data:image/svg+xml;charset=UTF-8,${CONFIG.dummySvg}`,

    // DOM（ul.badges li）から全バッジ情報を収集
    // @return {Array<Object>} バッジオブジェクトの配列
    // 
    // 各バッジの構造:
    // {
    //   year, month, title, dateLabel, start, end,  // parseTitle() から
    //   index: 0,        // DOM順序（0始まり）
    //   raw: "...",      // 元のタイトル文字列
    //   img: "http://...", // 画像URL
    //   href: "#"        // リンク先URL
    // }
    collectAll: () => {
      const list = [];

      $("ul.badges li").each(function (idx) {
        const $li = $(this);
        const $a = $li.find("> a").first();

        // タイトル取得（優先順位: a[title] > .badge-name のテキスト）
        const rawTitle =
          $a.attr("title") || $li.find(".badge-name").first().text() || "";

        const parsed = Badge.parseTitle(rawTitle);

        // パース失敗時は警告を出してスキップ
        if (!parsed) {
          console.warn("[WARN] バッジ形式不正（スキップ）:", rawTitle);
          return;
        }

        list.push({
          ...parsed,
          index: idx,
          raw: rawTitle,
          img: $li.find("img.badge-image").first().attr("src") || "",
          href: $a.attr("href") || "#",
        });
      });

      return list;
    },
  };

  // ===== モーダル表示 =====
  // グローバル関数 createModal() を使用する前提
  const Modal = {
    // 獲得モーダルを表示（新規獲得バッジがあれば順次表示）
    // @param {Date} [now] - 現在日時
    // 
    // 処理フロー:
    // 1. 全バッジを取得
    // 2. NEW期間内 && モーダル未表示のバッジを抽出
    // 3. 1つずつモーダル表示（「確認」押下で次へ）
    // 4. 表示済みをCookieに記録
    showAcquired: (now = new Date()) => {
      const list = Badge.collectAll();

      // 表示対象: NEW期間内 かつ モーダル未表示
      const targets = list
        .filter((b) => {
          const inWindow = Badge.isInNewWindow(b.start, b.end, now);
          const seen = Cookie.get(Badge.cookieKey(CONFIG.modalPrefix, b));
          return inWindow && !seen;
        })
        .sort((a, b) => a.index - b.index); // DOM順にソート

      if (!targets.length) return;

      // 再帰的に1つずつモーダルを表示
      const showNext = (index) => {
        if (index >= targets.length) return;

        const badge = targets[index];
        const imgSrc = Badge.getImgSrc(badge.img);

        // キラキラエフェクト用の要素を8個生成
        // CSSで shine01〜shine08 のアニメーションが定義されている前提
        const shineElements = Array.from(
          { length: 8 },
          (_, i) =>
            `<div class="badge-acquired-head-shine shine0${i + 1}">
            <img src="${CONFIG.shineImageUrl}" alt="">
          </div>`
        ).join("");

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

        // 表示済みフラグをCookieに記録（次回訪問時は表示されない）
        Cookie.set(Badge.cookieKey(CONFIG.modalPrefix, badge), "1");

        const modal = createModal({
          wrapClass: `badge-acquired-event badge-acquired badge-acquired-${index}`,
          customModalHtml: html,
        });

        // 紙吹雪エフェクト（canvas-confetti ライブラリ）
        confetti({
          colors: ["#FCAF17", "#B6D43E", "#28AFE7", "#AA68AA"],
          particleCount: 200,
          spread: 120,
          origin: { y: 0.6 },
          zIndex: 1000,
          ticks: 50,
          drift: 3,
        });

        // 「確認しました」押下で次のモーダルへ
        // .one() で1回だけ実行（多重クリック防止）
        $(".badge-acquired-next-btn").one("click", function () {
          modal?.close();
          setTimeout(() => showNext(index + 1), 300);
        });
      };

      showNext(0);
    },

    // バッジ詳細モーダルを表示
    // @param {Object} badge - バッジオブジェクト
    // @param {boolean} [hadNew=false] - NEWバッジ付きだったか
    // 
    // hadNew=true の場合:
    // - NEWを「非表示にした」フラグをCookieに保存
    // - DOMからNEWアイコンを即座に削除
    // → 次回以降はこのバッジにNEWが表示されなくなる（既読化）
    showDetail: (badge, hadNew = false) => {
      if (hadNew) {
        // 既読化処理
        Cookie.set(Badge.cookieKey(CONFIG.newPrefix, badge), "1");
        $(
          `.dashboard-left-block-wrap-badge-block[data-badge-index="${badge.index}"] .newicon`
        ).remove();
      }

      const imgSrc = Badge.getImgSrc(badge.img);

      const html = `
        <div class="badge-acquired-image badge-acquired-image-shine">
          <img src="${imgSrc}" alt="${badge.raw}">
        </div>
        <h2 class="c-modal-wrap-title">
          ${badge.dateLabel}<br />${badge.title}
        </h2>
        <a class="c-modal-wrap-button c-modal-wrap-close-tag badge-acquired-next-btn">閉じる</a>
      `;

      const modal = createModal({
        close: true,
        wrapClass: "badge-acquired",
        customModalHtml: html,
      });

      // 閉じるボタンのイベント設定
      // 名前空間（.badgeDetailClose）で多重登録を防止
      $(document)
        .off("click.badgeDetailClose")
        .on(
          "click.badgeDetailClose",
          ".badge-detail-modal .cm-close-btn",
          () => modal?.close()
        );
    },
  };

  // ===== UI レンダリング =====
  const UI = {
    // バッジカード一覧を描画
    // @param {number} [max] - 表示する最大件数
    // @param {Date} [now] - 現在日時（NEW判定用）
    // 
    // 処理フロー:
    // 1. コンテナ要素を取得または生成
    // 2. 全バッジを取得して指定件数に制限
    // 3. 各バッジをカードとして描画（NEW判定含む）
    // 4. 不足分をダミーカードで埋める（レイアウト統一）
    // 5. 表示/非表示の制御
    renderBadges: (max = CONFIG.defaultMaxBadges, now = new Date()) => {
      let $out = $(".dashboard-left-block-wrap-badge-content");
      
      // コンテナが無ければ生成して挿入
      if (!$out.length) {
        $out = $('<div class="dashboard-left-block-wrap-badge-content"></div>');
        const $badges = $("ul.badges");
        if ($badges.length) {
          $badges.after($out);
        } else {
          $("body").append($out);
        }
      }

      const list = Badge.collectAll();
      const items = list.slice(0, max);
      $out.empty();

      // バッジカードを生成
      items.forEach((b) => {
        // NEW表示判定: 期間内 かつ 未閲覧
        const inWindow = Badge.isInNewWindow(b.start, b.end, now);
        const dismissed = Cookie.get(Badge.cookieKey(CONFIG.newPrefix, b));
        const showNew = inWindow && !dismissed;

        const imgSrc = Badge.getImgSrc(b.img);

        // カードDOM生成（data-badge-index で後から特定できるようにする）
        const $card = $(`
          <div class="dashboard-left-block-wrap-badge-block" data-badge-index="${b.index}">
            <div class="dashboard-left-block-wrap-badge-block-img">
              ${
                showNew
                  ? `<div class="newicon">
                      <div class="newicon-wrapper">
                        <div class="newicon-type">
                          <img src="http://localhost:3000/static/images/text_badge_typenew.svg" alt="NEW">
                        </div>
                        <div class="newicon-bg">
                          <img src="http://localhost:3000/static/images/icon_badge_bgnew.svg" alt="">
                        </div>
                      </div>
                    </div>`
                  : ""
              }
              <img src="${imgSrc}" alt="${b.raw}" class="badge-image">
            </div>
          </div>
        `).on("click", () => {
          // クリックで詳細モーダルを開く（NEWが付いていれば既読化される）
          Modal.showDetail(b, showNew);
        });

        $out.append($card);
      });

      // ダミーカードで穴埋め（グリッドレイアウトを整える）
      for (let i = items.length; i < max; i++) {
        $out.append(`
          <div class="dashboard-left-block-wrap-badge-block">
            <div class="dashboard-left-block-wrap-badge-block-img">
              <div><img src="http://localhost:3000/static/images/badge_dummy.svg" class="badge-image" alt=""></div>
            </div>
          </div>
        `);
      }

      // 全件表示時の奇数調整（2列レイアウト対応）
      if (max > CONFIG.defaultMaxBadges && items.length % 2 === 1) {
        $out.append(`
          <div class="dashboard-left-block-wrap-badge-block" data-badge-index="dummy">
            <div class="dashboard-left-block-wrap-badge-block-img">
            </div>
          </div>
        `);
      }

      // UI要素の表示/非表示制御
      $(".display-badge").toggle(list.length >= 1);
      $(".dashboard-left-block-wrap-badge-readmore").toggle(list.length >= 7);
    },

    // 「もっと見る」「表示を元に戻す」トグル機能
    // 
    // 動作:
    // - 初期: 6件表示 + 「もっと見る」
    // - クリック: 全件表示 + 「表示を元に戻す」
    // - 再クリック: 6件表示に戻る
    // 
    // 注意: イベント委譲で動的DOM再生成に対応
    setupToggle: () => {
      let isExpanded = false;

      $(document).on(
        "click",
        ".dashboard-left-block-wrap-badge-readmore a",
        function (e) {
          e.preventDefault();

          const list = Badge.collectAll();
          const max = isExpanded ? CONFIG.defaultMaxBadges : list.length;
          
          UI.renderBadges(max);

          $(this).text(isExpanded ? "もっと見る" : "表示を元に戻す");
          isExpanded = !isExpanded;
        }
      );
    },
  };

  // ===== デバッグ機能 =====
  // 本番では Debug.createButton() の呼び出しを削除
  const Debug = {
    // バッジ関連Cookieを全削除してリロード
    // 獲得モーダルやNEW表示のテストを繰り返し行う際に使用
    clearAllCookies: () => {
      const cookies = document.cookie
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);

      // バッジ関連Cookie（modalPrefix or newPrefix で始まるもの）を抽出
      const targets = cookies.filter(
        (c) =>
          c.startsWith(CONFIG.modalPrefix) || c.startsWith(CONFIG.newPrefix)
      );

      if (!targets.length) {
        console.log("[DEBUG] 対象Cookieなし");
        return;
      }

      // 各Cookieを削除（jQuery Cookie + 生のCookie操作で確実に削除）
      targets.forEach((c) => {
        const name = c.split("=")[0];
        Cookie.remove(name);
        // 念のため生の操作でも削除（Max-Age=0で即座に無効化）
        document.cookie = `${name}=; Max-Age=0; path=/;`;
      });

      console.log(
        "[DEBUG] 削除:",
        targets.map((c) => c.split("=")[0])
      );
      alert("バッジCookieをリセットしました");
      location.reload();
    },

    // デバッグボタンを画面左下に配置
    createButton: () => {
      const $btn = $(`
        <button id="badge-debug-btn" style="
          position: fixed;
          bottom: 20px;
          left: 20px;
          z-index: 9999;
          padding: 10px 16px;
          background: #333;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">Cookie削除</button>
      `).on("click", Debug.clearAllCookies);

      $("body").append($btn);
    },
  };

  // ===== 初期化 =====
  $(function () {
    try {
      const now = new Date();

      UI.renderBadges(CONFIG.defaultMaxBadges, now);
      UI.setupToggle();
      Modal.showAcquired(now);

      // デバッグボタン有効化（本番では削除）
      Debug.createButton();
    } catch (error) {
      console.error("[ERROR] バッジシステム初期化エラー:", error);
    }
  });
}