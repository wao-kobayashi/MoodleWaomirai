// 変数定義
const SubjectIds = {
    SubjectMain: {
        philosophy: { id: 212, name: '哲学' },
        science: { id: 211, name: '科学' },
        economy: { id: 213, name: '経済' },
        ThreeSubjectPack: { id: 229, name: '3科目セット' },
        TwoSubjectPack: { id: 228, name: '2科目セット' },
    },
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
        },
    },
    GlobalEnglish: { id: 236, name: 'グローバル英語' },
    Programming: { id: 235, name: 'プログラミング' }
};

$(document).ready(function() {
    const tenantIdNumber = $("html").data("tenantidnumber");
    console.log("tenantIdNumber:", tenantIdNumber);

    if (tenantIdNumber === "stg") {
        const bodyId = $("body").attr("id");
        console.log("bodyId:", bodyId);

        const bodyClasses = $("body")
            .attr("class")
            .split(" ")
            .map(cls => parseInt(cls.replace("course-id-", "").trim()));
        console.log("bodyClasses:", bodyClasses);

        // 汎用的なグループチェック関数
        function checkGroup(subjectIds) {
            return Object.values(subjectIds).some(id => bodyClasses.includes(id.id));
        }

        // 科目グループ判定
        const isSubjectMain = checkGroup(SubjectIds.SubjectMain);
        console.log("isSubjectMain:", isSubjectMain);

        const isSubjectChild = ['philosophy', 'science', 'economy'].some(subject => checkGroup(SubjectIds.SubjectChild[subject]));
        console.log("isSubjectChild:", isSubjectChild);

        const isGlobalEnglish = bodyClasses.includes(SubjectIds.GlobalEnglish.id);
        console.log("isGlobalEnglish:", isGlobalEnglish);

        const isProgramming = bodyClasses.includes(SubjectIds.Programming.id);
        console.log("isProgramming:", isProgramming);

        // ==============================
        // ダッシュボードページでの処理
        // ==============================
        if (bodyId === "page-my-index") {
            ////////////////////////////
            // 受講中科目の処理
            ////////////////////////////
            
            function renderSubject(subject, icon, isSubjectMain) {
                // SubjectMain の場合のリンクを変更
                const courseLink = isSubjectMain 
                    ? `https://lms.waomirai.com/admin/tool/catalogue/courseinfo.php?id=${subject.id}`
                    : `https://lms.waomirai.com/course/view.php?id=${subject.id}`;
                console.log("Rendering subject:", subject.name, "Link:", courseLink);

                return `
                    <div class="dashboard-left-block-subject-child">
                        <div class="dashboard-left-block-subject-child-icon">${icon}</div>
                        <div class="dashboard-left-block-subject-child-text">
                            <a href="${courseLink}" target="_blank">${subject.name}</a>
                        </div>
                    </div>
                `;
            }

            // アイコンの取得（SubjectMain & SubjectChild 用）
            const getIcon = (subject) => {
                console.log("Getting icon for subject:", subject.name);
                if (subject.name.includes('哲学')) return "&#x1f4D6;"; // 📖
                if (subject.name.includes('科学')) return "&#x1f52C;"; // 🔬
                if (subject.name.includes('経済')) return "&#x1f4B0;"; // 💰
                if (subject.name === 'グローバル英語') return "&#x1f4D6;"; // 📖
                if (subject.name === 'プログラミング') return "&#x1f52C;"; // 🔬
                return "&#x1f9ea;"; // デフォルト
            };

            // メイン科目（SubjectMain）の処理
            if (!isSubjectChild && isSubjectMain) {
                console.log("メイン科目（SubjectMain）に該当しています");
                const subjectMainNames = Object.values(SubjectIds.SubjectMain)
                    .filter(subSubject => bodyClasses.includes(subSubject.id))
                    .map(subSubject => {
                        console.log("Filtering and rendering subject:", subSubject.name);
                        return renderSubject(subSubject, getIcon(subSubject), true); // true を渡してSubjectMain用のリンクにする
                    })
                    .join("");
                if (subjectMainNames) {
                    console.log("Appending subjectMainNames:", subjectMainNames);
                    $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(subjectMainNames);
                }
            }

            // 詳細科目（SubjectChild）の処理
            if (isSubjectChild) {
                console.log("詳細科目（SubjectChild）に該当しています");
                const subjectChildNames = [];
                ['philosophy', 'science', 'economy'].forEach(subjectKey => {
                    console.log("Processing subject:", subjectKey);
                    Object.values(SubjectIds.SubjectChild[subjectKey])
                        .filter(subSubject => bodyClasses.includes(subSubject.id))
                        .forEach(subSubject => {
                            console.log("Adding child subject:", subSubject.name);
                            subjectChildNames.push(renderSubject(subSubject, getIcon(subSubject), false)); // false を渡して通常のリンクにする
                        });
                });
                if (subjectChildNames.length > 0) {
                    console.log("Appending subjectChildNames:", subjectChildNames);
                    $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(subjectChildNames.join(""));
                }
            }

            // グローバル英語（GlobalEnglish）の処理
            if (isGlobalEnglish) {
                console.log("グローバル英語に該当しています");
                $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(renderSubject(SubjectIds.GlobalEnglish, getIcon(SubjectIds.GlobalEnglish), false));
            }

            // プログラミング（Programming）の処理
            if (isProgramming) {
                console.log("プログラミングに該当しています");
                $(".dashboard-left-block-wrap.dashboard-left-block-wrap-subject").append(renderSubject(SubjectIds.Programming, getIcon(SubjectIds.Programming), false));
            }

            // どの科目にも該当しない場合のエラーハンドリング
            if (!isSubjectMain && !isSubjectChild && !isGlobalEnglish && !isProgramming) {
                console.error("指定された科目に該当しません");
            }
        }
    }
});
