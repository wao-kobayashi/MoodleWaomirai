const SubjectIds = {
  subjects: [
    { id: 212, name: "哲学", key: "philosophy", type: "main" },
    { id: 211, name: "科学", key: "science", type: "main" },
    { id: 213, name: "経済", key: "economy", type: "main" },
    { id: 229, name: "3科目セット", key: "threesubjectpack", type: "main" },
    { id: 228, name: "2科目セット", key: "twosubjectpack", type: "main" },
    { id: 236, name: "グローバル英語", key: "globalenglish", type: "main" },
    { id: 235, name: "プログラミング", key: "programming", type: "main" },

    // 子科目
    {
      id: 221,
      name: "哲学 L1",
      key: "philosophy",
      parentKey: "philosophy",
      type: "child",
    },
    {
      id: 225,
      name: "哲学 L2",
      key: "philosophy",
      parentKey: "philosophy",
      type: "child",
    },
    {
      id: 242,
      name: "哲学 L3",
      key: "philosophy",
      parentKey: "philosophy",
      type: "child",
    },
    {
      id: 243,
      name: "哲学 L4",
      key: "philosophy",
      parentKey: "philosophy",
      type: "child",
    },

    {
      id: 223,
      name: "科学 L1",
      key: "science",
      parentKey: "science",
      type: "child",
    },
    {
      id: 222,
      name: "科学 L2",
      key: "science",
      parentKey: "science",
      type: "child",
    },
    {
      id: 244,
      name: "科学 L3",
      key: "science",
      parentKey: "science",
      type: "child",
    },
    {
      id: 245,
      name: "科学 L4",
      key: "science",
      parentKey: "science",
      type: "child",
    },

    {
      id: 226,
      name: "経済 L1",
      key: "economy",
      parentKey: "economy",
      type: "child",
    },
    {
      id: 227,
      name: "経済 L2",
      key: "economy",
      parentKey: "economy",
      type: "child",
    },
    {
      id: 246,
      name: "経済 L3",
      key: "economy",
      parentKey: "economy",
      type: "child",
    },
    {
      id: 247,
      name: "経済 L4",
      key: "economy",
      parentKey: "economy",
      type: "child",
    },

    {
      id: 253,
      name: "グローバル英語 L1",
      key: "globalenglish",
      parentKey: "globalenglish",
      type: "child",
    },
    {
      id: 254,
      name: "グローバル英語 L2",
      key: "globalenglish",
      parentKey: "globalenglish",
      type: "child",
    },
  ],
};
