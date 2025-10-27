// ==============================
// ダッシュボードページでの処理
// bodyId が "page-my-index" の時だけこのコードを実行
// ==============================

if (bodyId === "page-my-index") {
  // 他ページで実行されないようガード。想定外のDOM構造でエラーを出さないための安全装置。
  // ===== 定数・設定 =====

  // Cookieの有効期限とパスの設定（365日間有効、サイト全体で使える）
  // - jQuery Cookie プラグイン($.cookie)の第3引数に渡すオプション。
  // - expires: 日数指定。ここでは1年保持。
  // - path: '/' にすることで、サイト全体どのパスでも同じCookieにアクセスできる。
  const COOKIE_OPTS = { expires: 365, path: "/" };

  // 獲得モーダルを表示したかを記録するCookieの名前の先頭部分
  // 例: badge_modal_seen_2024-01-some-title
  // - 末尾に「年月+タイトル」から作るキー（makeBadgeKey）を連結してユニーク化する設計。
  const MODAL_PREFIX = "badge_modal_seen_";

  // NEWバッジを非表示にしたかを記録するCookieの名前の先頭部分
  // 例: badge_new_dismiss_2024-01-some-title
  // - 詳細モーダルを開いたタイミングで「NEW」を既読扱いにし、二度と表示しないためのフラグ保存に使う。
  const NEW_PREFIX = "badge_new_dismiss_";

  // バッジ画像が無い時に表示するダミー画像（SVG形式）
  // グレーの四角に円と横棒を描いたシンプルなアイコン
  // encodeURIComponentでURL埋め込み可能な形式に変換
  // - <img src="data:image/svg+xml,..."> として埋め込めるよう、SVG文字列をURLエンコードしておく。
  const DUMMY_SVG = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="16" fill="#EEE"/>
        <circle cx="80" cy="64" r="28" fill="#CCC"/>
        <rect x="32" y="104" width="96" height="32" rx="8" fill="#DDD"/>
      </svg>`
  );

  // =====（追記）共通ユーティリティの小さな集約 =====
  // ・分散していた共通処理（Cookieキーや画像フォールバック等）を集約して重複を削減。
  const getImgSrc = (src) =>
    src || `data:image/svg+xml;charset=UTF-8,${DUMMY_SVG}`;
  const cookieKey = (prefix, b) =>
    prefix + makeBadgeKey(b.year, b.month, b.title);

  // ===== ユーティリティ関数 =====
  // jQuery Cookieプラグインが読み込まれているかを確認。
  // - ない環境でもコードが壊れないよう、以降のCookie操作はこの関数経由でガードする。
  const hasCookie = () => typeof $.cookie === "function";

  // Cookieをセットするラッパー
  // - プラグインが無い場合はfalseを返して無視（例外を起こさない）。
  const setCookie = (key, val) =>
    hasCookie() && $.cookie(key, val, COOKIE_OPTS);

  // Cookieを「存在チェック+値が'1'か」を返すラッパー
  // - 無い/未対応なら false を返す（＝未設定扱い）。
  const getCookie = (key) => (hasCookie() ? $.cookie(key) === "1" : false);

  // バッジを一意に識別するためのキーを作る
  // - 年(YYYY)・月(2桁)・タイトル(半角小文字・スペースはハイフン・和文は許容・その他記号除去)で統一フォーマット化。
  // - Cookie名の一部として用いるため、同じラベルの衝突を避けられる。
  const makeBadgeKey = (y, m, title) =>
    `${y}-${String(m).padStart(2, "0")}-${title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-ぁ-んァ-ヶ一-龠]/g, "")}`;

  // バッジタイトル（例: "2024年 1月： 〇〇タイトル"）を構造化データに変換
  // - 期待フォーマットに合わない場合は null を返してスキップ。
  // - start: 月初日0:00、end: 翌月16日0:00（NEW表示の判定に使う期間窓）
  const parseBadgeTitle = (raw) => {
    const m = String(raw)
      .trim()
      .match(/^(\d{4})年\s*(\d{1,2})月\s*[:：]\s*(.+)$/);
    if (!m) return null;
    const [, year, month, title] = m;
    const y = parseInt(year),
      mo = parseInt(month);
    return {
      year: y,
      month: mo,
      title: title.trim(),
      dateLabel: `${y}年${mo}月`,
      start: new Date(y, mo - 1, 1),
      end: new Date(y, mo, 5), // 翌月5日の0:00
    };
  };

  // NEW表示やモーダル対象期間かどうかの判定
  // - now はテスト容易性のため引数化（省略時は現在時刻）。
  const isInNewWindow = (start, end, now = new Date()) =>
    now >= start && now < end;

  // ===== Cookie一括削除 =====
  // 即時実行関数で、関連Cookie（MODAL_PREFIX/NEW_PREFIX で始まるもの）を全削除する初期化処理。
  // - デバッグ/リセット用途。通常は開発時に役立つ。
  // (function clearAllBadgeCookies() {
  //   // document.cookie は "name=value; name2=value2; ..." 形式のため分割して走査。
  //   const cookies = document.cookie
  //     .split(";")
  //     .map((s) => s.trim())
  //     .filter(Boolean);
  //   // 対象となるプレフィックスのCookieのみ抽出。
  //   const targets = cookies.filter(
  //     (c) => c.startsWith(MODAL_PREFIX) || c.startsWith(NEW_PREFIX)
  //   );

  //   if (!targets.length) return console.log("[RESET] 対象Cookieなし");

  //   // jQuery Cookie があれば removeCookie、なければ生CookieでMax-Age=0を併用して確実に削除。
  //   targets.forEach((c) => {
  //     const name = c.split("=")[0];
  //     if (hasCookie()) $.removeCookie(name, COOKIE_OPTS);
  //     document.cookie = `${name}=; Max-Age=0; path=/;`;
  //   });
  //   console.log(
  //     "[RESET] removed:",
  //     targets.map((c) => c.split("=")[0])
  //   );
  // })();

  // ===== バッジデータ収集 =====
  // DOMからバッジ一覧<ul class="badges">の各<li>を走査し、必要情報を配列で返す。
  // - title属性 > .badge-name テキストの順でラベル取得
  // - parseBadgeTitle で構造化（不正はスキップ＆warn）
  // - img/src とリンクhref、元文字列(raw)、リストindexを保管
  function collectBadges() {
    const list = [];
    $("ul.badges li").each(function (idx) {
      const $li = $(this),
        $a = $li.find("> a").first();
      const rawTitle =
        $a.attr("title") || $li.find(".badge-name").first().text() || "";
      const parsed = parseBadgeTitle(rawTitle);

      if (!parsed) return console.warn("[WARN] 形式不正:", rawTitle);

      list.push({
        ...parsed,
        index: idx,
        raw: rawTitle,
        img: $li.find("img.badge-image").first().attr("src") || "",
        href: $a.attr("href") || "#",
      });
    });
    return list;
  }

  // ===== 01_獲得モーダル =====
  // 現在の期間窓に入っていて、かつ「まだモーダルを表示していない」最初のバッジがあればモーダル表示。
  // - 1回だけ見せたいので、表示直後にCookie(MODAL_PREFIX+key)='1'をセットして再表示しない。
  // - 複数ある場合は1つずつ順番に表示（閉じたら次を表示）
  function maybeShowAcquiredModal(now) {
    const list = collectBadges();
    console.log("[DEBUG] 全バッジ数:", list.length);

    // 期間内 && 未表示Cookie のものを全部採用（表示順は index 昇順）
    const targets = list
      .filter((b) => {
        const inWindow = isInNewWindow(b.start, b.end, now);
        const cookieName = cookieKey(MODAL_PREFIX, b);
        const hasSeenCookie = getCookie(cookieName);
        console.log(
          `[DEBUG] バッジ: ${b.title} | 期間内: ${inWindow} | Cookie(${cookieName}): ${hasSeenCookie}`
        );
        return inWindow && !hasSeenCookie;
      })
      .sort((a, b) => a.index - b.index);

    console.log(
      `[DEBUG] 獲得モーダル対象: ${targets.length}件`,
      targets.map((t) => t.title)
    );

    if (!targets.length) {
      console.log("[DEBUG] 獲得モーダル対象なし");
      return;
    }

    // 再帰的に1つずつ表示する関数
    function showNextModal(index) {
      if (index >= targets.length) {
        console.log("[DEBUG] 全てのモーダル表示完了");
        return;
      }

      const badge = targets[index];
      const imgSrc = getImgSrc(badge.img);
      const shineImageUrl =
        "http://localhost:3000/static/images/modal-shine.png";

      // shineエレメントを生成
      const shineElements = Array.from(
        { length: 8 },
        (_, idx) =>
          `<div class="badge-acquired-head-shine shine0${idx + 1}">
          <img src="${shineImageUrl}" alt="">
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

      // 表示済みフラグを先に立てて重複表示を防ぐ
      const cookieName = cookieKey(MODAL_PREFIX, badge);
      setCookie(cookieName, "1");
      console.log(`[DEBUG] Cookie設定: ${cookieName} = 1`);

      // 一意な wrapClass で生成
      const wrapClass = `badge-acquired-event badge-acquired badge-acquired-${index}`;
      const modal = createModal({ wrapClass, customModalHtml: html });

      console.log(
        `[DEBUG] 獲得モーダル表示 (${index + 1}/${targets.length}):`,
        badge.dateLabel,
        badge.title
      );

      // 紙吹雪エフェクト
      confetti({
        colors: ["#FCAF17", "#B6D43E", "#28AFE7", "#AA68AA"],
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
        zIndex: 1000,
        ticks: 50,
        drift: 3,
      });

      // 閉じるボタンがクリックされたら次のモーダルを表示
      // このモーダル内のボタンだけに絞り込む
      $(`.badge-acquired-next-btn`).one("click", function () {
        console.log(
          `[DEBUG] モーダル ${index + 1} のボタンがクリックされました`
        );
        if (modal && typeof modal.close === "function") {
          modal.close();
          console.log(`[DEBUG] モーダル ${index + 1} を閉じました`);
        }
        // 次のモーダルを表示
        setTimeout(() => {
          console.log(
            `[DEBUG] 次のモーダル ${index + 2} を表示しようとしています`
          );
          showNextModal(index + 1);
        }, 300);
      });
    }

    // 最初のモーダルから表示開始
    showNextModal(0);
  }

  // ===== 詳細モーダル =====
  // 個別バッジの詳細を表示するモーダル。
  // - hadNew が true の場合、「NEW」既読扱いCookieを立て、カード上のNEWピルをDOMから除去。
  function openBadgeDetailModal(badge, hadNew = false) {
    if (hadNew) {
      // NEWのDismissフラグをCookieに保存し、以降はNEWを出さない
      setCookie(cookieKey(NEW_PREFIX, badge), "1");
      // 一覧側の該当カードから .badge-new 要素を取り除く（視覚的にも消す）
      $(
        `.dashboard-left-block-wrap-badge-block[data-badge-index="${badge.index}"] .newicon`
      ).remove();
    }

    // 画像ソース確定（なければダミー）
    const imgSrc = getImgSrc(badge.img);
    // モーダルHTML
    const html = `
        <div class="badge-acquired-image">
          <img src="${imgSrc}" alt="${badge.raw}">
        </div>
        <h2 class="c-modal-wrap-title">
          ${badge.dateLabel}<br />${badge.title}
        </h2>
        <a class="c-modal-wrap-button c-modal-wrap-close-tag badge-acquired-next-btn">閉じる</a>
      `;

    // 詳細モーダルを表示
    const modal = createModal({
      close: true,
      wrapClass: "badge-acquired ",
      customModalHtml: html,
    });
    // 閉じるボタンのイベント（多重登録防止のため名前空間付きで再バインド）
    $(document)
      .off("click.badgeDetailClose")
      .on("click.badgeDetailClose", ".badge-detail-modal .cm-close-btn", () =>
        modal?.close()
      );
  }

  // ===== 02_バッジ一覧ブロック =====
  // 画面左側に表示するバッジカード群を組み立てる。
  // - max 件（デフォ6）を表示し、足りない分は「ダミー」で穴埋め。
  // - NEW表示ロジック：期間窓内 && NEW_PREFIX Cookie未設定 → NEWピルを出す。
  // - カードクリックで詳細モーダルを開く（開いたらNEWを既読化）。
  function renderBadgeBlock(max = 6, now) {
    // （追記）nowを引数で受け取る
    // 既存コンテナが無ければ生成する（柔軟に既存の<ul.badges>の直後に置く。なければbody末尾）
    let $out = $(".dashboard-left-block-wrap-badge-content");
    if (!$out.length) {
      $out = $('<div class="dashboard-left-block-wrap-badge-content"></div>');
      $("ul.badges").length
        ? $("ul.badges").after($out)
        : $("body").append($out);
    }

    const list = collectBadges(); // DOMからの最新バッジ情報
    const items = list.slice(0, max); // 表示件数に制限
    $out.empty(); // 再描画のためクリア

    items.forEach((b, i) => {
      // このバッジが「NEW期間内」かどうか
      const inWindow = isInNewWindow(b.start, b.end, now);
      // 既にNEWを消している（詳細を見た等）かどうかのCookie
      const dismissed = getCookie(cookieKey(NEW_PREFIX, b));
      // 表示判定：期間内 && 未Dismiss
      const showNew = inWindow && !dismissed;
      // 画像が無ければダミー
      const imgSrc = getImgSrc(b.img);

      // 1枚のカードDOM（インラインスタイルは簡便のため）
      // - data-badge-index は後で該当カードを特定してNEWバッジを除去するための参照に使う
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
        `).on("click", () => openBadgeDetailModal(b, showNew)); // クリックで詳細モーダル。showNewなら既読化も行う。

      $out.append($card);
    });

    // 表示数がmaxに満たない場合、UIが詰まらないようダミーカードで穴埋め。
    for (let i = items.length; i < max; i++) {
      $out.append(`
          <div class="dashboard-left-block-wrap-badge-block">
            <div class="dashboard-left-block-wrap-badge-block-img">
            <div><img src="http://localhost:3000/static/images/badge_dummy.svg" class="badge-image"></div>
            </div>
          </div>
        `);
    }
  }

  // ===== 起動 =====
  // DOM準備完了後に初期描画＆必要なら獲得モーダルを表示。
  // - renderBadgeBlock: 左ブロックのカード群を作る
  // - maybeShowAcquiredModal: 今回が初見の獲得モーダル対象があれば表示
  $(function () {
    // （追記）nowを1度だけ確定して両処理へ渡すことで、重複とタイミングずれを防ぐ
    const now = new Date();
    renderBadgeBlock(6, now);
    maybeShowAcquiredModal(now);
  });
}
