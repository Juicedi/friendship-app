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
const MainController = (function () {
  let self = null;
  let pageCtrl, dataCtrl, animCtrl, ajaxCtrl, navCtrl;

  /**
   * Initializes all of this applications controllers and gives itself to them as a parameter.
   */
  function initControllers() {
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
    navCtrl.getContent('own_events');
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
    getSuggestedEvents() {
      dataCtrl.getSuggestedEvents();
    },
    getUserData() {
      return dataCtrl.getUserData();
    },
    getEventInfo(id, callback) {
      return dataCtrl.getEventInfo(id, callback);
    },
    getSearchResults(searchInput) {
      dataCtrl.getSearchResults(searchInput);
    },
    attendEvent(id) {
      dataCtrl.attendEvent(id);
    },
    leaveEvent(id) {
      dataCtrl.leaveEvent(id);
    },
    removeEvent(id) {
      dataCtrl.removeEvent(id);
    },
    removeTag(eventId, tag) {
      dataCtrl.removeTag(eventId, tag);
    },
    changeEventOwner(id, newOwner) {
      dataCtrl.changeEventOwner(id, newOwner);
    },

    // Navigation functions
    getPrevPage() {
      return navCtrl.getPrevPage();
    },
    getCurrentPage() {
      return navCtrl.getCurrentPage();
    },
    changePage(page) {
      navCtrl.getContent(page);
    },

    // PageController functions
    initPage(page) {
      pageCtrl.initPage(page);
    },
    populateOwnEvents(events) {
      pageCtrl.populateOwnEvents(events);
    },
    populateSearchEvents(events, location) {
      pageCtrl.populateSearchEvents(events, location);
    },
    fillEventInfo(evtInfo) {
      pageCtrl.fillEventInfo(evtInfo);
    }
  };
})();

// Launches the application after the page has loaded.
$(window).load(() => {
  $('.loading').fadeOut(500, () => {
    MainController.init(MainController);
    $('.loaded').fadeIn(1000);
  });
});
