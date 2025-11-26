
// ==============================
// 各種変数
// ==============================

const UrlHome = "https://lms.waomirai.com/?redirect=0" //トップページ（科目選択）
const UrlForm = "https://go.waomirai.com/contact-change-subject"; // フォームURL 
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
const ImgBannerAmazonGiftFreeCampaignPc = "https://go.waomirai.com/l/1026513/2025-10-20/hy5wq/1026513/1760936850Q85jpiyV/banner_free_until_25dec_pc.png"; //バッジの画像
const ImgBannerAmazonGiftFreeCampaignSp = "https://go.waomirai.com/l/1026513/2025-10-20/hy5wb/1026513/1760936849yL4umnEM/banner_free_until_25dec_sp.png"; //バッジの画像

//次アップ
//2025dec pc https://go.waomirai.com/l/1026513/2025-10-20/hy5wq/1026513/1760936850Q85jpiyV/banner_free_until_25dec_pc.png
//2025dec sp https://go.waomirai.com/l/1026513/2025-10-20/hy5wb/1026513/1760936849yL4umnEM/banner_free_until_25dec_sp.png
//2026jan pc https://go.waomirai.com/l/1026513/2025-10-20/hy5wm/1026513/1760936850Nh1zDBCZ/banner_free_until_26jan_pc.png
//2026jan sp https://go.waomirai.com/l/1026513/2025-10-20/hy5wf/1026513/1760936849Fhrb3Ywf/banner_free_until_26jan_sp.png