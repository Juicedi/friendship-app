const preload = (arrayOfImages) => {
  $(arrayOfImages).each(function () {
    $('<img/>')[0].src = this;
  });
}
preload([]);

/**
 * Runs the application and controls all of the application controllers
 * @return {Object} - All of the main controller functions that are shared with other controllers
 */
const MainController = (function() {
  let self = null;
  let pageCtrl, dataCtrl, animCtrl, ajaxCtrl, navCtrl;

  /**
   * Initializes all of this applications controllers and gives itself to them as a parameter.
   */
  function initControllers () {
    console.log('Initializing controllers');
    pageCtrl = new PageController(self);
    dataCtrl = new DataController(self);
    animCtrl = new AnimationController(self);
    navCtrl = new Navigation(self);
  }

  /**
   * Starts application by loading the first page.
   */
  function startApplication() {
    console.log('Starting application');
    dataCtrl.getUserInfo('testeri');
    navCtrl.getContent('event_search');
  }

  return {
    init(that) {
      self = that;
      initControllers();
      startApplication();
    },

    // DataController functions
    getUserEvents() {
      dataCtrl.getUserEvents();
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
    },
    populateOwnEvents(events) {
      pageCtrl.populateOwnEvents(events);
    },
  };
})();

$(window).load(() => {
  $('.loading').fadeOut(500, () => {
    console.log('init main');
    MainController.init(MainController);
    $('.loaded').fadeIn(1000);
  });
});
