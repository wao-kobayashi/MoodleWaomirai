////////////////////////////////////
// モックを動かす用のjs、実装では必要ない
////////////////////////////////////
$(document).ready(function() {
    var isExecuting = false;

    function savecaution() {
        $('.salonai-head-right-button').addClass('save-caution');
        $('.salonai-head-right-button-head').show();
    }
    // input、button、およびselect要素のイベントを統合して検知
    $(document).on('click change', 'input, button, select', function(event) {
        // 特定のクラスを持つ要素でのイベント発生時の処理
        if($(event.target).hasClass('salonai-head-right-button')) {
            console.log('aa');
            // 他のイベントを阻止するためにフラグをチェックして制御
            if(!isExecuting) {
                isExecuting = true;
                alert('広告を配信しました');
                $('.salonai-head-right-button').removeClass('save-caution');
                $('.salonai-head-right-button-head').hide();
                setTimeout(function() {
                    isExecuting = false;
                }, 1000); // 適切な時間を設定してフラグをリセットする
            }
            return false; // イベントの伝播を停止
        }
        // 特定のクラスを持たない要素でのイベント発生時の処理
        if(event.type === 'click' && event.target.tagName.toLowerCase() === 'button') {
            savecaution();
        } else if(event.type === 'change' && (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'select')) {
            savecaution();
        }
    });
    $('[id^="demo-ad-1"]').click(function() {
        var newText = '全てのレポート';
        $('.cac-main-report-summary-cost-title').html(newText);
    });
    $('[id^="demo-ad-2"]').click(function() {
        var newImage = '<img src="https://limehair.jp/php74-lime/wp-content/uploads/2024/07/ad-facebook.png" >';
        $('.cac-main-report-summary-cost-title').html(newImage);
    });
    $('[id^="demo-ad-3"]').click(function() {
        var newImage = '<img src="https://limehair.jp/php74-lime/wp-content/uploads/2024/07/ad-google.png" >';
        $('.cac-main-report-summary-cost-title').html(newImage);
    });
    $('[id^="demo-ad-4"]').click(function() {
        var newText = 'チラシ/DMマーケティング';
        $('.cac-main-report-summary-cost-title').html(newText);
    });
    $('[id^="demo-ad-5"]').click(function() {
        var newText = 'STEKiNA';
        $('.cac-main-report-summary-cost-title').html(newText);
    });
});