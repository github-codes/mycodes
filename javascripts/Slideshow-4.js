var makeBSS = function(el, options) {
  var $slideshows = document.querySelectorAll(el), 
    $slideshow = {},
    Slideshow = {
      init: function(el, options) {
        this.counter = 0; 
        this.el = el;     
        this.$items = el.querySelectorAll('figure'); 
        this.numItems = this.$items.length; 
        options = options || {};  
        options.auto = options.auto || false; 
        this.opts = {
          auto: (typeof options.auto === "undefined") ? false : options.auto,
          speed: (typeof options.auto.speed === "undefined") ? 1500 : options.auto.speed,
          pauseOnHover: (typeof options.auto.pauseOnHover === "undefined") ? false : options.auto.pauseOnHover,
          fullScreen: (typeof options.fullScreen === "undefined") ? false : options.fullScreen,
          swipe: (typeof options.swipe === "undefined") ? false : options.swipe};
        this.$items[0].classList.add('bss-show');  
        this.injectControls(el);
        this.addEventListeners(el);
        if (this.opts.auto) {
          this.autoCycle(this.el, this.opts.speed, this.opts.pauseOnHover);}
        if (this.opts.fullScreen) {
          this.addFullScreen(this.el);}
        if (this.opts.swipe) {this.addSwipe(this.el);}},
      showCurrent: function(i) {        
        if (i > 0) {
          this.counter = (this.counter + 1 === this.numItems) ? 0 : this.counter + 1;} else {
          this.counter = (this.counter - 1 < 0) ? this.numItems - 1 : this.counter - 1;}
         [].forEach.call(this.$items, function(el) {
          el.classList.remove('bss-show');});        
        this.$items[this.counter].classList.add('bss-show');      },
      injectControls: function(el) {
          var spanPrev = document.createElement("span"),
          spanNext = document.createElement("span"),
          docFrag = document.createDocumentFragment();
          spanPrev.classList.add('bss-prev');
        spanNext.classList.add('bss-next');
        spanPrev.innerHTML = '&laquo;';
        spanNext.innerHTML = '&raquo;';
        docFrag.appendChild(spanPrev);
        docFrag.appendChild(spanNext);
        el.appendChild(docFrag);},
      addEventListeners: function(el) {
        var that = this;
        el.querySelector('.bss-next').addEventListener('click', function() {
          that.showCurrent(1);}, false);
        el.querySelector('.bss-prev').addEventListener('click', function() {
          that.showCurrent(-1);}, false);
        el.onkeydown = function(e) {
          e = e || window.event;
          if (e.keyCode === 37) {
            that.showCurrent(-1); 
          } else if (e.keyCode === 39) {
            that.showCurrent(1);}};},
      autoCycle: function(el, speed, pauseOnHover) {
        var that = this,
          interval = window.setInterval(function() {
            that.showCurrent(1);}, speed);
        if (pauseOnHover) {
          el.addEventListener('mouseover', function() {
            interval = clearInterval(interval);
          }, false);
          el.addEventListener('mouseout', function() {
            interval = window.setInterval(function() {
              that.showCurrent(1);}, speed);}, false);}},
      addFullScreen: function(el) {
        var that = this,
          fsControl = document.createElement("span");
        fsControl.classList.add('bss-fullscreen');
        el.appendChild(fsControl);
        el.querySelector('.bss-fullscreen').addEventListener('click', function() {
          that.toggleFullScreen(el);}, false);},
      addSwipe: function(el) {
        var that = this,
          ht = new Hammer(el);
        ht.on('swiperight', function(e) {
          that.showCurrent(-1);});
        ht.on('swipeleft', function(e) {
          that.showCurrent(1);});},
      toggleFullScreen: function(el) {
          if (!document.fullscreenElement && 
          !document.mozFullScreenElement && 
          !document.msFullscreenElement) { 
          if (document.documentElement.requestFullscreen) {
            el.requestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
            el.msRequestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            el.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            el.webkitRequestFullscreen(el.ALLOW_KEYBOARD_INPUT);}
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();}}}}; 
    [].forEach.call($slideshows, function(el) {
    $slideshow = Object.create(Slideshow);
    $slideshow.init(el, options);});};
var opts = {auto: {speed: 3500, pauseOnHover: true},
fullScreen: false, swipe: true};
makeBSS(".bss-slides", opts);
