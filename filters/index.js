module.exports = function(swig) {

  var pageLink = function (page) {
    return '<a href="' + page.fullTitle + '">' + page.title + '</a>';
  };

  // var tagLink = function(tag) {
  // 	return '<a href="' + '/wiki/search/' + tag + '">' + tag + '</a>';
  // };

  pageLink.safe = true;

  swig.setFilter('pageLink', pageLink);

};