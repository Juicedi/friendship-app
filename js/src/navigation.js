const Navigation = (mainCtrl) => {
  let pages = [];
  let pageNr = 0;
  let prevPage = '';
  let currPage = '';
  const errors = [];
  const folder = 'content/';

  // PAGECONTROLLER WITH AJAX
  function getContent(c) {
    const url = `${folder}${c}.html`;
    prevPage = currPage;
    currPage = c;

    $.ajax({
      url: url,
      success: (content) => {
        $('#content').fadeOut(100, () => {
            $('#content').html(content);
            mainCtrl.initPageBtns(c);
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
    getPrevPage: (c) => {
      return prevPage;
    },
    getContent: (c) => {
      getContent(c);
    },
  };
};
