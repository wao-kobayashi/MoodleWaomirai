// トップの一覧ページ（src/pug/index.pug）に出す lms-moodle のページの並び順
// - 同じカテゴリの中で、ここに書いた順に表示する（カテゴリと小見出しはページ側の設定で決まる）
// - ここに無いページは、カテゴリの末尾にファイル名順で表示する
// - ページのパスは src/pug/lms-moodle からの相対パス（拡張子なし）
module.exports = [
    // moodleログイン
    'signup/page-moodle-login',
    'signup/page-moodle-forgot-password',
    'signup/page-moodle-signup-input',
    'signup/page-moodle-signup-temporary',
    'signup/page-moodle-signup-complate',

    // ホーム
    'index/page-index-guest',
    'index/page-index-logged-in-purchased',

    // ダッシュボード
    'dashboard/page-nojs',
    'dashboard/page-single-none',
    'dashboard/page-single-event',
    'dashboard/page-single-ph',
    'dashboard/page-single-sc',
    'dashboard/page-single-ec',
    'dashboard/page-single-en',
    'dashboard/page-single-pr',
    'dashboard/page-single-two',
    'dashboard/page-single-three',
    'dashboard/page-multi-sc-sc2',
    'dashboard/page-multi-sc-sc2-en',
    'dashboard/page-multi-sc-sc2-ec',
    'dashboard/page-multi-two-sc2-ec2',
    'dashboard/page-multi-three-sc3-ec3-ph3',
    'dashboard/page-calender-01none',
    'dashboard/page-calender-02todayonly',
    'dashboard/page-calender-03aftertomorrow',
    'dashboard/page-calender-04today_after',
    'dashboard/page-calender-05modal',

    // 科目購入
    'course-enrol/page-enrol-ph-none',
    'course-enrol/page-enrol-ph-sc',
    'course-enrol/page-enrol-ph-two',
    'course-enrol/page-enrol-ph-three',
    'course-enrol/page-enrol-ph-trialend',
    'course-enrol/page-enrol-sc-none',
    'course-enrol/page-enrol-ec-none',
    'course-enrol/page-enrol-en',
    'course-enrol/page-enrol-en-trialend',
    'course-enrol/page-enrol-two-none',
    'course-enrol/page-enrol-two-sc',
    'course-enrol/page-enrol-two-ec',
    'course-enrol/page-enrol-two-three',
    'course-enrol/page-enrol-three-none',
    'course-enrol/page-enrol-three-sc',
    'course-enrol/page-enrol-three-ec',
    'course-enrol/page-enrol-three-two',
    'course-enrol/page-enrol-three-trialend',

    // 購入した後の科目ページ（course-view-topics）
    'page-course-view-topics/ph-main-free',
    'page-course-view-topics/ph-main-level1-purchased',
    'page-course-view-topics/ph-level1',
    'page-course-view-topics/sc-main-free',
    'page-course-view-topics/sc-main-level1-purchased',
    'page-course-view-topics/sc-level1',
    'page-course-view-topics/ec-main-free',
    'page-course-view-topics/ec-main-level1-purchased',
    'page-course-view-topics/ec-level1',
    'page-course-view-topics/en-main-free',
    'page-course-view-topics/en-main-level1-purchased',

    // 授業受講
    'path-mod-questionnaire/page-path-mod-questionnaire-detail-ph-level1',
    'path-mod-questionnaire/page-path-mod-questionnaire-detail-sc-level3',
    'path-mod-questionnaire/page-path-mod-questionnaire-nocontent',
    'path-mod-questionnaire/page-path-mod-questionnaire-archive',
    'path-mod-questionnaire/page-path-mod-questionnaire-question-english',
    'path-mod-questionnaire/page-path-mod-questionnaire-question-science',
    'path-mod-questionnaire/page-path-mod-questionnaire-finish-english',
    'path-mod-questionnaire/page-path-mod-questionnaire-finish-science',
    'path-mod-questionnaire/parts-lesson',

    // 講座の受講ヘルプページ
    'page-mod-page-view/page-help-01-how-to-attend-class-with-zoom',
    'page-mod-page-view/page-help-01-how-to-attend-class',
    'page-mod-page-view/page-help-02-course-calendar-empty',
    'page-mod-page-view/page-help-03-change-levels',
    'page-mod-page-view/page-help-04-watch-archive-class',
    'page-mod-page-view/page-help-05-which-class-to-attend',

    // 授業レベル設定ロジック
    'page-user-edit/none',
    'page-user-edit/ph-none',
    'page-user-edit/sc-none',
    'page-user-edit/ec-none',
    'page-user-edit/en-none',
    'page-user-edit/two-none',
    'page-user-edit/three-none',
    'page-user-edit/ph-register',
    'page-user-edit/sc-register',
    'page-user-edit/ec-register',
    'page-user-edit/two-register',
    'page-user-edit/three-register',
    'page-user-edit/en-register',
    'page-user-edit/ph-register-eng-none',
    'page-user-edit/ph-register-eng-register',

    // 設定関連
    'mypage/page-mypage',
    'setting/page-user-setting'
];
