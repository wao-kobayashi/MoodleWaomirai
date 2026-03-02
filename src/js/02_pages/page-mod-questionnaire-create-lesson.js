// ==============================
// 受講ページで各教科レベルごとに受講(zoom/vimeo)リンクを表示するスクリプト
// ==============================
if (bodyId === "page-mod-questionnaire-view")  {

  // ==============================
  // 授業詳細情報の定義
  // ==============================
  const lessonData = {
    philosophy: {
      L1: {
        day1: "火曜日 18:30〜19:15",
        day2: "金曜日 17:30〜18:15",
        zoomUrl: "https://us02web.zoom.us/j/88212059130?pwd=NDAdLY6CAqExPaOX79CQzXATdViHxL.1",
        vimeoUrl: "https://vimeo.com/event/4920629/embed/7f5f27273a/interaction"
      },
      L2: {
        day1: "火曜日 17:30〜18:15",
        day2: "金曜日 18:30〜19:15",
        zoomUrl: "https://us02web.zoom.us/j/81840052279?pwd=aZAbt4MRnlFZNaoYTEbIApm52fhxB5.1",
        vimeoUrl: "https://vimeo.com/event/4920670/embed/c70000715a/interaction"
      },
      L3: {
        day1: "火曜日 20:30〜21:15",
        day2: "金曜日 19:30〜20:15",
        zoomUrl: "https://us02web.zoom.us/j/86009824056?pwd=StlsSrwAaalh8N8qcOpNvNdnyVEFht.1",
        vimeoUrl: "https://vimeo.com/event/4920676/embed/52c21ef6b0/interaction"
      },
      L4: {
        day1: "火曜日 19:30〜20:15",
        day2: "金曜日 20:30〜21:15",
        zoomUrl: "https://us02web.zoom.us/j/87120983927?pwd=rkwsmySK9a159qQJe1lOGEfqiBQNGc.1",
        vimeoUrl: "https://vimeo.com/event/4920679/embed/ab9c66199d/interaction"
      }
    },
    science: {
      L1: {
        day1: "水曜日 17:30〜18:15",
        day2: "金曜日 18:30〜19:15",
        zoomUrl: "https://us02web.zoom.us/j/89510034444?pwd=7ozebaIqBlIOgieTR49kJRoyrFDbAe.1",
        vimeoUrl: "https://vimeo.com/event/4920693/embed/1419b3b287/interaction"
      },
      L2: {
        day1: "水曜日 18:30〜19:15",
        day2: "金曜日 17:30〜18:15",
        zoomUrl: "https://us02web.zoom.us/j/89630141873?pwd=a7PRiVpzM6tascsJIhfaeM0IzZzZ4X.1",
        vimeoUrl: "https://vimeo.com/event/4920695/embed/022465a73c/interaction"
      },
      L3: {
        day1: "水曜日 19:30〜20:15",
        day2: "金曜日 20:30〜21:15",
        zoomUrl: "https://us02web.zoom.us/j/87568402622?pwd=abT9rondMMl0evsglKUdvik6Q8bldz.1",
        vimeoUrl: "https://vimeo.com/event/4920700/embed/2352ff8d6a/interaction"
      },
      L4: {
        day1: "水曜日 20:30〜21:15",
        day2: "金曜日 19:30〜20:15",
        zoomUrl: "https://us02web.zoom.us/j/88903613273?pwd=haXeQCLEGTkNDAesgHEkcaUJN3gZhi.1",
        vimeoUrl: "https://vimeo.com/event/4920706/embed/489dacd1a2/interaction"
      }
    },
    economy: {
      L1: {
        day1: "水曜日 18:30〜19:15",
        day2: "木曜日 17:30〜18:15",
        zoomUrl: "https://us02web.zoom.us/j/87428876942?pwd=3w0rc9oYpxjT3rzwqqRL3eGWfW9P75.1",
        vimeoUrl: "https://vimeo.com/event/4920714/embed/3ca5539936/interaction"
      },
      L2: {
        day1: "水曜日 17:30〜18:15",
        day2: "木曜日 18:30〜19:15",
        zoomUrl: "https://us02web.zoom.us/j/82241164595?pwd=zHIaAKMHy7Juv3Q3TbqhlT3Wc2yIAz.1",
        vimeoUrl: "https://vimeo.com/event/4920718/embed/84fcf75c13/interaction"
      },
      L3: {
        day1: "水曜日 20:30〜21:15",
        day2: "木曜日 19:30〜20:15",
        zoomUrl: "https://us02web.zoom.us/j/87848451237?pwd=GIkmj2k1fXwaWZF3zACbbrE9sbZX7N.1",
        vimeoUrl: "https://vimeo.com/event/4920725/embed/99a117fd01/interaction"
      },
      L4: {
        day1: "水曜日 19:30〜20:15",
        day2: "木曜日 20:30〜21:15",
        zoomUrl: "https://us02web.zoom.us/j/87011842822?pwd=LAP52Ti6rxfgZ0H8rmbUkrsqY8bo78.1",
        vimeoUrl: "https://vimeo.com/event/4920727/embed/9058c274c5/interaction"
      }
    }
  };

  // ==============================
  // 授業詳細HTMLを生成する関数
  // ==============================

  // Zoomバージョン（2026年1月以降のバージョン）
  function generateLessonHtmlZoom(courseData, lessonInfo) {
    return `
  <div class="course-lesson-wrapper">
    <div class="course-lesson-date">
      ${courseData.name}の授業開催日:「${lessonInfo.day1}」または「${lessonInfo.day2}」<br>
      ※各授業は同じ内容を週に2回配信します。どちらかをご受講ください。
    </div>
    <div class="course-lesson">
      <div class="course-lesson-wrap">
        <div class="course-lesson-wrap-title">
          授業時間になったらボタンを<br class="c-pc-hidden">押して受講してください<br>
          <strong>受講には「Zoom」のインストールが必要です。<br class="c-pc-hidden">
          <a href="https://zoom.us/ja/download" target="_blank">コチラ</a>からインストールしてください。</strong>
        </div>
        <div class="course-lesson-wrap-btn">
          <div><a class="primary" href="${lessonInfo.zoomUrl}" target="_blank">授業を受講する(Zoom)</a></div>
          <div><a class="secondly" data-vimeo-url="${lessonInfo.vimeoUrl}">授業アーカイブを見る</a></div>
        </div>
      </div>
      <div class="course-lesson-bg">
        <img src="https://waomirai.com/lp/assets/moodle/images/thumbnail-movie-pc.svg">
      </div>
    </div>
  </div>
    `;
  }
  // Vimeoのみバージョン（2025年4月~12月のバージョン）
  function generateLessonHtmlVimeoOnly(courseData, lessonInfo) {
    return `
  <div class="course-lesson-wrapper">
    <div class="course-lesson-date">
      ${courseData.name}の授業開催日:「${lessonInfo.day1}」または「${lessonInfo.day2}」<br>
      ※各授業は同じ内容を週に2回配信します。どちらかをご受講ください。
    </div>
    <div class="course-lesson">
      <div class="course-lesson-wrap">
        <div class="course-lesson-wrap-title">
          授業時間になったらボタンを<br class="c-pc-hidden">押して受講してください<br>
        </div>
        <div class="course-lesson-wrap-btn">
          <div><a class="primary" data-vimeo-url="${lessonInfo.vimeoUrl}">授業を受講する</a></div>
        </div>
      </div>
      <div class="course-lesson-bg">
        <img src="https://waomirai.com/lp/assets/moodle/images/thumbnail-movie-pc.svg">
      </div>
    </div>
  </div>
    `;
  }

  // ==============================
  // Vimeoウィンドウを開く関数
  // ==============================
  function openVimeoWindow(vimeoUrl) {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
  
    const newWindow = window.open(
      '',
      '_blank',
      `width=${screenWidth},height=${screenHeight},top=0,left=0`
    );
  
    newWindow.document.open();
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>授業アーカイブ</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden;
            height: 100vh;
            width: 100vw;
          }
          .video-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .video-container iframe {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div class="video-container">
          <iframe src="${vimeoUrl}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
        </div>
      </body>
      </html>
    `);
    newWindow.document.close();
  }

  // ==============================
  // メイン処理
  // ==============================
  $(document).ready(function() {
    const $targetElement = $("#js-lesson-detail-mod-questionnaire");
    
    // 対象要素が存在しない場合は処理を終了
    if ($targetElement.length === 0) {
      return;
    }

    // currentViewCourseDataが存在し、必要な情報が揃っているか確認
    if (!currentViewCourseData || !currentViewCourseData.key || !currentViewCourseData.level) {
      console.warn("授業情報を取得できませんでした。");
      return;
    }

    // lessonDataから該当する授業情報を取得
    const lessonInfo = lessonData[currentViewCourseData.key]?.[currentViewCourseData.level];

    if (!lessonInfo) {
      console.warn(`授業情報が見つかりません: ${currentViewCourseData.key} ${currentViewCourseData.level}`);
      return;
    }

    // HTMLを生成して挿入
    //現在はZoom(+Vimeo)版を挿入
    const html = generateLessonHtmlZoom(currentViewCourseData, lessonInfo);
    $targetElement.html(html);

    // Vimeoボタンのイベントリスナーを設定
    $targetElement.on("click", "[data-vimeo-url]", function(e) {
      e.preventDefault();
      const vimeoUrl = $(this).data("vimeo-url");
      openVimeoWindow(vimeoUrl);
    });
  });
}
