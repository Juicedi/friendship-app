/**
 * Gets page contents depending on navigation calls.
 * @param {Object} mainCtrl - The applications main controller
 * @return {Object} - All of the navigation functions that are shared with other controllers
 */
const Navigation = (mainCtrl) => {
  let pages = [];
  let pageNr = 0;
  let prevPage = '';
  let currPage = '';
  const errors = [];
  const folder = 'content/';

  /**
   * Gets pages content using AJAX call. After successful content fetch, calls for page function initialization from main controller.
   * @param {String} c - Page's filename which content should be fetched
   */
  function getContent(c) {
    let url;
    if (c.indexOf(':') !== -1) {
      const temp = c.split(':');
      url = `${folder}${temp[0]}.html`;
    } else {
      url = `${folder}${c}.html`;
    }
    prevPage = currPage;
    currPage = c;

    $.ajax({
      url: url,
      success: (content) => {
        $('#content').fadeOut(100, () => {
            $('#content').html(content);
            mainCtrl.initPage(c);
          $('#content').fadeIn(300)
        });
      },
      error: () => {
        setTimeout(() => {
          errors.push({
            page: pageNr,
          });
        }, 2000);
      },
    });
  };

  return {
    init: () => {
      getContent(c);
    },
    getPrevPage: () => {
      return prevPage;
    },
    getCurrentPage: () => {
      return currPage;
    },
    getContent: (c) => {
      getContent(c);
    },
  };
};
