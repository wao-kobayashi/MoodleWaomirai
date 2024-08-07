//カウントアップの関数
function countUp(selector, duration, easing) {
    $(selector).each(function() {
        $(this).text('0');
        var $this = $(this),
            countTo = $this.attr('data-count');
        $({ countNum: $this.text() }).animate({
            countNum: countTo
        }, {
            duration: duration,
            easing: easing,
            step: function() {
                $this.text(Math.floor(this.countNum));
            },
            complete: function() {
                $this.text(this.countNum);
            }
        });
    });
}
//グラフセレクタの関数
function animateElements(selector) {
    $(selector).each(function() {
        var $this = $(this);
        $this.removeClass('animate'); // アニメーションクラスを一旦削除してから
        $this.css('height', ''); // 高さの設定を空にする（初期状態に戻す）
        void $this[0].offsetWidth; // 再描画のためのトリック
        $this.addClass('animate'); // 再度アニメーションクラスを追加
    });
}
$(document).ready(function() {
    countUp('.counter', 1000, 'linear');
    animateElements('.cac-main-report-graph-box-content-bar');
    //ナビゲーションのアクティブ、非アクティブのjs
    $('.salonai-main-left-navi li').on('click', function() {
        // 現在のactiveクラスを削除して画像のソースを元に戻す
        $('ul li.active').removeClass('active').find('img').each(function() {
            var src = $(this).attr('src');
            $(this).attr('src', src.replace('_active.svg', '.svg'));
        });
        // クリックされたli要素にactiveクラスを追加して画像のソースを更新する
        $(this).addClass('active').find('img').each(function() {
            var src = $(this).attr('src');
            $(this).attr('src', src.replace('.svg', '_active.svg'));
        });
    });
    //CACランキングのナビゲーション操作のJS
    $('.cac-sub-ads-card').on('click', function() {
        countUp('.counter', 1000, 'linear');
        animateElements('.cac-main-report-graph-box-content-bar');
        $('.cac-main-report-graph-box-content-bar').each(function() {
            $(this).addClass('animate');
        });
        // すべてのカードから 'active' クラスを削除
        $('.cac-sub-ads-card').removeClass('active');
        // クリックされたカードに 'active' クラスを追加
        $(this).addClass('active');
    });
    //サロン集客AIの予算のJS、
    //inputに45000って入れたら、4.5万円になる（四捨五入にしている
    $('#budget-input').on('input', function() {
        var value = $(this).val();
        // 数字とカンマ以外の文字を削除し、カンマを削除して数値に変換
        var parsedValue = parseFloat(value.replace(/[^0-9.]/g, '').replace(',', ''));
        // 数値がNaN（Not a Number）であるか、または空白の場合は0に設定する
        if(isNaN(parsedValue) || value.trim() === '') {
            parsedValue = 0;
        }
        var roundedValue = Math.floor(parsedValue / 1000) / 10; // 小数点第一位で切り捨て
        $('#monthly-budget').text(roundedValue);
    });
    $('.open-demo-dialog').on('click', function() {
        $('.salonai-demo-dialog').show();
        $('.salonai-dialog-bg').show();
    });
    $('.open-demo-dialog-target').on('click', function() {
        $('.salonai-demo-dialog-target').show();
        $('.salonai-dialog-bg').show();
    });
    $('.salonai-dialog-close,.salonai-dialog-bg').on('click', function() {
        $('.salonai-dialog').hide();
        $('.salonai-dialog-bg').hide();
    });
    $('.salonai-alert-banner-title-right-hidden').on('click', function() {
        $('.salonai-alert-banner ').hide();
    });
});