// 検証テナントの変数定義
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