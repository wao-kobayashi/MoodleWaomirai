// ==============================
// マイページの処理
// ==============================
if (bodyId === "page-user-edit") { // ページIDが「page-user-edit」の場合に処理を実行
    // 各科目の入力エリアを取得
    var AreaPhilosophy = $("#fitem_id_profile_field_Philosophy_Level"); // 哲学の入力エリア
    var AreaScience = $("#fitem_id_profile_field_Science_Level"); // 科学の入力エリア
    var AreaEconomy = $("#fitem_id_profile_field_Economy_Level"); // 経済の入力エリア
    var AreaEnglish = $("#fitem_id_profile_field_English_Level"); // 英語の入力エリア
    var AreaSingleCourse = $("#fitem_id_profile_field_1cource_Subject"); // １科目受講の入力エリア
    var AreaTwoCourse = $("#fitem_id_profile_field_2cources_subject"); // ２科目受講の入力エリア
  
    // 各科目のエリアを配列にまとめて、後で一括で非表示にする
    var AreaElements = [
      AreaPhilosophy,
      AreaScience,
      AreaEconomy,
      AreaEnglish,
      AreaSingleCourse,
      AreaTwoCourse,
    ];
    // 配列内の各エリアを非表示にする
    AreaElements.forEach(function (AreaElement) {
      AreaElement.hide();
    });
  
    // 初回受講レベル登録時、submit直前に注意文言を表示する関数
    let isAlertSubjectSettingFirstShown = false; // フラグを追加
  
    function AlertSubjectSettingFirst() {
      if (!isAlertSubjectSettingFirstShown) { // フラグがfalseの場合のみ実行
        $("#fgroup_id_buttonar").before(
          `<div id="id_submitbutton-subject">一度受講レベルを設定すると、2回目以降のレベル変更時の反映は当月末になりますのでご注意くださいませ。</div>`
        );
        //英語と他科目を受講する場合、複数回発火することを防ぐためにフラグをtrueに設定
        isAlertSubjectSettingFirstShown = true; // フラグをtrueに設定
      }
    }
  
    // サブレベル（子科目）の自動取得を行う関数
    function getOwnedSubLevels(subjectKey, levels) {
      // subjects 配列から、指定された科目キーとレベルに一致する子科目を抽出
      return subjects
        .filter(
          (subject) =>
            subject.type === "child" && // 子科目を対象
            subject.key === subjectKey && // 指定された科目キーに一致
            levels.includes(subject.level) && // 指定されたレベルの中に該当する
            bodyClasses.includes(subject.id) // 現在のページに関連付けられた科目IDか確認
        )
        .map((subject) => subject.level); // 該当するレベルを配列で返す
    }
  
    // 1科目選択のセレクトボックスを取得する関数
    function getSelectElement(Area) {
      return Area.find("select"); // 引数で渡されたエリア内のselect要素を取得
    }
  
    // 2科目以上選択する場合の処理（必要な場合、変更を監視）
    function handleMultipleSelectChange(selectors, callback) {
      var selectedIndexes = []; // インデックスを格納する配列
  
      // 各select要素から選択されたインデックスを取得して配列に格納
      $(selectors).each(function () {
        var selectedIndex = $(this).prop("selectedIndex");
        selectedIndexes.push(selectedIndex);
      });
  
      // コールバック関数に選ばれたインデックスを渡して実行
      callback(selectedIndexes);
  
      // 各select要素にchangeイベントを再設定（選択肢が変更された時にインデックスを更新）
      $(selectors).on("change", function () {
        selectedIndexes = []; // インデックス配列を初期化
  
        // 再度インデックスを取得し、配列に格納
        $(selectors).each(function () {
          var selectedIndex = $(this).prop("selectedIndex");
          selectedIndexes.push(selectedIndex);
        });
  
        // コールバック関数に更新されたインデックスを渡して実行
        callback(selectedIndexes);
      });
    }
  
    // 【1科目受講】のケース
  
    // 1科目「哲学」のみ購入した場合
    if (
      checkBoughtMainSubject(["philosophy"]) && // 購入した主科目が「哲学」か確認
      !checkBoughtMainSubject(["science", "economy"]) // 購入した主科目が「科学」や「経済」でないことを確認
    ) {
      AreaPhilosophy.show(); // 哲学の入力エリアを表示
      // 初回受講レベル登録時、注意文言を表示
      if (!checkBoughtChildSubject("philosophy", ["L1", "L2", "L3", "L4"])) {
        AlertSubjectSettingFirst(); // 初回レベル設定の警告
      }
    }
  
    // 1科目「科学」のみ購入した場合
    if (
      checkBoughtMainSubject(["science"]) && // 購入した主科目が「科学」か確認
      !checkBoughtMainSubject(["philosophy", "economy"]) // 購入した主科目が「哲学」や「経済」でないことを確認
    ) {
      AreaScience.show(); // 科学の入力エリアを表示
      // 初回受講レベル登録時、注意文言を表示
      if (!checkBoughtChildSubject("science", ["L1", "L2", "L3", "L4"])) {
        AlertSubjectSettingFirst(); // 初回レベル設定の警告
      }
    }
  
    // 1科目「経済」のみ購入した場合
    if (
      checkBoughtMainSubject(["economy"]) && // 購入した主科目が「経済」か確認
      !checkBoughtMainSubject(["philosophy", "science"]) // 購入した主科目が「哲学」や「科学」でないことを確認
    ) {
      AreaEconomy.show(); // 経済の入力エリアを表示
      // 初回受講レベル登録時、注意文言を表示
      if (!checkBoughtChildSubject("economy", ["L1", "L2", "L3", "L4"])) {
        AlertSubjectSettingFirst(); // 初回レベル設定の警告
      }
    }
  
    // 英語購入の場合
    if (checkBoughtMainSubject(["globalenglish"])) { // 購入した主科目が「英語」か確認
      AreaEnglish.show(); // 英語の入力エリアを表示
      // 初回受講レベル登録時、注意文言を表示
      if (!checkBoughtChildSubject("globalenglish", ["L1", "L2"])) {
        AlertSubjectSettingFirst(); // 初回レベル設定の警告
      }
    }
  
    // 【2科目セット購入】の場合
    if (checkBoughtMainSubject(["twosubjectpack"], true)) { // 2科目セットを購入している場合
      AreaTwoCourse.show(); // 2科目選択のプルダウンを表示
  
      // プルダウン変更時に呼ばれる関数
      function updateAreaOnSelection() {
        var selectedIndex = getSelectElement(AreaTwoCourse).prop("selectedIndex"); // 選択されたインデックスを取得
  
        // 2科目の選択に応じて表示する科目エリアを更新
        switch (selectedIndex) {
          case 1: // 哲学 + 科学
            AreaPhilosophy.show();
            AreaScience.show();
            AreaEconomy.hide();
            break;
  
          case 2: // 科学 + 経済
            AreaPhilosophy.show();
            AreaScience.hide();
            AreaEconomy.show();
            break;
  
          case 3: // 科学 + 経済（逆の場合）
            AreaPhilosophy.hide();
            AreaScience.show();
            AreaEconomy.show();
            break;
          default: // それ以外の選択肢
            AreaPhilosophy.hide();
            AreaScience.hide();
            AreaEconomy.hide();
        }
      }
  
      // ページロード時に実行
      updateAreaOnSelection();
  
      // プルダウン変更時に再度実行
      getSelectElement(AreaTwoCourse).on("change", updateAreaOnSelection);
  
      // 初回受講レベル登録時、注意文言を表示
      if (
        !checkBoughtChildSubject("economy", ["L1", "L2", "L3", "L4"]) &&
        !checkBoughtChildSubject("philosophy", ["L1", "L2", "L3", "L4"]) &&
        !checkBoughtChildSubject("science", ["L1", "L2", "L3", "L4"])
      ) {
        getSelectElement(AreaTwoCourse).after(
          "<div class='subject-select-levelnotset'>科目を選択してください</div>"
        );
        AlertSubjectSettingFirst(); // 初回レベル設定の警告
      }
    }
  
    // 【3科目セット購入】の場合
    if (checkBoughtMainSubject(["threesubjectpack"], true)) { // 3科目セットを購入している場合
      AreaPhilosophy.show(); // 哲学を表示
      AreaScience.show(); // 科学を表示
      AreaEconomy.show(); // 経済を表示
      // 初回受講レベル登録時、注意文言を表示
      if (
        !checkBoughtChildSubject("economy", ["L1", "L2", "L3", "L4"]) &&
        !checkBoughtChildSubject("philosophy", ["L1", "L2", "L3", "L4"]) &&
        !checkBoughtChildSubject("science", ["L1", "L2", "L3", "L4"])
      ) {
        AlertSubjectSettingFirst(); // 初回レベル設定の警告
      }
    }
  
    // 各科目の設定を配列で定義
    const subjectConfigs = [
      {
        subject: "philosophy",
        area: AreaPhilosophy,
        levels: ["L1", "L2", "L3", "L4"],
      },
      {
        subject: "science",
        area: AreaScience,
        levels: ["L1", "L2", "L3", "L4"],
      },
      {
        subject: "economy",
        area: AreaEconomy,
        levels: ["L1", "L2", "L3", "L4"],
      },
      {
        subject: "globalenglish",
        area: AreaEnglish,
        levels: ["L1", "L2"],
      },
    ];
  
    // メッセージを表示するための定義
    const messages = {
      levelSet: (ownedLevels) =>
        `<div class="subject-select-levelset">
           現在受講中のレベルは ${ownedLevels}です<br>
           レベルの変更は月末反映となります。即時反映されませんのでご注意ください。
         </div>`,
      levelNotSet:
        '<div class="subject-select-levelnotset">受講レベルを設定してください。</div>',
    };
  
    // 各科目の設定を一括で処理
    subjectConfigs.forEach(({ subject, area, levels }) => {
      const ownedLevels = getOwnedSubLevels(subject, levels); // 所有しているレベルを取得
  
      const message =
        ownedLevels.length > 0
          ? messages.levelSet(ownedLevels) // 所有しているレベルがあればレベル設定メッセージを表示
          : messages.levelNotSet; // レベルが設定されていなければレベル設定を促すメッセージ
  
      getSelectElement(area).after(message); // エリアの後にメッセージを追加
    });
  
    //見出し直下にテキストを表示。
    if (hasBoughtMainSubject) {
      //メイン科目持っている時
      $("#id_category_10 > .d-flex").after(`
        <p class="subject-level-note">
          受講科目のレベルを選択してください。<br />
          選択した科目のレベルを設定しないと授業を受けることができません。<br />
          一度受講レベルを設定すると、2回目以降のレベル変更時の反映は当月末になりますのでご注意ください。
        </p>
      `);
      
    } else {
      //メイン科目がない時
      $("#id_category_10 > .d-flex").after(`
        <p class="subject-level-note">
          科目を購入した後に受講科目レベルを設定することができます。<br />
          科目の一覧は<a href="${UrlHome}" style="text-decoration:underline !important;">コチラ</a>からご確認いただけます。
        </p>
      `);
    }
  }
  