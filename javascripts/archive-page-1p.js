function recentpostslist(json) {document.write('<ol>');
for (var i = 0; i < json.feed.entry.length; i++)
{for (var j = 0; j < json.feed.entry[i].link.length; j++) 
{if (json.feed.entry[i].link[j].rel == 'alternate') 
{break;}}
var entryUrl = "'" + json.feed.entry[i].link[j].href + "'";//bs
var entryTitle = json.feed.entry[i].title.$t;
var item = "<li>" + "<a href="+ entryUrl + '" target="_parent">' + entryTitle + "</a> </li>";
document.write(item);}
document.write('</ol>');}
