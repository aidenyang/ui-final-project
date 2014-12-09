var api_key = {
  'api-key' : "a36fc320f223395ab47b349f4cea12de:19:70168743"
}

var artparam = {
  'api-key' : "97d6dfd88481d6ad2ebc597fcf15ca55:1:70168743"
}

var mostpop = {
  'api-key' : "52e2735f42dc271d2b625ef848a33eb9:10:70168743"
}

var movkey = {
  'api-key' : "b219c15f83d293f558335c509e894f44:2:70168743"
}
var apikey = 's8xqnbpqvzph3x7gdbsk3avr';
var apikey1 = 'xqv5zh6twkfu453sxykdnaz9';
var apikey2 = 'bwkbh8dkkem76nhprwjr9nkt';
var apikey3 = 'rye6ydzukefs6cmhrajh4n9z';
var apikeys = [apikey, apikey1, apikey2, apikey3];
var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";

var nytkeys = ["b5c06f77f4bd3bc6d762aaf3259089c9:11:67621633", "36178b8fb8bbc502488f54210adf8540:5:70174107", "b219c15f83d293f558335c509e894f44:2:70168743"];

var showtimekey = 'g9b8vhqrmn6en5mjc9ngqbhx';

var movies = [];

var moviesAdded = [];

var limit = 20;
var mObj = [];

var queueOffset = 100;

$('#zip').click(function() {
  $('#zip').val('');
})

$('#date').click(function() {
  $('#date').val('');
})

var main = function() {

  var div = '#movies';
    $(div).append('<img src="loading.gif" id="loading-indicator" />');
    getRTReviews(apikeys[0], 1);
  if(typeof(Storage) !== "undefined")
    {
      if (localStorage.getItem("queue") !== null) {
        var queue = JSON.parse(localStorage.getItem("queue"));
        var i;
        for(i=0; i<queue.length; i++) {
          addToQueue(null, queue[i]);
        }
    }
    }
    else 
    {
      console.log("Browser does not support storage");
    }

//Why is the list of most popular different every time?
	$("#mostpop").click(function() {
		$("#movies").empty();
    mObj.length = 0;
    var div = '#movies';
    $(div).append('<img src="loading.gif" id="loading-indicator" />');
    getRTReviews(apikeys[0]);
		// getLatestMovies(0);	
	});

  $("#queue").on('mouseenter', '.qitem', function(event) {
      var movie = $(this);
      var button = movie.children()[0];
      $(button).show();
  });

  $("#queue").on('mouseleave', '.qitem', function(event) {
      var movie = $(this);
      var button = movie.children()[0]
      $(button).hide();
  });

  $("#queue").on('click', '.rem', function(event) {
    var movie = $(this).parent();
    var movietext = $(this).next().next();
    var movieName = movie[0].innerText;
    removeFromQueue(movieName.substr(1, movieName.length-2), movie);
  });
}

var removeFromQueue = function(movieName, movie) {
  movie.remove();
  
  $.each(moviesAdded, function(i, mov) {
    if(mov.movieName.toLowerCase()==movieName.toLowerCase()) {
      moviesAdded.splice(i, 1);
      localStorage.setItem("queue", JSON.stringify(moviesAdded));
    }

  });
}

var addToQueue = function(index, mObject) {


	if(moviesAdded.length+1 > 11) {
		alert("Maximum number of movies allowed in queue is 11!");
	}

	var fromStorage = 0;
	var prevSaved = 0;

	if(index==null && mObject!=null) {
		fromStorage = 1;
	}
	else {
		$.each(moviesAdded, function(i, data) {
			if(data.movieName===mObj[index].movieName) {
				prevSaved = 1;
			}
		});
	}

	if(prevSaved==0 && moviesAdded.indexOf(mObj[index])==-1 && moviesAdded.length<11) {
		var movie;

		if(fromStorage) {
			movie = mObject;
		}
		else {
			movie = mObj[index];	
		}
		
		//save movie added
	   moviesAdded[moviesAdded.length]=movie;


		var title = movie.movieName;
		var imageUrl = movie.img;
    var i = moviesAdded.length;
    var j = i+queueOffset;

    var item="";
    item += "<div class=\"qitem\">";
    item += "<button type=\"button\" class=\"btn btn-danger btn-circle rem\" aria-label=\"Left Align\">";
    item += "<span class=\"glyphicon glyphicon-remove-sign\" aria-hidden=\"true\"><\/span>";
    item += "<\/button>";
    item += "<div data-toggle='modal' data-target=\"#myModal"+i+"\">";
		item += "<img class=\"qimage\" src=\""+imageUrl+"\" \/>";
		item += "<div class=\"qtext\">";
		item += title;
		item += "<\/div>";
    item += "<\/div>";
		item += "<\/div>";

		$("#queue").append(item);

		//parameter index i
		if(typeof(Storage) !== "undefined") {
			localStorage.setItem("queue", JSON.stringify(moviesAdded));
		}
		else {
			console.log("Browser does not support storage");
		}
	}

    var contents =
    // '<div class="panel panel-default">'+
    //       '<div class="panel-body">'+
            '<div class="row">'+
              '<div class="col-sm-2">'+
                '<img src='+movie.img+' alt="Movie Poster" height="115" width="90">'+
              '</div>'+
              '<div class="col-sm-10">'+
                '<p><span style="font-size: 16px; font-weight: bold;">'+ movie.movieName +' </span><span style="color: #707070; font-size: 12px">'+movie.releaseDate+'</span>'+
                '<br><b>MPA Rating: </b>'+movie.mpaRating+'<b> Runtime: </b>'+movie.runtime+ " min"+
                '<br><b>Synopsis: </b>'+movie.synopsis+
                '</p>'+
                '<a href="'+movie.trailer+'" target="_blank">'+'Trailers'+'</a>'+
              '</div>'+
            '</div>'+
            '<div class="panel panel-default">'+
             '<div class="panel-heading" role="tab" id="heading'+j+'">'+
               '<h6 class="panel-title">'+
                 '<a class="collapsed" data-toggle="collapse" data-parent="#accordion'+j+'" href="#collapse'+j+'" aria-expanded="false" aria-controls="collapse'+j+'" onclick="getReviewsQueue('+j+');">'+
                   'Reviews: '+
                 '</a>'+
               '</h4>'+
             '</div>'+
             '<div id="collapse'+j+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading'+j+'">'+
               '<div class="panel-body" id="reviews'+j+'">'+
               //contents2+
                '</div>'+
              '</div>'+
            '</div>';
        //   '</div>'+
        // '</div>';

    var modalString = 
    '<div class="modal fade" id="myModal'+i+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
      '<div class="modal-dialog">'+
        '<div class="modal-content">'+
          '<div class="modal-header">'+
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
            '<h4 class="modal-title" id="myModalLabel">'+movie.movieName+'</h4>'+
          '</div>'+
          '<div class="modal-body">'+
          contents+
          '</div>'+
          '<div class="modal-footer">'+
            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>';

    $(".queueModals").append(modalString);
}

function getReviewsQueue(i) {
  console.log(i);
  var div = '#reviews'+i;
  if(!($(div).is(':empty'))) {
    return;
  }
  i = i - queueOffset;
  console.log(moviesAdded);
  console.log(moviesAdded[i]);
  var movie_id = moviesAdded[i]['id'];
  // console.log(movie_id);
  var param_apikey = apikeys[1];
  url = 'http://api.rottentomatoes.com/api/public/v1.0/movies/' 
    + movie_id +  '/reviews.json?apikey=' + param_apikey;
  $.ajax({
    'type' : "GET", 
    'url': url,
    'cache': true,
    'dataType': 'jsonp',
    'success': function(data, textStats, XMLHttpRequest){
      var reviewsString = "";
      reviews = data['reviews'];
      // console.log("reviews");
      // console.log(reviews);
      if(reviews.length==0) {
        reviewsString = "No reviews found.";
      }
      for (var j = 0; j < 3 && j<reviews.length; j++)
      { 
        var quote = "No quote available.";
        if(reviews[j]['quote']) {
          quote = '"'+ reviews[j]['quote']+'"';
        }
        var link = "No link available.";
        if (reviews[j]['links']['review']) {
          link = '<a href="'+reviews[j]['links']['review'] + '" target="_blank">Link</a>';
        }
        if ((reviews[j]['quote'] || reviews[j]['links']['review'])) {
          reviewsString = reviewsString + quote + " " + link + '<br>';
        }
      }
      var contents= 
                '<div class="Reviews">'+
                  '<div class="title_box" id="rotTom">'+
                      '<div id="title"><b>Rotten Tomatoes</b></div>'+
                      '<div id="content">'+
                          '<p><b>Critics Score: </b>'+moviesAdded[i]['criticsScore']+'<b> Audience Score: </b>'+moviesAdded[i]['audienceScore']+
                          '<br><b>Selected Critics Reviews: </b><br>'+reviewsString+'</p>'+
                      '</div>'+
                  '</div>'+
                  '<p><br></p>'+
                  '<div class="title_box" id="NYTTom">'+
                      '<div id="title"><b>New York Times Review</b></div>'+
                      '<div id="content">'+
                          '<p><b>Thousands Best: </b>'+moviesAdded[i]['thousandsbest']+
                          '<br><b>Review: </b>'+'<a href="'+moviesAdded[i]['nytLink']+'">'+moviesAdded[i]['nytTitle']+'</a>'+
                          '<br>"'+moviesAdded[i]['nytreview']+'"'+
                          '</p>'+
                      '</div>'+
                  '</div>'+
                '</div>'
        $(div).append(contents);
    }
  });
}

function parseMovie(i)
{
  var JSON_movie = movies[i];
  var thousand_best = 'N';
  if (JSON_movie['thousand_best'] && JSON_movie['thousand_best'] == 1)
  {
    thousand_best = 'Y';
  }
  var title = JSON_movie['headline'];
  var review_url = JSON_movie['link']['url'];
  var summary = 'Summary Not Found';
  if(JSON_movie['summary_short'])
  {
    summary = JSON_movie['summary_short'];
  }
  else if(JSON_movie['capsule_review'])
  {
    summary = JSON_movie['capsule_review'];
  }
  var related_urls = JSON_movie['related_urls'];
  var trailer1 = "";
  for (var i = 0; i < related_urls.length; i++)
  {
    if (related_urls[i] && related_urls[i]['type'] == 'trailers')
    {
      trailer1 = related_urls[i]['url'];
    }
  }
  mObj.push({movieName: "", mpaRating: "", runtime: "", criticCons: "", trailer: trailer1,
        synopsis: "", criticsScore: "", audienceScore: "", releaseDate: "", img: "", thousandsbest: thousand_best, nytreview: summary, nytTitle: title, nytLink: review_url, id:0});
}

function getMovies() {
  var i;
  for(i=0; i<movies.length; i++)
  {
    console.log("attention");
    console.log(i);
    console.log(movies[i]);
    var keyword = movies[i]['display_title'];
    parseMovie(i); 
    var passkey = apikeys[i % 4];
    getRT(keyword, passkey, i);
  }

}


// function getRTReviews(movie_id, param_apikey){
//   url = 'http://api.rottentomatoes.com/api/public/v1.0/movies/' 
//     + movie_id +  '/reviews.json?apikey=' + param_apikey;
//   $.ajax({
//     'type' : "GET", 
//     'url': url,
//     'cache': true,
//     'dataType': 'jsonp',
//     'success': function(data, textStats, XMLHttpRequest){
//       reviews = data['reviews']
//       for (var i = 0; i < 3; i++)
//       {
//         var quote = reviews[i]['quote'];
//         var link = reviews[i]['links']['review'];
//         console.log(quote);
//         console.log(link);
//       }
//     }
//   });
// }

function handle(e)
{
 var key=e.keyCode || e.which;
  if (key==13){
     searchMovies();
  }
}


$( ".qitem" ).mouseover(function() {
  $( this ).css({'cursor': 'pointer'});
});


function searchMovies() {
  mObj.length=0;
  var keyword = $('#search').val();
  console.log('keyword');
  // console.log(keyword);
  var url = 'http://api.nytimes.com/svc/movies/v2/reviews/search.jsonp?query='+keyword+'&api-key=b5c06f77f4bd3bc6d762aaf3259089c9:11:67621633';
    $.ajax({
      'url' : url,
      'dataType' : 'jsonp',
      'jsonpCallback' : 'cb',
      'cache': true,
      'success' : function(data, textStats, XMLHttpRequest) {
        movies.length = 0;
        console.log("hello");
        $.merge(movies, data.results);
                console.log(movies);
        div = '#movies';
        $(div).empty();
        $(div).append('<img src="loading.gif" id="loading-indicator" />');
        var i;
        for(i=0; i<movies.length; i++)
        {
          var keyword = movies[i]['display_title'];
          parseMovie(i); 
          var passkey = apikeys[i % 4];
          getRT(keyword, passkey, i);
        }
        $('#loading-indicator').remove();
    }
    });
}



function getRT(movie_name, apikey, j){

  var moviesSearchUrl = baseUrl + '/movies.json?apikey=' + apikey;
  $.ajax({
    'type' : "GET", 
    'url': moviesSearchUrl + '&q=' + encodeURI(movie_name),
    'cache': true,
    'dataType': 'jsonp',
    'success': function(data, textStats, XMLHttpRequest)
    {
      var movies = data['movies'];
      var my_movie = null;
      for (var i = 0; i < movies.length; i++)
      {
        if (movies[i]['title'].toLowerCase() == movie_name.toLowerCase())
        {
          my_movie = movies[i];
          break;
        }
      }
      if (!my_movie)
      {
        my_movie = movies[0];
      }
      if(!my_movie) {
        return;
      }
      var movie_id = my_movie['id'];
      var c_score = my_movie['ratings']['critics_score']; 
      var a_score = my_movie['ratings']['audience_score']; 
      var year = my_movie['year']; 
      var rating1 = my_movie['mpaa_rating']; 
      var runtime1 = my_movie['runtime'];
      var review_summary = "Not Found. ";
      if(my_movie['critics_consensus']) {
        review_summary = my_movie['critics_consensus'];
      }
      var synopsis1 = "Not Found.";
      if(my_movie['synopsis']) {
        var synopsis1 = my_movie['synopsis'];
      }
      var images = my_movie['posters'];
      var image = null; 
      if (images['thumbnail'])
      {
        image = images['thumbnail'];
      }
      else if (images['profile'])
      {
        image = images['profile'];
      }
      else if (images['detailed'])
      {
        image = images['detailed'];
      }
      else if (images['original'])
      {
        image = images['original'];
      }
      var contents = 
      '<div class="movie">'+
        '<div class="panel panel-default">'+
          '<div class="panel-body">'+
            '<div class="row">'+
              '<div class="col-md-2">'+
                '<img src='+image+' alt="Movie Poster" height="125" width="100">'+
              '</div>'+
              '<div class="col-md-10">'+
                '<p><span style="font-size: 16px; font-weight: bold;">'+ movie_name +' </span><span style="color: #707070; font-size: 12px">'+year+'</span>'+
                '<br><b>MPA Rating: </b>'+rating1+'<b> Runtime: </b>'+runtime1+ " min"+
                '<br><b>Synopsis: </b>'+synopsis1+
                '</p>'+
                '<a href="'+mObj[j]['trailer']+'" target="_blank">'+'Trailers'+'</a>'+
              '</div>'+
            '</div>'+
            '<div class="panel panel-default">'+
             '<div class="panel-heading" role="tab" id="heading'+j+'">'+
               '<h6 class="panel-title">'+
                 '<a class="collapsed" data-toggle="collapse" data-parent="#accordion'+j+'" href="#collapse'+j+'" aria-expanded="false" aria-controls="collapse'+j+'" onclick="getReviews('+j+');">'+
                   'Reviews: '+
                 '</a>'+
               '</h4>'+
             '</div>'+
             '<div id="collapse'+j+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading'+j+'">'+
               '<div class="panel-body" id="reviews'+j+'">'+
               //contents2+
                '</div>'+
              '</div>'+
            '</div>'+
            '<button type="button" class="btn btn-info" id="clearB" onclick="addToQueue('+j+');">Add</button>'
          '</div>'+
        '</div>'+
      '</div>';

      $("#movies").append(contents);

      mObj[j]['movieName'] = movie_name;
      mObj[j]['mpaRating'] = rating1;
      mObj[j]['runtime'] = runtime1;
      mObj[j]['criticCons'] = review_summary;
      mObj[j]['synopsis'] = synopsis1;
      mObj[j]['criticsScore'] = c_score;
      mObj[j]['audienceScore'] = a_score;
      mObj[j]['releaseDate'] = year;
      mObj[j]['img'] = image;
      mObj[j]['id'] = movie_id;    
    },
    'error': function (request, status, error) {

            console.log('shit went down. RT Outer');
        }
  });
}

function getReviews(i) {
  var div = '#reviews'+i;
  if(!($(div).is(':empty'))) {
    return;
  }
  var movie_id = mObj[i]['id'];
  var param_apikey = apikeys[1];
  url = 'http://api.rottentomatoes.com/api/public/v1.0/movies/' 
    + movie_id +  '/reviews.json?apikey=' + param_apikey;
  $.ajax({
    'type' : "GET", 
    'url': url,
    'cache': true,
    'dataType': 'jsonp',
    'success': function(data, textStats, XMLHttpRequest){
      var reviewsString = "";
      reviews = data['reviews'];
      console.log("reviews");
      console.log(reviews);
      if(reviews.length==0) {
        reviewsString = "No reviews found.";
      }
      for (var j = 0; j < 3 && j<reviews.length; j++)
      { 
        var quote = "No quote available.";
        if(reviews[j]['quote']) {
          quote = '"'+ reviews[j]['quote']+'"';
        }
        var link = "No link available.";
        if (reviews[j]['links']['review']) {
          link = '<a href="'+reviews[j]['links']['review'] + '" target="_blank">Link</a>';
        }
        if ((reviews[j]['quote'] || reviews[j]['links']['review'])) {
          reviewsString = reviewsString + quote + " " + link + '<br>';
        }
      }
      var contents= 
                '<div class="Reviews">'+
                  '<div class="title_box" id="rotTom">'+
                      '<div id="title"><b>Rotten Tomatoes</b></div>'+
                      '<div id="content">'+
                          '<p><b>Critics Score: </b>'+mObj[i]['criticsScore']+'<b> Audience Score: </b>'+mObj[i]['audienceScore']+
                          '<br><b>Selected Critics Reviews: </b><br>'+reviewsString+'</p>'+
                      '</div>'+
                  '</div>'+
                  '<p><br></p>'+
                  '<div class="title_box" id="NYTTom">'+
                      '<div id="title"><b>New York Times Review</b></div>'+
                      '<div id="content">'+
                          '<p><b>Thousands Best: </b>'+mObj[i]['thousandsbest']+
                          '<br><b>Review: </b>'+'<a href="'+mObj[i]['nytLink']+'">'+mObj[i]['nytTitle']+'</a>'+
                          '<br>"'+mObj[i]['nytreview']+'"'+
                          '</p>'+
                      '</div>'+
                  '</div>'+
                '</div>'
        $(div).append(contents);
    }
  });
}

function getNYTReviews(j, apikey)
{
  var keyword = mObj[j]['movieName'];
  var url = 'http://api.nytimes.com/svc/movies/v2/reviews/search.jsonp?query='+keyword+'&api-key=' + apikey;
    $.ajax({
      'url' : url,
      'dataType' : 'jsonp',
      'cache': true,
      'success' : function(data, textStats, XMLHttpRequest) {
        var my_movies = data['results'];
        for (var i = 0; i < my_movies.length; i++)
        {
          if (my_movies[i]['display_title'].toLowerCase() === keyword.toLowerCase())
          {
            parseMovieNYT(j, my_movies[i]);
            return;
          }
        }
      }
    });
}

function parseMovieNYT(i, JSON_movie)
{
  var thousand_best = 'N';
  if (JSON_movie['thousand_best'] && JSON_movie['thousand_best'] == 1)
  {
    thousand_best = 'Y';
  }
  var title = JSON_movie['headline'];
  var review_url = JSON_movie['link']['url'];
  var summary = 'Summary Not Found';
  if(JSON_movie['summary_short'])
  {
    summary = JSON_movie['summary_short'];
  }
  else if(JSON_movie['capsule_review'])
  {
    summary = JSON_movie['capsule_review'];
  }
  var related_urls = JSON_movie['related_urls'];
  var trailer1 = "";
  for (var j = 0; j < related_urls.length; j++)
  {
    if (related_urls[j] && related_urls[j]['type'] == 'trailers')
    {
      trailer1 = related_urls[j]['url'];
    }
  }
  mObj[i]['thousandsbest'] = thousand_best;
  mObj[i]['trailer'] = trailer1;
  mObj[i]['nytreview'] = summary;
  mObj[i]['nytTitle'] = title;
  mObj[i]['nytLink'] = review_url;
  var contents = 
    '<div class="movie">'+
      '<div class="panel panel-default">'+
        '<div class="panel-body">'+
          '<div class="row">'+
            '<div class="col-md-2">'+
              '<img src="'+mObj[i]['img']+'" alt="Movie Poster" height="125" width="100">'+
            '</div>'+
            '<div class="col-md-10">'+
              '<p><span style="font-size: 16px; font-weight: bold;">'+ mObj[i]['movieName'] +' </span><span style="color: #707070; font-size: 12px">'+mObj[i]['releaseDate']+'</span>'+
              '<br><b>MPA Rating: </b>'+mObj[i]['mpaRating']+'<b> Runtime: </b>'+mObj[i]['runtime']+ " min"+
              '<br><b>Synopsis: </b>'+mObj[i]['synopsis']+
              '</p>'+
              '<a href="'+mObj[i]['trailer']+'" target="_blank">'+'Trailers'+'</a>'+
            '</div>'+
          '</div>'+
          '<div class="panel panel-default">'+
           '<div class="panel-heading" role="tab" id="heading'+i+'">'+
             '<h6 class="panel-title">'+
               '<a class="collapsed" data-toggle="collapse" data-parent="#accordion'+i+'" href="#collapse'+i+'" aria-expanded="false" aria-controls="collapse'+i+'" onclick="getReviews('+i+');">'+
                 'Reviews: '+
               '</a>'+
             '</h4>'+
           '</div>'+
           '<div id="collapse'+i+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading'+i+'">'+
             '<div class="panel-body" id="reviews'+i+'">'+
             //contents2+
              '</div>'+
            '</div>'+
          '</div>'+
          '<button type="button" class="btn btn-info" id="clearB" onclick="addToQueue('+i+');">Add</button>'
        '</div>'+
      '</div>'+
    '</div>';
    if ($('#loadMore').length > 0)
    {
        $(contents).insertBefore('#loadMore');
    }
    else 
    {
       $("#movies").append(contents);
    }
}

function parseMoviesRT(my_movie){
  console.log(my_movie);
  var movie_title = my_movie['title'];
  console.log(movie_title);
  var movie_id = my_movie['id'];
  var c_score = my_movie['ratings']['critics_score']; 
  var a_score = my_movie['ratings']['audience_score']; 
  var year = my_movie['year']; 
  var rating1 = my_movie['mpaa_rating']; 
  var runtime1 = my_movie['runtime'];
  var review_summary = "Not Found. ";
  if(my_movie['critics_consensus']) {
    review_summary = my_movie['critics_consensus'];
  }
  var synopsis1 = "Not Found.";
  if(my_movie['synopsis']) {
    var synopsis1 = my_movie['synopsis'];
  }
  var images = my_movie['posters'];
  var image = null; 
  if (images['thumbnail'])
  {
    image = images['thumbnail'];
  }
  else if (images['profile'])
  {
    image = images['profile'];
  }
  else if (images['detailed'])
  {
    image = images['detailed'];
  }
  else if (images['original'])
  {
    image = images['original'];
  }
    mObj.push({movieName: movie_title, mpaRating: rating1, runtime: runtime1, criticCons: review_summary, 
      trailer: "", synopsis: synopsis1, criticsScore: c_score, audienceScore: a_score, 
      releaseDate: year, img: image, thousandsbest: "", nytreview: "", nytTitle: "", 
      nytLink: "", id: movie_id});
}

function getRTReviews(param_apikey, page){
  page_limit = 16;
  console.log('page' + page);
  url = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey='+ param_apikey + '&page=' + page;
  if ($('#loadMore').length > 0)
  { 
    $('#loadMore').remove();
  }
  if ($('#loading-indicator').length == 0)
  {
    $('#movies').append('<img src="loading.gif" id="loading-indicator" />');
  }
  $.ajax({
    'type' : "GET", 
    'url': url,
    'cache': true,
    'dataType': 'jsonp',
    'success': function(data, textStats, XMLHttpRequest){
    console.log(data);
    list_movies = data['movies'];
    console.log(list_movies);
    for(var i = 0; i < list_movies.length; i++)
    {
      parseMoviesRT(list_movies[i]);
      index = ((page - 1) * page_limit) + i;
      getNYTReviews(index, nytkeys[index%3]);
    }
    //Rona 
    if (list_movies.length == page_limit)
    {
      page = page + 1;
      param_apikey = "'" + param_apikey + "'";
      var loading = '<div class="movie" id="loadMore">'+ 
        '<button type="submit" class="btn btn-info" onclick="getRTReviews(' + param_apikey + ',' + page + ');">Load More Movies</button>' 
        +'</div>';
      console.log(loading);
      $("#movies").append(loading); 
    }
    $('#loading-indicator').remove();
    }
  });
}

// aiden's stuff
function searchShowtimes() {
  var date = $('#date').val();
  var zip = $('#zip').val();

  var request = $.ajax({
    url: 'http://data.tmsapi.com/v1/movies/showings?startDate=' + date + '&zip=' + zip + '&radius=10&api_key=' + showtimekey,
    type: 'GET',
    cache: true,
    dataType: 'json',
    beforeSend: function() { $('.showtimes').append('<center><img src="loading.gif" id="st-loading" /></center>'); },
    complete: function() { $('#st-loading').remove(); },
    success: function(data) {

      addShowtimes(data);
    },
    error: function(request, status, error) {
      var err = JSON.parse(request.responseText);
      if (err.errorCode == 1015) {
        stError("That is not a valid zip code. Please enter a valid zip code and try again.");
      }
      if (err.errorCode == 1022) {
        stError("You may only search for future dates. Please enter a valid date and try again.");
      }
    }
  });

}

function stError(errormsg) {
  $('.showtimes').empty();
  var html = '<h4>' + errormsg + '</h4>';
  $('.showtimes').append(html);
}

function addShowtimes(movies) {
  $('.showtimes').empty();
  
  for (var i = 0; i < movies.length; i++) {
    for (var j = 0; j < movies[i].showtimes.length; j++) {
      // check for theater
      var theater = movies[i].showtimes[j].theatre.name;
      var theaterid = theater.replace(/[\.,-\/#!'?$%\^&\*;:{}=\-_`~()]/g,"").replace(/ /g,'');
      if ($('#' + theaterid).length == 0) {
        // add theater if isn't there
        var theaterhtml = '<div class="theater" id="' + theaterid + '">' +
        '<b>' + theater + '</b>' + '</div>';
        $('.showtimes').append(theaterhtml);
      }
      
      var movie = movies[i].title;
      var movieid = movie.replace(/[\.,-\/#!$'?%\^&\*;:{}=\-_`~()]/g,"").replace(/ /g,'');
      if ($('#' + theaterid + ' #' + movieid).length == 0) {
        var moviehtml = '<div class="smovie" id="' + movieid + '">' +
        '<i>' + movie + '</i>' + '</div>';
        $('#' + theaterid).append(moviehtml);
      }

      var datetime = movies[i].showtimes[j].dateTime;
      var ticketuri = movies[i].showtimes[j].ticketURI;
      var timearr = datetime.split("T");
      var time = timearr[1];
      var hmarr = time.split(":");
      var hours = hmarr[0];
      var minutes = hmarr[1];

      var time = formatTime(hours, minutes);
      if (ticketuri === undefined) {
        var showtimehtml = '<div class="showtime">' +
        time + '</div>';
      }

      else {
        var showtimehtml = '<div class="showtime">' + '<a target="_blank" href="' + ticketuri + '">' +
        time + '</a></div>';
      }
      
      $('#' + theaterid + ' #' + movieid).append(showtimehtml);
    }
  }
}

function formatToday() {
  var today = new Date();
  var date = today.getDate();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();

  if (date < 10) {
    date = "0" + date;
  }

  if (month < 10) {
    month = "0" + month;
  }

  today = year + "-" + month + "-" + date;
  return today;
}

function formatTime(hours, minutes) {
  var ampm = "";
  var hours = hours;
  var minutes = minutes;
  if (hours > 12) {
    ampm = "PM";
    hours = hours%12;
  }
  else {
    ampm = "AM";
  }

  var time = hours + ":" + minutes + " " + ampm;
  return time;
}

$(document).ready(function() {
  var today = formatToday();
  $('#date').val(today);

  $(document).on('click', '.theater b', function() {
    var id = $(this).closest("div").attr("id");
    console.log($('#' + id + ' ' + '.smovie'));
    $('#' + id + ' ' + '.smovie').toggle();
  });
});

// aiden's stuff ends

$(document).ready(main);