const Navigation = () => {
  let pages = [];
  let pageNr = 0;
  let startTime = 0;
  const errors = [];
  const folder = 'content/';

  // PAGECONTROLLER WITH AJAX
  function getContent(c) {
    const url = `${folder}${c}.html`;
    $.ajax({
      url: url,
      success: (content) => {
    console.log(content);
        $('#content').html(content);
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
