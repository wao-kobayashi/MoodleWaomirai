// 検証テナントの変数定義
const SubjectIds = {
  SubjectMain: {
      philosophy: { id: 212, name: '哲学' },
      science: { id: 211, name: '科学' },
      economy: { id: 213, name: '経済' },
      ThreeSubjectPack: { id: 229, name: '3科目セット' },
      TwoSubjectPack: { id: 228, name: '2科目セット' },
      GlobalEnglish: { id: 236, name: 'グローバル英語' },
  },
  SubjectChild: {
      philosophy: {
          ph_L1: { id: 221, name: '哲学 L1' },
          ph_L2: { id: 225, name: '哲学 L2' },
          ph_L3: { id: 242, name: '哲学 L3' },
          ph_L4: { id: 243, name: '哲学 L4' }
      },
      science: {
          sc_L1: { id: 223, name: '科学 L1' },
          sc_L2: { id: 222, name: '科学 L2' },
          sc_L3: { id: 244, name: '科学 L3' },
          sc_L4: { id: 245, name: '科学 L4' }
      },
      economy: {
          ec_L1: { id: 226, name: '経済 L1' },
          ec_L2: { id: 227, name: '経済 L2' },
          ec_L3: { id: 246, name: '経済 L3' },
          ec_L4: { id: 247, name: '経済 L4' }
      },
      GlobalEnglish: {
          en_L1: { id: 253, name: 'グローバル英語 L1' },
          en_L2: { id: 254, name: 'グローバル英語 L2' },
      },
  },
 
  Programming: { id: 235, name: 'プログラミング' }
};
