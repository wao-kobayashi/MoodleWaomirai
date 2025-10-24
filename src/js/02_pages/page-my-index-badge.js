
// ==============================
// ダッシュボードページでの処理
// ==============================
if (bodyId === "page-my-index") {

//cookie削除
// すべてのバッジ系Cookie（獲得モーダル＆NEW非表示）をまとめて消す
(function clearAllBadgeCookies(options){
    options = options || {};
    var path = options.path || '/';
    var domain = options.domain; // 例: '.example.com' （不要なら未指定でOK）
  
    var cookies = document.cookie.split(';').map(function(s){return s.trim();}).filter(Boolean);
  
    // 対象: badge_modal_seen_* と badge_new_dismiss_*
    var targets = cookies.filter(function(c){
      return c.indexOf('badge_modal_seen_') === 0 || c.indexOf('badge_new_dismiss_') === 0;
    });
  
    if (targets.length === 0) {
      console.log('[RESET ALL] 対象Cookieなし');
      return;
    }
  
    targets.forEach(function(c){
      var name = c.split('=')[0];
  
      // jquery.cookie があれば removeCookie（path/domain を合わせる）
      if (typeof $.cookie === 'function') {
        $.removeCookie(name, { path: path, ...(domain ? { domain: domain } : {}) });
      }
  
      // 念のためネイティブでも削除（path/domain一致が重要）
      var del = name + '=; Max-Age=0; path=' + path + ';';
      if (domain) del += ' domain=' + domain + ';';
      document.cookie = del;
    });
  
    console.log('[RESET ALL] removed:',
      targets.map(function(c){ return c.split('=')[0]; }),
      'path=', path,
      domain ? ('domain=' + domain) : ''
    );
  })({ path: '/' /*, domain: '.example.com' */ });
  
  /** "YYYY年M月：タイトル" を解析（全角/半角コロン対応） */
  function parseBadgeTitle(raw) {
    const m = String(raw).trim().match(/^(\d{4})年\s*(\d{1,2})月\s*[:：]\s*(.+)$/);
    if (!m) return null;
    const year  = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    const title = m[3].trim();
    const start = new Date(year, month - 1, 1, 0, 0, 0); // 獲得月1日
    const end   = new Date(year, month, 16, 0, 0, 0);    // 翌月16日(未満)
    return { year, month, title, start, end, dateLabel: `${year}年${month}月` };
  }
  
  /** 画像の取得（なければ空文字） */
  function resolveImageSrc($li) {
    const $img = $li.find('img.badge-image').first();
    return ($img.length && $img.attr('src')) ? $img.attr('src') : '';
  }
  
  /** .badges の <li> を “出現順” のまま配列化 */
  function collectBadges() {  
    const list = [];
    const $lis = $('ul.badges li');
    console.log('[DEBUG] .badges li count =', $lis.length);
  
    $lis.each(function (idx) {
      const $li = $(this);
      const $a  = $li.find('> a').first();
  
      const rawTitle = $a.attr('title') || $li.find('.badge-name').first().text() || '';
      const parsed   = parseBadgeTitle(rawTitle);
      if (!parsed) {
        console.warn('[WARN] タイトル形式不正のためスキップ:', rawTitle);
        return;
      }
  
      list.push({
        index: idx,
        raw: rawTitle,
        title: parsed.title,
        dateLabel: parsed.dateLabel,
        year: parsed.year,
        month: parsed.month,
        start: parsed.start,
        end: parsed.end,
        img: resolveImageSrc($li),
        href: $a.attr('href') || '#',
      });
    });
  
    const dates  = list.map(b => b.dateLabel);
    const titles = list.map(b => b.title);
    return { list, dates, titles };
  }
  
  /** NEW期間（獲得月1日〜翌月15日まで）判定 */
  function isInNewWindow(start, end, now = new Date()) {
    return now >= start && now < end;
  }
  
  /** 02_バッジ一覧ブロック（最大6件＋ダミー補完） */
  function renderBadgeBlock({ max = 6 } = {}) {
    let $out = $('.dashboard-left-block-wrap-badge');
    if ($out.length === 0) {
      console.log('[DEBUG] 出力先 .dashboard-left-block-wrap-badge が無いので生成します');
      $out = $('<div class="dashboard-left-block-wrap-badge"></div>');
      if ($('ul.badges').length) {
        $('ul.badges').after($out);
      } else {
        $('body').append($out);
      }
    }
  
    const { list } = collectBadges();
    console.log('[DEBUG] badgeList (li順):', list);
  
    const now = new Date();
    const items = list.slice(0, max);
  
    $out.empty();
  
    const dummySVG = () => {
      const svg = encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
          <rect width="160" height="160" rx="16" fill="#EEE"/>
          <circle cx="80" cy="64" r="28" fill="#CCC"/>
          <rect x="32" y="104" width="96" height="32" rx="8" fill="#DDD"/>
        </svg>`
      );
      return `data:image/svg+xml;charset=UTF-8,${svg}`;
    };
  
    items.forEach(function (b, i) {
      const showNew = isInNewWindow(b.start, b.end, now);
      const imgSrc = b.img || dummySVG();
      const $card = $(`
        <div class="dashboard-left-block-wrap-badge-block" data-badge-index="${b.index}"
             style="border:1px solid #ccc; padding:8px; margin:6px 0;">
          <div><strong>[${i+1}] ${b.dateLabel}</strong>${showNew ? '  ← NEW' : ''}</div>
          <div>タイトル：${b.title}</div>
          <div>画像URL：${b.img ? b.img : '(なし→ダミー表示)'}</div>
          <div style="margin-top:6px;">
            <img src="${imgSrc}" alt="${b.raw}" style="width:80px;height:80px;object-fit:cover;border:1px solid #ddd;">
          </div>
        </div>
      `);
      $out.append($card);
    });
  
    const needDummies = Math.max(0, max - items.length);
    console.log('[DEBUG] dummy count =', needDummies);
    for (let i = 0; i < needDummies; i++) {
      $out.append(`
        <div class="dashboard-left-block-wrap-badge-block dummy"
             style="border:1px dashed #bbb; padding:8px; margin:6px 0; color:#666;">
          <div><strong>[${items.length + i + 1}] ダミー</strong></div>
          <div>バッジがありません</div>
        </div>
      `);
    }
  
    console.log('[DEBUG] render done.');
  }
  
  /* ====== 01_バッジ獲得モーダル（Cookie制御） ====== */
  const BADGE_MODAL_COOKIE_PREFIX = 'badge_modal_seen_';
  const COOKIE_OPTS = { expires: 365, path: '/' };
  function makeBadgeKey(year, month, title) {
    const slug = String(title).toLowerCase().replace(/\s+/g,'-').replace(/[^\w\-ぁ-んァ-ヶ一-龠]/g,'');
    return `${year}-${String(month).padStart(2,'0')}-${slug}`;
  }
  function maybeShowAcquiredModal() {
    const hasCookie = typeof $.cookie === 'function';
    if (!hasCookie) {
      console.warn('[WARN] jquery.cookie.min.js 未読込。モーダルの再表示抑止は無効になります。');
    }
  
    const { list } = collectBadges();
    const now = new Date();
  
    // li順で、NEW期間中 かつ 未見の最初の1件
    const target = list.find(b => {
      const inWindow = isInNewWindow(b.start, b.end, now);
      const key = BADGE_MODAL_COOKIE_PREFIX + makeBadgeKey(b.year, b.month, b.title);
      const seen = hasCookie ? $.cookie(key) === '1' : false;
      return inWindow && !seen;
    });
  
    if (!target) {
      console.log('[DEBUG] 獲得モーダル対象なし');
      return;
    }
  
    const imgSrc = target.img || (function(){ // 一覧と同じダミー
      const svg = encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
          <rect width="160" height="160" rx="16" fill="#EEE"/>
          <circle cx="80" cy="64" r="28" fill="#CCC"/>
          <rect x="32" y="104" width="96" height="32" rx="8" fill="#DDD"/>
        </svg>`
      );
      return `data:image/svg+xml;charset=UTF-8,${svg}`;
    })();
  
    const html = `
      <div class="badge-acquired-modal">
        <h2 style="margin:0 0 12px;font-size:18px;">おめでとうございます！新しいバッジを獲得しました</h2>
        <div style="display:flex;gap:16px;align-items:center;">
          <img src="${imgSrc}" alt="${target.raw}" style="width:120px;height:120px;object-fit:cover;border-radius:12px;border:1px solid #eee;">
          <div>
            <div style="font-weight:bold;margin-bottom:6px;">${target.dateLabel}</div>
            <div style="line-height:1.6;">${target.title}</div>
          </div>
        </div>
        <div style="margin-top:16px;text-align:right;">
          <button class="c-modal-wrap-close-tag cm-close-btn" style="padding:8px 14px;border-radius:8px;border:1px solid #ccc;background:#f8f8f8;cursor:pointer;">閉じる</button>
        </div>
      </div>
    `;
    const modal = createModal({ wrapClass: "badge-acquired", customModalHtml: html });
  
    // 表示した瞬間に既読Cookieを付与
    const cookieKey = BADGE_MODAL_COOKIE_PREFIX + makeBadgeKey(target.year, target.month, target.title);
    if (hasCookie) $.cookie(cookieKey, '1', COOKIE_OPTS);
  
    $(document).off('click.badgeAcqClose').on('click.badgeAcqClose', '.badge-acquired-modal .cm-close-btn', function () {
      if (modal && typeof modal.close === 'function') modal.close();
    });
  
    console.log('[DEBUG] 獲得モーダル表示:', { title: target.title, date: target.dateLabel, cookieKey });
  }
  
  /* ====== 起動 ====== */
  $(function () {
    const { list, dates, titles } = collectBadges();
    console.log('list (li順):', list);
    console.log('dates:', dates);
    console.log('titles:', titles);
  
    renderBadgeBlock({ max: 6 });  // 02_一覧
    maybeShowAcquiredModal();      // 01_獲得モーダル
  });
  
  // ===== NEWの非表示用Cookie =====
  const BADGE_NEW_DISMISS_COOKIE_PREFIX = 'badge_new_dismiss_';
  
  // ===== 詳細モーダルを開く（クリック時） =====
  function openBadgeDetailModal(badge, { hadNew = false } = {}) {
    // NEWが付いていたらCookieで以後出さない
    if (hadNew && typeof $.cookie === 'function') {
      const newKey = BADGE_NEW_DISMISS_COOKIE_PREFIX + makeBadgeKey(badge.year, badge.month, badge.title);
      $.cookie(newKey, '1', COOKIE_OPTS);
      // 一覧上のNEWバッジアイコンを即時消す
      $(`.dashboard-left-block-wrap-badge-block[data-badge-index="${badge.index}"] .badge-new`).remove();
    }
  
    const imgSrc = badge.img || (function(){ // ダミー
      const svg = encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
          <rect width="160" height="160" rx="16" fill="#EEE"/>
          <circle cx="80" cy="64" r="28" fill="#CCC"/>
          <rect x="32" y="104" width="96" height="32" rx="8" fill="#DDD"/>
        </svg>`
      );
      return `data:image/svg+xml;charset=UTF-8,${svg}`;
    })();
  
    const html = `
      <div class="badge-detail-modal">
        <div style="display:flex;gap:16px;align-items:flex-start;">
          <img src="${imgSrc}" alt="${badge.raw}" style="width:160px;height:160px;object-fit:cover;border-radius:12px;border:1px solid #eee;">
          <div>
            <div style="font-weight:bold;margin:0 0 6px;">${badge.dateLabel}</div>
            <div style="font-size:16px;line-height:1.6;">${badge.title}</div>
          </div>
        </div>
        <div style="margin-top:16px;text-align:right;">
          <button class="c-modal-wrap-close-tag cm-close-btn" style="padding:8px 14px;border-radius:8px;border:1px solid #ccc;background:#f8f8f8;cursor:pointer;">閉じる</button>
        </div>
      </div>
    `;
    const modal = createModal({ wrapClass: "badge-detail", customModalHtml: html });
  
    $(document).off('click.badgeDetailClose').on('click.badgeDetailClose', '.badge-detail-modal .cm-close-btn', function () {
      if (modal && typeof modal.close === 'function') modal.close();
    });
  }
  
  // ===== 02_バッジ一覧ブロック（クリック対応＆NEW Cookie制御込） =====
  // 既存の renderBadgeBlock をこの実装に置き換えてください
  function renderBadgeBlock({ max = 6 } = {}) {
    let $out = $('.dashboard-left-block-wrap-badge');
    if ($out.length === 0) {
      console.log('[DEBUG] 出力先 .dashboard-left-block-wrap-badge が無いので生成します');
      $out = $('<div class="dashboard-left-block-wrap-badge"></div>');
      if ($('ul.badges').length) {
        $('ul.badges').after($out);
      } else {
        $('body').append($out);
      }
    }
  
    const { list } = collectBadges();
    const now = new Date();
    const items = list.slice(0, max);
    $out.empty();
  
    const dummySVG = () => {
      const svg = encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
          <rect width="160" height="160" rx="16" fill="#EEE"/>
          <circle cx="80" cy="64" r="28" fill="#CCC"/>
          <rect x="32" y="104" width="96" height="32" rx="8" fill="#DDD"/>
        </svg>`
      );
      return `data:image/svg+xml;charset=UTF-8,${svg}`;
    };
  
    items.forEach(function (b, i) {
      // NEW表示: 期間内 かつ NEW非表示Cookieが未セット
      const inWindow = isInNewWindow(b.start, b.end, now);
      const newDismissed = (typeof $.cookie === 'function')
        ? $.cookie(BADGE_NEW_DISMISS_COOKIE_PREFIX + makeBadgeKey(b.year, b.month, b.title)) === '1'
        : false;
      const showNew = inWindow && !newDismissed;
  
      const imgSrc = b.img || dummySVG();
      const $card = $(`
        <div class="dashboard-left-block-wrap-badge-block" data-badge-index="${b.index}"
             style="position:relative;border:1px solid #ccc; padding:8px; margin:6px 0; cursor:pointer;">
          ${showNew ? '<span class="badge-new" style="position:absolute;top:8px;left:8px;background:#e60033;color:#fff;font-size:12px;font-weight:bold;padding:3px 6px;border-radius:6px;">NEW</span>' : ''}
          <div><strong>[${i+1}] ${b.dateLabel}</strong>${showNew ? '  ← NEW' : ''}</div>
          <div>タイトル：${b.title}</div>
          <div style="margin-top:6px;">
            <img src="${imgSrc}" alt="${b.raw}" style="width:80px;height:80px;object-fit:cover;border:1px solid #ddd;">
          </div>
        </div>
      `);
  
      // クリックで詳細モーダル
      $card.on('click', function () {
        openBadgeDetailModal(b, { hadNew: showNew });
      });
  
      $out.append($card);
    });
  
    const needDummies = Math.max(0, max - items.length);
    for (let i = 0; i < needDummies; i++) {
      $out.append(`
        <div class="dashboard-left-block-wrap-badge-block dummy"
             style="border:1px dashed #bbb; padding:8px; margin:6px 0; color:#666;">
          <div><strong>[${items.length + i + 1}] ダミー</strong></div>
          <div>バッジがありません</div>
        </div>
      `);
    }
  }
}