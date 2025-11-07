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

if (bodyId === "page-my-index") { // ダッシュボード以外では一切動かさない
  // ===== 設定値 =====
  // 各種定数をCONFIGオブジェクトに集約
  // メンテナンス時はここを編集するだけで全体に反映される
  const CONFIG = {
    // Cookie設定: 365日間有効、サイト全体で共有
    cookieOpts: { expires: 365, path: "/" }, // jQuery Cookieのオプションを一元管理

    // 獲得モーダル表示済みフラグのCookie名プレフィックス
    // 例: "badge_modal_seen_2024-01-sample-title"
    modalPrefix: "badge_modal_seen_", // 獲得モーダル既読管理のキー接頭辞

    // NEWバッジ非表示フラグのCookie名プレフィックス
    // 例: "badge_new_dismiss_2024-01-sample-title"
    newPrefix: "badge_new_dismiss_", // NEWの既読管理のキー接頭辞

    // デフォルト表示件数（「もっと見る」クリック前）
    defaultMaxBadges: 6, // 初期のカード表示上限

    // 獲得モーダルのキラキラエフェクト画像URL
    ImgBadgeShine: "https://waomirai.com/lp/assets/moodle/images/modal-shine.png",
  
    // バッジ画像
    ImgbadgeNewBg: "https://waomirai.com/lp/assets/moodle/images/icon_badge_bgnew.svg",
    ImgbadgeNewType: "https://waomirai.com/lp/assets/moodle/images/text_badge_typenew.svg",
    ImgbadgeDummy: "https://waomirai.com/lp/assets/moodle/images/badge_dummy.svg",

    // トグルボタンのHTML（ここで直接編集可能）
    toggleHtml: {
      more: "<span class='material-symbols material-symbols-outlined'>keyboard_arrow_down</span><span class='text'>全て表示する</span>",
      less: "<span class='material-symbols material-symbols-outlined'>keyboard_arrow_up</span><span class='text'>少なく表示する</span>"
    }
  };

  // ===== Cookie操作 =====
  // jQuery Cookieプラグイン（$.cookie）のラッパー
  // プラグイン未ロード時もエラーを起こさないようガード処理を含む
  const Cookie = {
    // jQuery Cookieプラグインが利用可能かチェック
    isAvailable: () => typeof $.cookie === "function", // 依存を安全に確認

    // Cookieをセット（プラグイン利用可能な場合のみ）
    // @param {string} key - Cookie名
    // @param {string} val - 保存する値（通常 "1" をフラグとして使用）
    set: (key, val) =>
      Cookie.isAvailable() && $.cookie(key, val, CONFIG.cookieOpts), // 利用可能時のみ実行

    // Cookieが "1" にセットされているかチェック
    // @param {string} key - Cookie名
    // @return {boolean} "1" なら true（フラグON）、それ以外は false
    get: (key) => (Cookie.isAvailable() ? $.cookie(key) === "1" : false), // 未読= false の判定に使用

    // Cookieを削除
    // 注意: $.removeCookie() は path 指定が必要なため CONFIG.cookieOpts を渡す
    remove: (key) =>
      Cookie.isAvailable() && $.removeCookie(key, CONFIG.cookieOpts), // パス一致必須
  };

  // ===== バッジ関連ユーティリティ =====
  const Badge = {
      // バッジを一意に識別するキーを生成
      // フォーマット: YYYY-MM-pluginfile-id（例: 2024-01-2650）
      // 
      // @param {number} y - 年
      // @param {number} m - 月
      // @param {string} imgPath - バッジ画像パス
      // @param {string} title - バッジタイトル（フォールバック用）
      // @return {string} 正規化されたキー
      // 
      // 処理:
      // 1. 画像パスから pluginfile.php/の次の数値（ID）を抽出
      // 2. 抽出失敗時はタイトルから正規化したキーを生成
      makeKey: (y, m, imgPath, title) => {
        const yearMonth = `${y}-${String(m).padStart(2, "0")}`;
        
        // pluginfile.php/の次の数値を抽出（例: pluginfile.php/2650/... → 2650）
        const match = String(imgPath).match(/pluginfile\.php\/(\d+)/);
        
        if (match && match[1]) {
          // ID抽出成功
          return `${yearMonth}-${match[1]}`;
        }
        
        // ID抽出失敗時はタイトルから生成（フォールバック）
        const normalizedTitle = title
          .toLowerCase() // 小文字化
          .replace(/\s+/g, "-") // 空白をハイフンに
          .replace(/[^\w\-ぁ-んァ-ヶ一-龠]/g, ""); // 許可文字以外を除去
        
        return `${yearMonth}-${normalizedTitle}`;
      },

      // Cookie名を生成（プレフィックス + バッジキー）
      // @param {string} prefix - modalPrefix or newPrefix
      // @param {Object} badge - バッジオブジェクト
      cookieKey: (prefix, badge) =>
        prefix + Badge.makeKey(badge.year, badge.month, badge.img, badge.title), // 画像パスとタイトルを使用

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
      //   end: Date     // NEW期間終了: 翌月15日 0:00
      // }
      parseTitle: (raw) => {
        // 正規表現で年・月・タイトルを抽出
        // パターン: "YYYY年 M月： タイトル"（空白は任意）
        const m = String(raw)
          .trim() // 前後空白除去
          .match(/^(\d{4})年\s*(\d{1,2})月\s*[:：]\s*(.+)$/); // 年・月・タイトルをキャプチャ

        if (!m) return null; // 想定外フォーマットはスキップ対象

        const [, year, month, title] = m; // 正規表現のグループ展開
        const y = parseInt(year, 10); // 数値化（安全のため基数10）
        const mo = parseInt(month, 10);

        return {
          year: y,
          month: mo,
          title: title.trim(), // タイトル内の前後空白も除去
          dateLabel: `${y}年${mo}月`, // UI表示用ラベル
          // NEW表示期間: 当月1日〜翌月5日
          // 注意: Dateコンストラクタの月は0始まりなので mo - 1
          start: new Date(y, mo - 1, 1), // NEW判定の下限
          end: new Date(y, mo, 15), // NEW判定の上限（翌月15日 0:00）
        };
      },

      // NEW表示期間内かチェック（start <= now < end）
      // @param {Date} start - 期間開始
      // @param {Date} end - 期間終了
      // @param {Date} [now] - 現在日時（省略時は実際の現在時刻）
      isInNewWindow: (start, end, now = new Date()) => now >= start && now < end, // 半開区間で比較

      // バッジ画像URLを取得（無い場合はダミーSVGを返す）
      // @param {string} src - 画像URL
      // @return {string} 有効な画像URL（data URI含む）
      getImgSrc: (src) =>
        src || CONFIG.ImgbadgeDummy, // ← ダミー画像用のURLを使用

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
        const list = []; // 結果の蓄積配列

        $("ul.badges li").each(function (idx) { // 各<li>を順に処理（idxはDOM順）
          const $li = $(this);
          const $a = $li.find("> a").first(); // 直下の<a>を採用（ネスト対策）

          // タイトル取得（優先順位: a[title] > .badge-name のテキスト）
          const rawTitle =
            $a.attr("title") || $li.find(".badge-name").first().text() || ""; // どれも無ければ空

          const parsed = Badge.parseTitle(rawTitle); // タイトルを構造化

          // パース失敗時は警告を出してスキップ
          if (!parsed) {
            console.warn("[WARN] バッジ形式不正（スキップ）:", rawTitle); // 運用時の検知用ログ
            return; // この<li>は無視
          }

          list.push({
            ...parsed, // year/month/title等を展開
            index: idx, // DOM順を保持（ソートやdata属性に使用） // ← 例の位置にコメント
            raw: rawTitle, // 元文字列（デバッグやalt表示に使用） // ← 例の位置にコメント
            img: $li.find("img.badge-image").first().attr("src") || "", // サムネURL。無ければ空文字 // ← 例の位置にコメント
            href: $a.attr("href") || "#", // 詳細リンク。欠損時はダミー # // ← 例の位置にコメント
          });
        });

        return list; // 収集結果を返す
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
      const list = Badge.collectAll(); // 現在のDOMから一覧生成

      // 表示対象: NEW期間内 かつ モーダル未表示
      const targets = list
        .filter((b) => {
          const inWindow = Badge.isInNewWindow(b.start, b.end, now); // ← 例の位置にコメント（NEW期間判定）
          const seen = Cookie.get(Badge.cookieKey(CONFIG.modalPrefix, b)); // すでに「獲得モーダル」出したか
          return inWindow && !seen; // 条件を満たすものだけ残す
        })
        .sort((a, b) => a.index - b.index); // DOM順にソート（表示順の安定化）

      if (!targets.length) return; // 対象なしなら何もしない

      // 再帰的に1つずつモーダルを表示
      const showNext = (index) => {
        if (index >= targets.length) return; // すべて表示済み

        const badge = targets[index];
        const imgSrc = Badge.getImgSrc(badge.img); // 欠損時はダミーSVGにフォールバック

        // キラキラエフェクト用の要素を8個生成
        // CSSで shine01〜shine08 のアニメーションが定義されている前提
        const shineElements = Array.from(
          { length: 8 },
          (_, i) =>
            `<div class="badge-acquired-head-shine shine0${i + 1}">
            <img src="${CONFIG.ImgBadgeShine}" alt="">
          </div>`
        ).join(""); // 事前にHTML文字列をまとめて生成（DOM操作最小化）

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
        Cookie.set(Badge.cookieKey(CONFIG.modalPrefix, badge), "1"); // ここで即時既読化

        const modal = createModal({
          wrapClass: `badge-acquired-event badge-acquired badge-acquired-${index}`, // 個別クラスでデバッグ容易化
          customModalHtml: html, // 既存のモーダルユーティリティに委譲
        });

        // 紙吹雪エフェクト（canvas-confetti ライブラリ）
        confetti({
          colors: ["#FCAF17", "#B6D43E", "#28AFE7", "#AA68AA"], // ブランドカラー想定
          particleCount: 200, // 粒子数
          spread: 120, // 拡がり
          origin: { y: 0.6 }, // 発生位置（下寄り）
          zIndex: 1000, // モーダルより前面に
          ticks: 50, // 寿命
          drift: 3, // 風のような流れ
        });

        // 「確認しました」押下で次のモーダルへ
        // .one() で1回だけ実行（多重クリック防止）
        $(".badge-acquired-next-btn").one("click", function () {
          modal?.close(); // モーダルを閉じる（存在チェック込み）
          setTimeout(() => showNext(index + 1), 300); // 次を短い間隔で表示（連打防止）
        });
      };

      showNext(0); // 先頭から開始
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
        Cookie.set(Badge.cookieKey(CONFIG.newPrefix, badge), "1"); // NEWピルの既読フラグを保存
        $(
          `.dashboard-left-block-wrap-badge-block[data-badge-index="${badge.index}"] .newicon`
        ).remove(); // 画面上から即時削除（体験の一貫性）
      }

      const imgSrc = Badge.getImgSrc(badge.img); // 画像URLの最終決定

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
        close: true, // ×ボタン有効
        wrapClass: "badge-acquired", // 既存スタイルを再利用
        customModalHtml: html, // HTMLは外部CSS前提で最小限
      });

      // 閉じるボタンのイベント設定
      // 名前空間（.badgeDetailClose）で多重登録を防止
      $(document)
        .off("click.badgeDetailClose") // 既存ハンドラをクリア
        .on(
          "click.badgeDetailClose",
          ".badge-detail-modal .cm-close-btn",
          () => modal?.close() // 安全にクローズ
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
      let $out = $(".dashboard-left-block-wrap-badge-content"); // 既存コンテナの取得
      
      // コンテナが無ければ生成して挿入
      if (!$out.length) {
        $out = $('<div class="dashboard-left-block-wrap-badge-content"></div>'); // 動的生成
        const $badges = $("ul.badges");
        if ($badges.length) {
          $badges.after($out); // 既存リストの直後に配置
        } else {
          $("body").append($out); // 最低限のフォールバック
        }
      }

      const list = Badge.collectAll(); // 最新DOMからリスト化
      const items = list.slice(0, max); // 表示件数に制限
      $out.empty(); // 再描画のためクリア

      // バッジカードを生成
      items.forEach((b) => {
        // NEW表示判定: 期間内 かつ 未閲覧
        const inWindow = Badge.isInNewWindow(b.start, b.end, now); // NEW期間内か
        const dismissed = Cookie.get(Badge.cookieKey(CONFIG.newPrefix, b)); // 既にNEWを消しているか
        const showNew = inWindow && !dismissed; // 表示条件を集約 // ← 例の位置にコメント

        const imgSrc = Badge.getImgSrc(b.img); // 画像URLの最終決定

        // カードDOM生成（data-badge-index で後から特定できるようにする）
        const $card = $(`
          <div class="dashboard-left-block-wrap-badge-block dashboard-left-block-wrap-badge-block-img-clickable" data-badge-index="${b.index}">
            <div class="dashboard-left-block-wrap-badge-block-img">
              ${
                showNew
                  ? `<div class="newicon">
                      <div class="newicon-wrapper">
                        <div class="newicon-type">
                          <img src="${CONFIG.ImgbadgeNewType}" alt="NEW">
                        </div>
                        <div class="newicon-bg">
                         <img src="${CONFIG.ImgbadgeNewBg}" alt="">
                        </div>
                      </div>
                    </div>`
                  : ""
              }
             
                <img src="${imgSrc}" alt="${b.raw}" class="badge-image ">
            </div>
          </div>
        `).on("click", () => {
          // クリックで詳細モーダルを開く（NEWが付いていれば既読化される）
          Modal.showDetail(b, showNew); // ここでhadNewを渡して既読化まで完結
        });

        $out.append($card); // コンテナに追加
      });

      // ダミーカードで穴埋め（グリッドレイアウトを整える）
      for (let i = items.length; i < max; i++) {
        $out.append(`
          <div class="dashboard-left-block-wrap-badge-block">
            <div class="dashboard-left-block-wrap-badge-block-img dashboard-left-block-wrap-badge-block-img-dummy">
               <div class="open-info">
                <div><img src="${CONFIG.ImgbadgeDummy}" class="badge-image" alt=""></div>
                 </div>
               </div>
          </div>
        `); // 件数不足でも高さを維持
      }

      // 全件表示時の奇数調整（2列レイアウト対応）
      if (max > CONFIG.defaultMaxBadges && items.length % 2 === 1) {
        $out.append(`
          <div class="dashboard-left-block-wrap-badge-block" data-badge-index="dummy">
            <div class="dashboard-left-block-wrap-badge-block-img">
            </div>
          </div>
        `); // 余白用ダミーで段落ち防止
      }

      // UI要素の表示/非表示制御
      $(".display-badge").toggle(list.length >= 1); // バッジセクションの可視化
      $(".dashboard-left-block-wrap-badge-readmore").toggle(list.length >= 7); // 7件以上で「全て表示する」
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
      let isExpanded = false; // 現在の表示状態フラグ

      $(document).on(
        "click",
        ".dashboard-left-block-wrap-badge-readmore a",
        function (e) {
          e.preventDefault(); // aタグの遷移を抑止

          const list = Badge.collectAll(); // 最新件数を都度取得（動的変化に強い）
          const max = isExpanded ? CONFIG.defaultMaxBadges : list.length; // 状態で上限を切替
          
          UI.renderBadges(max); // 再描画

          $(this).html(isExpanded ? CONFIG.toggleHtml.more : CONFIG.toggleHtml.less); // HTML形式で更新
          isExpanded = !isExpanded; // 状態トグル
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
        .filter(Boolean); // 空要素を除去

      // バッジ関連Cookie（modalPrefix or newPrefix で始まるもの）を抽出
      const targets = cookies.filter(
        (c) =>
          c.startsWith(CONFIG.modalPrefix) || c.startsWith(CONFIG.newPrefix)
      ); // 対象のみ抽出

      if (!targets.length) {
        console.log("[DEBUG] 対象Cookieなし"); // 作業不要の通知
        return;
      }

      // 各Cookieを削除（jQuery Cookie + 生のCookie操作で確実に削除）
      targets.forEach((c) => {
        const name = c.split("=")[0]; // キー名を抽出
        Cookie.remove(name); // プラグイン側で削除
        // 念のため生の操作でも削除（Max-Age=0で即座に無効化）
        document.cookie = `${name}=; Max-Age=0; path=/;`; // ブラウザ実装差吸収
      });

      console.log(
        "[DEBUG] 削除:",
        targets.map((c) => c.split("=")[0])
      );
      alert("バッジCookieをリセットしました"); // 操作フィードバック
      location.reload(); // 状態を反映
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
      `).on("click", Debug.clearAllCookies); // クリックで一括削除

      $("body").append($btn); // DOMに追加
    },
  };

  // ===== 初期化 =====
  $(function () {
    try {
      const now = new Date(); // NEW判定などの基準時刻

      UI.renderBadges(CONFIG.defaultMaxBadges, now); // 初期描画（6件）
      UI.setupToggle(); // 「もっと見る」トグルを有効化
      Modal.showAcquired(now); // まだ見ていない獲得モーダルを順番に表示

      // デバッグボタン有効化（本番では削除）
      Debug.createButton(); // 運用時はコメントアウト推奨
    } catch (error) {
      console.error("[ERROR] バッジシステム初期化エラー:", error); // 失敗時の一括ハンドリング
    }
  });
}
