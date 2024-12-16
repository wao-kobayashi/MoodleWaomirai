// 変数定義
const SubjectIds = {
    // グループAのサブグループ
    SubjectMain: {
        philosophy: { id: 212, name: '哲学' }, // 哲学
        science: { id: 211, name: '科学' },   // 科学
        economy: { id: 213, name: '経済' },   // 経済
        ThreeSubjectPack: { id: 229, name: '3科目セット' }, // 3科目セット
        TwoSubjectPack: { id: 228, name: '2科目セット' }, // 2科目セット
    },
    // メイン3科目のL1~L4グループ
    SubjectChild: {
        philosophy: {
            L1: { id: 221, name: '哲学 L1' },
            L2: { id: 225, name: '哲学 L2' },
            L3: { id: 242, name: '哲学 L3' },
            L4: { id: 243, name: '哲学 L4' }
        },
        science: {
            L1: { id: 223, name: '科学 L1' },
            L2: { id: 222, name: '科学 L2' },
            L3: { id: 244, name: '科学 L3' },
            L4: { id: 245, name: '科学 L4' }
        },
        economy: {
            L1: { id: 226, name: '経済 L1' },
            L2: { id: 227, name: '経済 L2' },
            L3: { id: 246, name: '経済 L3' },
            L4: { id: 247, name: '経済 L4' }
        }
    },
    // プログラミンググループ
    GlobalEnglish: { id: 236, name: 'グローバル英語' },
    Programming: { id: 235, name: 'プログラミング' }
};

$(document).ready(function() {
    // <html>タグの属性を取得し、tenantIdNumberを取得
    const tenantIdNumber = $("html").data("tenantidnumber");

    // tenantIdが"stg"の場合の処理
    if (tenantIdNumber === "stg") {
        // body要素のIDを取得
        const bodyId = $("body").attr("id");
        // bodyのクラス名から科目IDを取り出し、配列に変換
        const bodyClasses = $("body")
            .attr("class") // bodyのclass属性を取得
            .split(" ")    // スペースで区切り、配列に変換
            .map(cls => parseInt(cls.replace("course-id-", "").trim())); // "course-id-"を取り除いて整数に変換

        // 汎用的なグループチェック関数
        function checkGroup(subjectIds) {
            return Object.values(subjectIds).some(function(id) {
                return bodyClasses.includes(id.id);
            });
        }

        // 各グループの判定
        const isSubjectMain = checkGroup(SubjectIds.SubjectMain); // SubjectMainをチェック
        const isSubjectChild = ['philosophy', 'science', 'economy'].some(subject => 
            checkGroup(SubjectIds.SubjectChild[subject]) // SubjectChildをチェック
        );
        const isGlobalEnglish = bodyClasses.includes(SubjectIds.GlobalEnglish.id); // GlobalEnglishをチェック
        const isProgramming = bodyClasses.includes(SubjectIds.Programming.id); // Programmingをチェック

        // ==============================
        // ダッシュボードページでの処理
        // ==============================
        if (bodyId === "page-my-index") {
            // メイン科目（SubjectMain）の処理
            if (!isSubjectChild && isSubjectMain) {
                console.log("メイン科目（SubjectMain）に該当しています");
                const subjectMainNames = [];
                Object.values(SubjectIds.SubjectMain).forEach(function(subSubject) {
                    if (bodyClasses.includes(subSubject.id)) {
                        let icon = "&#x1f9ea;"; // デフォルトは🧪（科学的なアイコン）
                        if (subSubject.name === '哲学') icon = "&#x1f4D6;"; // 📖
                        else if (subSubject.name === '科学') icon = "&#x1f52C;"; // 🔬
                        else if (subSubject.name === '経済') icon = "&#x1f4B0;"; // 💰
                        const courseLink = `https://lms.waomirai.com/course/view.php?id=${subSubject.id}`;
                        subjectMainNames.push(`
                            <div class="dashboard-left-block-subject-child">
                                <div class="dashboard-left-block-subject-child-icon">${icon}</div>
                                <div class="dashboard-left-block-subject-child-text">
                                    <a href="${courseLink}" target="_blank">${subSubject.name}</a>
                                </div>
                            </div>
                        `);
                    }
                });

                if (subjectMainNames.length > 0) {
                    const subjectMainListHtml = subjectMainNames.join("");
                    $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(`${subjectMainListHtml}</div>`);
                }
            }

            // 詳細科目（SubjectChild）の処理
            if (isSubjectChild) {
                console.log("詳細科目（SubjectChild）に該当しています");
                const subjectChildNames = [];
                ['philosophy', 'science', 'economy'].forEach(function(subjectKey) {
                    Object.values(SubjectIds.SubjectChild[subjectKey]).forEach(function(subSubject) {
                        if (bodyClasses.includes(subSubject.id)) {
                            let icon = "&#x1f9ea;"; // デフォルトは🧪（科学的なアイコン）
                            if (subjectKey === 'philosophy') icon = "&#x1f4D6;"; // 📖
                            else if (subjectKey === 'science') icon = "&#x1f52C;"; // 🔬
                            else if (subjectKey === 'economy') icon = "&#x1f4B0;"; // 💰
                            const courseLink = `https://lms.waomirai.com/course/view.php?id=${subSubject.id}`;
                            subjectChildNames.push(`
                                <div class="dashboard-left-block-subject-child">
                                    <div class="dashboard-left-block-subject-child-icon">${icon}</div>
                                    <div class="dashboard-left-block-subject-child-text">
                                        <a href="${courseLink}" target="_blank">${subSubject.name}</a>
                                    </div>
                                </div>
                            `);
                        }
                    });
                });

                if (subjectChildNames.length > 0) {
                    const subjectChildListHtml = subjectChildNames.join("");
                    $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(`${subjectChildListHtml}</div>`);
                }
            }

            // グローバル英語（GlobalEnglish）の処理
            if (isGlobalEnglish) {
                console.log("グローバル英語に該当しています");
                const courseLink = `https://lms.waomirai.com/course/view.php?id=${SubjectIds.GlobalEnglish.id}`;
                const icon = "&#x1f4D6;"; // 📖
                $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(`
                    <div class="dashboard-left-block-subject-child">
                        <div class="dashboard-left-block-subject-child-icon">${icon}</div>
                        <div class="dashboard-left-block-subject-child-text">
                            <a href="${courseLink}" target="_blank">${SubjectIds.GlobalEnglish.name}</a>
                        </div>
                    </div>
                `);
            }

            // プログラミング（Programming）の処理
            if (isProgramming) {
                console.log("プログラミングに該当しています");
                const courseLink = `https://lms.waomirai.com/course/view.php?id=${SubjectIds.Programming.id}`;
                const icon = "&#x1f52C;"; // 🔬
                $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(`
                    <div class="dashboard-left-block-subject-child">
                        <div class="dashboard-left-block-subject-child-icon">${icon}</div>
                        <div class="dashboard-left-block-subject-child-text">
                            <a href="${courseLink}" target="_blank">${SubjectIds.Programming.name}</a>
                        </div>
                    </div>
                `);
            }

            // どの科目にも該当しない場合のエラーハンドリング
            if (!isSubjectMain && !isSubjectChild && !isGlobalEnglish && !isProgramming) {
                console.error("指定された科目に該当しません");
            }
        }
    }
});
