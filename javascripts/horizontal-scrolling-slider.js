function removeHtmlTag(strx,chop){
var s = strx.split("<");
for(var i=0;i<s.length;i++){
if(s[i].indexOf(">")!=-1){
s[i] = s[i].substring(s[i].indexOf(">")+1,s[i].length);}}
s =  s.join("");
s = s.substring(0,chop-1);return s;}
function showallposts(json) {
document.write('<table width="'+tablewidth+'" border=1 bordercolor="#FFFF00" cellspacing="'+cellspacing+'" bgcolor="'+borderColor+'" align="left">');
j = (showRandomImg) ? Math.floor((imgr.length+1)*Math.random()) : 0;
img  = new Array(); 
for (var i = startINDX; i < json.feed.openSearch$totalResults.$t; i++) {
var entry = json.feed.entry[i];
var posttitle = entry.title.$t;
var pcm;
var posturl;
if (i == numposts) break;
if (i == json.feed.entry.length) break;
for (var k = 0; k < entry.link.length; k++) {
if (entry.link[k].rel == 'alternate') {
posturl = entry.link[k].href;
break;}}
for (var k = 0; k < entry.link.length; k++) {
if (entry.link[k].rel == 'replies' && entry.link[k].type == 'text/html') {
pcm = entry.link[k].title.split(" ")[0];
break;}}
if ("content" in entry) {var postcontent = entry.content.$t;}
else if ("summary" in entry) {
var postcontent = entry.summary.$t;}
else var postcontent = "";
postdate = entry.published.$t;
if(j>imgr.length-1) j=0;
img[i] = imgr[j];
s = postcontent ; a = s.indexOf("<img"); b = s.indexOf("src=\"",a); c = s.indexOf("\"",b+5); d = s.substr(b+5,c-b-5);
if((a!=-1)&&(b!=-1)&&(c!=-1)&&(d!="")) img[i] = d;
cmtext = (text != 'no') ? '<i><font color="'+acolor+'">('+pcm+' '+text+')</font></i>' : '';
var month = [1,2,3,4,5,6,7,8,9,10,11,12];
var month2 = ["Ιαν","Φεβ","Μαρ","Απρ","Μαι","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"];
var day = postdate.split("-")[2].substring(0,2);
var m = postdate.split("-")[1];
var y = postdate.split("-")[0];
for(var u2=0;u2<month.length;u2++){
if(parseInt(m)==month[u2]) {
m = month2[u2] ; break;}}
var daystr = (showPostDate) ? '<i><font color="'+acolor+'">('+day+ ' ' + m + ' ' + y + ')</font></i>' : "";
posttitle = (aBold) ? "<b>"+posttitle+"</b>" : posttitle;
var td = '<td valign="top" width="'+imgwidth+'" height="'+imgheight+'" style="background:'+bgTD+'"><a href="'+posturl+'"><img src="'+img[i]+'" width="'+imgwidth+'" height="'+imgheight+'"/></a><br /><a href="'+posturl+'" style="color:'+acolor+'; font-size:'+fntsize+'px;">'+posttitle+'</a><br /> ' + daystr + '<div style="color:'+summaryColor+'; margin-top:2px; border-top:1px '+borderColor+' solid; font-size:'+summaryFontsize+'px;">'+icon2+removeHtmlTag(postcontent,summaryPost)+'...</div></td>'; 
if(summaryPost == 0) { td = '<td align="left" valign="top" width="'+imgwidth+'" height="'+imgheight+'" style="background:'+bgTD+'"><a href="'+posturl+'"><img src="'+img[i]+'" width="'+imgwidth+'" height="'+imgheight+'"/></a><br />'+icon+'<a href="'+posturl+'" style="color:'+acolor+'; font-size:'+fntsize+'px;">'+posttitle+'</a><br/>' + daystr + '</td>'; }
document.write(td);
j++;}
document.write('</tr></table>');}