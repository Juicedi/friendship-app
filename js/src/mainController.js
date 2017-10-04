const preload = (arrayOfImages) => {
  $(arrayOfImages).each(function () {
    $('<img/>')[0].src = this;
  });
}
preload([]);

const MainController = (() => {
  let pageCtrl = '';
  let dataCtrl = '';
  let animCtrl = '';
  let ajaxCtrl = '';
  let navCtrl = '';

  function initControllers () {
    console.log('initializing controllers');
    pageCtrl = new pageController();
    dataCtrl = new dataController();
    animCtrl = new AnimationController();
    navCtrl = new Navigation();
  }

  function startApplication() {
    console.log('starting application');
    navCtrl.getContent('lander');
  }

  return {
    init() {
      initControllers();
      startApplication();
    }
  };
})();

const resizeFrame = () => {
  const DESIRED_RATIO = 52 / 100;
  const winHeight = $(window).height(); // New height
  const winWidth = $(window).width(); // New width
  let scale;

  if (DESIRED_RATIO * winWidth > winHeight) {
    scale = (winHeight / winWidth / DESIRED_RATIO) + 'vw';
  } else {
    scale = '';
  }
  document.getElementsByTagName('html')[0].style.fontSize = scale;
};

/*
resizeFrame();
$(window).resize(resizeFrame);
*/
$(window).load(() => {
  $('.loading').fadeOut(500, () => {
    console.log('init main');
    MainController.init();
    $('.loaded').fadeIn(1000);
  });
});
