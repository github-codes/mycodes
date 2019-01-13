(function($){
var defaults = {
slideshowmarkup: '<div><div class="side1"></div><div class="side2"></div></div></div>',
pause: 0, fxduration: 1000, desc: [], swipethreshold: [50, 300], linktarget: '_new'}
var transform3d = typeof $(document.documentElement).css('perspective') != "undefined"
function setslidehtml(el, html, options){
var slidehtml = ''
if (el[1])
slidehtml += '<a href="' + el[1] + '" target="' + options.linktarget + '">'
slidehtml += '<img src="' + el[0] + '"/>'
if (el[1])
slidehtml +='</a>'
slidehtml += html? '<br/>' + html : ''
return slidehtml}
function constructTransform(deg, x, y, z){return 'rotateY(' + deg + 'deg) translate3D(' + x + 'px,' + y + 'px,' + z + 'px)'}
window.jkcubeslideshow = function(settings){
var thisinst = this
var s = $.extend({}, defaults, settings)
var transitionendCount = 0
var transitioninProgress = false
var preloadimages = []
var curimage = 0
var pausetimer = null
var totalimages = s.images.length
var $maincontainer = $('#' + s.id)
if (s.dimensions && s.dimensions[0])
$maincontainer.css({width: s.dimensions[0], height: s.dimensions[1]})
var containerwidth = $maincontainer.width()
$maincontainer.html(s.slideshowmarkup) 
var mousemoveevtstr = 'mousemove.dragstart' + s.id + ' touchmove.dragstart' + s.id
var mouseupevtstr= 'mouseup.dragend' + s.id + ' touchend.dragend' + s.id
var dragdist
var $innercontainer = $maincontainer.find('> div').css({transformStyle: 'preserve-3d'})
var $sides = $innercontainer.find('> div')
var animatetimer = null
var autorotatetimer = null
var autorotatepause = (transform3d)? s.pause + s.fxduration : s.pause
var panelClasses ={frontpanel: 'rotateY(0deg) translate3D(0, 0, 0)',
leftpanel: constructTransform(-90, -containerwidth/2, 0, containerwidth/2),
rightpanel: constructTransform(90, containerwidth/2, 0, containerwidth/2),
front_to_right: constructTransform(90, containerwidth/2, 0, containerwidth/2),
front_to_left: constructTransform(-90, -containerwidth/2, 0, containerwidth/2),
to_front: 'rotateY(0deg) translate3D(0, 0, 0)'}
$maincontainer.data('info', {frontside: 0, otherside: 1, width: containerwidth, $sides: $sides})
$sides
.eq(0)
.html( setslidehtml(s.images[0], s.desc[0], s) )
.css({transform: panelClasses.frontpanel})
.end().eq(1).css({visibility: 'hidden'}) 
this.rotatecube = function(dir, autocall){ 
if (transform3d && transitioninProgress)
return
transitioninProgress = true
if (typeof autocall == 'undefined')
clearInterval(autorotatetimer)
var dir = (dir == 'back')? 'right' : (dir == 'forward')? 'left' : dir 
var nextimage = (dir == 'left')? (curimage < totalimages-1? curimage+1 : 0) : (curimage == 0? totalimages-1 : curimage-1)
if (transform3d){
var cubeinfo = $maincontainer.data('info')
var curfront = cubeinfo.frontside
var curotherside = cubeinfo.otherside		
cubeinfo.$sides
.css({transitionDuration: '0s'})
.eq(cubeinfo.otherside)
.html( setslidehtml(s.images[nextimage], s.desc[nextimage], s) )
.css({visibility: 'visible', transform: dir=='right'? panelClasses.leftpanel : panelClasses.rightpanel})
curimage = nextimage
clearTimeout(animatetimer)
animatetimer = setTimeout(function(){ 
cubeinfo.$sides
.css({transitionDuration: s.fxduration + 'ms'})		
.eq(curfront)
.css({transform: dir=='right'? panelClasses.front_to_right : panelClasses.front_to_left})
.end().eq(curotherside)
.css({transform: panelClasses.to_front})}, 50)}
else{ 
$sides.eq(0)
.html( setslidehtml(s.images[nextimage], s.desc[nextimage], s) )
curimage = nextimage}}
for (var i=0; i<s.images.length; i++){ 
preloadimages[i] = new Image()
preloadimages[i].src = s.images[i][0]}
if (s.pause > 0){
autorotatetimer = setInterval(function(){
thisinst.rotatecube('forward', true)}, autorotatepause)
$maincontainer.on('mouseenter', function(){clearInterval(autorotatetimer)})
$maincontainer.on('mouseleave', function(){clearInterval(autorotatetimer)
autorotatetimer = setInterval(function(){thisinst.rotatecube('forward', true)}, autorotatepause)})}
$maincontainer.on('mousedown touchstart', function(e){
var e = (e.type.indexOf('touch') != -1)? e.originalEvent.changedTouches[0] : e
var mousex = e.pageX
var clicktime = new Date().getTime()
dragdist = 0
$(document).on(mousemoveevtstr, function(e){
var e = (e.type.indexOf('touch') != '-1')? e.originalEvent.changedTouches[0] : e
dragdist=e.pageX-mousex 
return false})
$(document).on(mouseupevtstr, function(e){
var e = (e.type.indexOf('touch') != -1)? e.originalEvent.changedTouches[0] : e
$(document).unbind(mousemoveevtstr)
$(document).unbind(mouseupevtstr)
var dragtime = new Date().getTime() - clicktime
if ( Math.abs(dragdist) > s.swipethreshold[0] && dragtime < s.swipethreshold[1] ){
var dir = (dragdist < 0)? 'forward' : 'back'
thisinst.rotatecube(dir)}
if (e.type == "mouseup")
return false})
if (e.type == "mousedown")
return false})
$maincontainer.on('click', function(e){
if (Math.abs(dragdist) > 0 && e.target.tagName == 'IMG')
return false})
if (transform3d){
$sides.on('transitionend webkitTransitionEnd', function(e){
var $target = $(e.target) 
if (/transform/i.test(e.originalEvent.propertyName)){
transitionendCount++
if (transitionendCount == 2){
var cubeinfo = $maincontainer.data('info')
cubeinfo.otherside = cubeinfo.frontside 
cubeinfo.frontside = (cubeinfo.otherside == 0)? 1 : 0
$sides
.css({transitionDuration: '0s', transform: 'none'})
.eq(cubeinfo.frontside)
.css({transform: panelClasses.frontpanel})
.end().eq(cubeinfo.otherside)
.css({visibility: 'hidden'})
transitionendCount = 0
transitioninProgress = false}}})}}})(jQuery);
