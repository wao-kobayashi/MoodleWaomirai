// 検証テナントの変数定義
const SubjectIds = {
  SubjectMain: {
      philosophy: { id: 212, name: '哲学', key:'philosophy' },
      science: { id: 211, name: '科学', key:'science' },
      economy: { id: 213, name: '経済', key:'economy' },
      ThreeSubjectPack: { id: 229, name: '3科目セット', key:'threesubjectpack' },
      TwoSubjectPack: { id: 228, name: '2科目セット',  key:'twosubjectpack' },
      GlobalEnglish: { id: 236, name: 'グローバル英語', key:'globalenglish' },
  },
  SubjectChild: {
      philosophy: {
          ph_L1: { id: 221, name: '哲学 L1', key:'philosophy' },
          ph_L2: { id: 225, name: '哲学 L2', key:'philosophy'},
          ph_L3: { id: 242, name: '哲学 L3', key:'philosophy' },
          ph_L4: { id: 243, name: '哲学 L4', key:'philosophy'}
      },
      science: {
          sc_L1: { id: 223, name: '科学 L1', key:'science'  },
          sc_L2: { id: 222, name: '科学 L2', key:'science'  },
          sc_L3: { id: 244, name: '科学 L3', key:'science'  },
          sc_L4: { id: 245, name: '科学 L4', key:'science'  }
      },
      economy: {
          ec_L1: { id: 226, name: '経済 L1', key:'economy' },
          ec_L2: { id: 227, name: '経済 L2', key:'economy' },
          ec_L3: { id: 246, name: '経済 L3', key:'economy' },
          ec_L4: { id: 247, name: '経済 L4', key:'economy' }
      },
      GlobalEnglish: {
          en_L1: { id: 253, name: 'グローバル英語 L1', key:'globalenglish'  },
          en_L2: { id: 254, name: 'グローバル英語 L2', key:'globalenglish'  },
      },
  },
 
  Programming: { id: 235, name: 'プログラミング', key:'programming' }
};

$(document).ready(function() {
    const tenantIdNumber = $("html").data("tenantidnumber");
    if (tenantIdNumber === "stg") {
alert('page-user-edit');   }
});