
// ==============================
// 各種変数
// ==============================

const UrlHome = "https://lms.waomirai.com/?redirect=0" //トップページ（科目選択）
const UrlSubjectChangeForm = "https://wao.ne.jp/forms/waomirai-changesubject/form.php"; // フォームURL 
const UrlChangeSubject = "https://lms.waomirai.com/user/edit.php"; // 受講変更ページ
const DayChangeCourseBannerStart = 13; // 受講レベル変更・科目変更・解約の締切日通知モーダルの表示開始日（月の前半）
const DayChangeCourseDeadLine = 20; // 受講レベル変更・科目変更・解約の締切日（DayChangeCourseBannerStartより後の日の設定が必要）

const DayDisabledFee = 1; // 受講登録手続きを行えない日

const NowDate = new Date(); // 現在の日時
const DayOfMonth = parseInt(NowDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', day: '2-digit' }).replace('日', '')); // 現在の日
const AmazonGiftFreeCampaignEnd = new Date('2025-11-29T23:59:59+09:00'); // 日本時間

// ==============================
// Liff系
// ==============================

//moodleで友だち追加
const UrlLiffMoodle = "https://liff.line.me/2006716288-lL7QzGA3?loycus_urlc=y7vy" 
const ImgLiffMoodle = "https://waomirai.com/lp/assets/moodle/images/qr_line_bymoodle.png" 

// ==============================
// googleCalender系
// ==============================

const iframeCalenderPhilosophy = "https://calendar.google.com/calendar/embed?src=c_57f70f2fb986aabbb85c2a71ed169e2624e902265abb6dffc1d993f2d781dd4b%40group.calendar.google.com&ctz=Asia%2FTokyo" //哲学
const iframeCalenderScience = "https://calendar.google.com/calendar/embed?src=c_9d34850398ee79fea558cb874c3bebe48860ce3d5fcff5c80f91b203974af452%40group.calendar.google.com&ctz=Asia%2FTokyo" //科学
const iframeCalenderEconomy = "https://calendar.google.com/calendar/embed?src=c_9ee064fdb148232860ebd82900e5222d5060f6702f608257b9d9625d6bcd3a1c%40group.calendar.google.com&ctz=Asia%2FTokyo" //経済
const iframeCalenderEnglish = "https://calendar.google.com/calendar/embed?src=c_379c34d3c8e6716b3458dd339f4531bd8ce07f17c4f97d5fec4367888a692290%40group.calendar.google.com&ctz=Asia%2FTokyo" //グローバル英語

// ==============================
// 授業のメモシート
// ==============================

const memosheetPhilosophy = "https://waomirai.com/lp/assets/moodle/memosheet_philosphy.pdf" //哲学
const memosheetScience = "https://waomirai.com/lp/assets/moodle/memosheet_science.pdf" //科学
const memosheetEconomy = "https://waomirai.com/lp/assets/moodle/memosheet_economy.pdf" //経済


// ==============================
// 画像
// ==============================

const ImgSubjectPhilosophy = "https://waomirai.com/lp/assets/moodle/images/icn_subject_philosophy.svg"; //アイコン：哲学
const ImgSubjectScience = "https://waomirai.com/lp/assets/moodle/images/icn_subject_science.svg"; //アイコン：科学
const ImgSubjectEconomy = "https://waomirai.com/lp/assets/moodle/images/icn_subject_economy.svg"; //アイコン：経済
const ImgSubjectEnglish = "https://waomirai.com/lp/assets/moodle/images/icn_subject_english.svg"; //アイコン：英語
const ImgSubjectOther = "https://waomirai.com/lp/assets/moodle/images/icn_subject_other.svg"; //アイコン：その他
 
const ImgModalBadge = "https://waomirai.com/lp/assets/moodle/images/page_badge_sample.png"; //バッジの画像
const ImgBannerAmazonGiftFreeCampaignPc = "https://go.waomirai.com/l/1026513/2025-10-20/hy5wm/1026513/1760936850Nh1zDBCZ/banner_free_until_26jan_pc.png"; //バッジの画像
const ImgBannerAmazonGiftFreeCampaignSp = "https://go.waomirai.com/l/1026513/2025-10-20/hy5wf/1026513/1760936849Fhrb3Ywf/banner_free_until_26jan_sp.png"; //バッジの画像

//次アップ
//2025dec pc https://go.waomirai.com/l/1026513/2025-10-20/hy5wq/1026513/1760936850Q85jpiyV/banner_free_until_25dec_pc.png
//2025dec sp https://go.waomirai.com/l/1026513/2025-10-20/hy5wb/1026513/1760936849yL4umnEM/banner_free_until_25dec_sp.png
//2026jan pc https://go.waomirai.com/l/1026513/2025-10-20/hy5wm/1026513/1760936850Nh1zDBCZ/banner_free_until_26jan_pc.png
//2026jan sp https://go.waomirai.com/l/1026513/2025-10-20/hy5wf/1026513/1760936849Fhrb3Ywf/banner_free_until_26jan_sp.png


// ============================
// 購入制限の統合管理
// ============================
/**
 * 購入制限期間の設定
 * 
 * このオブジェクト配列で全ての購入制限を一元管理します。
 * 配列の上から順にチェックされ、最初にマッチした制限が適用されます。
 * 
 * 【優先順位】
 * 1. 特定期間の制限（type: 'period'）← 先に配置
 * 2. 毎月定期メンテナンス（type: 'monthly'）← 後に配置
 * 
 * 【新しい制限期間の追加方法】
 * periods配列に新しいオブジェクトを追加するだけです：
 * { 
 *   start: '開始日時(ISO8601形式)', 
 *   end: '終了日時(ISO8601形式)', 
 *   message: 'ページ下部に表示するHTML',
 *   modalTitle: 'モーダルに表示するタイトル(HTMLタグ可)'
 * }
 */
const PurchaseRestrictions = [
// ----------------------------------------
// 特定期間の制限(優先的にチェック)
// ----------------------------------------
{
    type: 'period', // 制限タイプ：特定期間
    periods: [
    // 制限期間1: 12/1 0:00 ～ 12/5 0:00
    { 
        start: '2025-12-29T00:00:00', // 制限開始日時（この時刻から制限開始）
        end: '2025-12-31T23:59:00',   // 制限終了日時（この時刻になったら制限解除）
        // ページ下部に固定表示されるメッセージ（HTML可）
        message: '<div class="disabled-fee-fixed"><span class="icon-disabled-fee-fixed">&#x26a0;&#xfe0f;</span>システムメンテナンス中です(12/29-1/1)<br class="br-disabled-fee-fixed">お手数ですが、メンテナンス終了後に手続きをお願いします。</div>',
        // 購入ボタンクリック時にモーダルで表示されるタイトル（HTML可）
        modalTitle: 'システムメンテナンス中です(12/29-1/1)<br />お手数ですが、メンテナンス終了後に<br />手続きをお願いします。'
    }
    // ★ 新しい期間を追加する場合は、ここにカンマ区切りで追加
    ]
},
// ----------------------------------------
// 毎月定期メンテナンス(低優先)
// ----------------------------------------
{
    type: 'monthly', // 制限タイプ：毎月X日
    day: DayDisabledFee, // 制限する日（例：28なら毎月28日）
    // 毎月X日に表示されるメッセージ
    message: `<div class="disabled-fee-fixed"><span class="icon-disabled-fee-fixed">&#x26a0;&#xfe0f;</span>毎月${DayDisabledFee}日はシステムメンテナンスのため、受講登録手続きができません。<br class="br-disabled-fee-fixed">お手数ですが、翌日以降に手続きをお願いします。</div>`,
    // 毎月X日のモーダルタイトル
    modalTitle: `毎月${DayDisabledFee}日はシステムメンテナンスのため<br />受講登録手続きができません。<br />お手数ですが、翌日以降に<br />手続きをお願いします。`
}
];