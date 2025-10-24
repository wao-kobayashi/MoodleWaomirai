// ==============================
// カテゴリページの処理
// ==============================
if (bodyId === "page-user-profile") {
    
    $('.alert-success').html('変更が保存されました。科目レベルを設定した場合、<a href="https://lms.waomirai.com/my/">受講カレンダー</a>で確認ができます');  
   
    // 非表示にしたいキーワードの配列（OR条件）
    // ここで非表示にしている項目
    // ログイン活動：ログイン履歴（これはユーザーにとっては不要な情報）
    // レポート：意味のないレポート（これはユーザーにとっては不要な情報）
    // ジョブ：ジョブ情報（これはユーザーにとっては不要な情報）
    // Stripe退会するための情報（これはユーザーにとっては不要な情報）
    // 補足：stripeは金額は確認できるようにして、退会するための情報は非表示にしたほうがいいかも
    const hideKeywords = ['レポート', 'ジョブ', 'Stripe'];

    // すべてのsectionに対してループ処理
    $('.card').each(function() {
        // 現在のセクション内のh3テキストを取得
        // alert('a');
        const h3Text = $(this).find('h3.lead').text();
        console.log(h3Text);
        // キーワードのいずれかが含まれているかチェック（OR条件）
        const shouldHide = hideKeywords.some(keyword => h3Text.includes(keyword));

        // キーワードが含まれていたら、そのセクション全体を非表示にする
        if (shouldHide) {
          this.setAttribute("style", "display: none !important;");
        }
    });
    // ステップ1: profile_treeクラス内のnode_categoryクラスを持つすべてのセクションを取得
    const $sections = $('.profile_tree .node_category');
    
    // ステップ2: 各セクションを順番にチェック
    $sections.each(function() {
      // ステップ3: 現在のセクション内からh3要素を検索
      const $h3 = $(this).find('h3');
      
      // ステップ4: h3要素が存在し、そのテキストに「その他」が含まれているかを確認
      if ($h3.length > 0 && $h3.text().includes('その他')) {
        // ステップ5: 挿入するカスタムHTMLを作成
        const lineConnectHTML = `
        <section class="node_category card d-inline-block w-100 mb-3 line-connection-seciton">
          <div class="card-lineimg">
            <img src="https://waomirai.com/lp/assets/moodle/images/page_mypage_line.png">
          </div>
          <div class="card-body">
              <a class="line-button triger-line-integration-modal">いますぐLINE連携する</a>
          </div>
        </section>`;
              
        // 「その他」を含むセクションの直後にLINE連携セクションを挿入
        $(this).after(lineConnectHTML);
              
        
        // ステップ7: 最初に見つかった「その他」セクションの後に挿入したら処理を終了
        // (複数の「その他」セクションがある場合は最初の1つだけに対応)
        return false; // eachループを終了（jQueryのeachでは、falseを返すとループが中断される）
      }
    });
}

