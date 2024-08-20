$(document).ready(function() {
    $('.hapitas-section-group-tab-child').on('click', function() {
        // すべてのタブから active クラスを外す
        $('.hapitas-section-group-tab-child').removeClass('active');
        // クリックされたタブに active クラスを追加
        $(this).addClass('active');
        
        // すべてのコンテンツを非表示
        $('.hapitas-section-group-tab-content > div').removeClass('active-content').hide();
        
        // クリックされたタブに対応するコンテンツを表示
        const tabId = $(this).attr('id').replace('tab-', 'tab-content-');
        const $tabContent = $('#' + tabId);
        
        $tabContent.addClass('active-content').show();
        
        // hapitas-section-group-tab-content にタブに対応するクラスを追加
        const tabClass = $(this).attr('id').replace('tab-', 'tab-content-');
        $('.hapitas-section-group-tab-content').removeClass(function(index, className) {
            // 既存の tab-content-* クラスを削除
            return (className.match(/(^|\s)tab-content-\S+/g) || []).join(' ');
        }).addClass(tabClass);
    });
});
