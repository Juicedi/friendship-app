const Navigation = (mainCtrl) => {
  let pages = [];
  let pageNr = 0;
  const errors = [];
  const folder = 'content/';

  // PAGECONTROLLER WITH AJAX
  function getContent(c) {
    const url = `${folder}${c}.html`;
    $.ajax({
      url: url,
      success: (content) => {
        $('#content').html(content);
        mainCtrl.initPageBtns(c);
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
    getContent: (c) => {
      console.log('navigating');
      getContent(c);
    },
  };
};
