const preload = (arrayOfImages) => {
  $(arrayOfImages).each(function () {
    $('<img/>')[0].src = this;
  });
}
preload([]);

const MainController = (function(e) {
  let self = null;
  let pageCtrl, dataCtrl, animCtrl, ajaxCtrl, navCtrl;

  function initControllers () {
    console.log('Initializing controllers');
    pageCtrl = new PageController(self);
    dataCtrl = new DataController(self);
    animCtrl = new AnimationController(self);
    navCtrl = new Navigation(self);
  }

  function startApplication() {
    console.log('Starting application');
    navCtrl.getContent('event_search');
  }

  return {
    init(that) {
      self = that;
      initControllers();
      startApplication();
    },

    // Navigation functions
    getPrevPage() {
      return navCtrl.getPrevPage();
    },
    changePage(page) {
      navCtrl.getContent(page);
    },

    // PageController functions
    initPageBtns(page) {
      pageCtrl.initPageBtns(page);
    }
  };
})();

$(window).load(() => {
  $('.loading').fadeOut(500, () => {
    console.log('init main');
    MainController.init(MainController);
    $('.loaded').fadeIn(1000);
  });
});
