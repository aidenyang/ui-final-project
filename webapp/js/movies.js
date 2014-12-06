var apikey = 's8xqnbpqvzph3x7gdbsk3avr';
var apikey1 = 'xqv5zh6twkfu453sxykdnaz9';
var apikey2 = 'bwkbh8dkkem76nhprwjr9nkt';
var apikey3 = 'rye6ydzukefs6cmhrajh4n9z';
var apikeys = [apikey, apikey1, apikey2, apikey3];
var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";
var movkey = {
  'api-key' : "b219c15f83d293f558335c509e894f44:2:70168743"
}
var query = "Gone with the Wind";
var firstLoaded = false;
var limit = 20;
var mObj = [];
var movies = [];

$(document).ready(function() {
  //getRT(query)
  var div = '#movies';
  $(div).append('<img src="loading.gif" id="loading-indicator" />');
  getLatestMovies(0);
});

var getLatestMovies = function(offset) {
  var action = "http://api.nytimes.com/svc/movies/v2/reviews/search.jsonp?order=by-opening-date&offset="+offset;

  $.ajax({
    'url' : action,
    'data': movkey,
    'dataType': 'jsonp',
    'success': function(data, textStats, XMLHttpRequest) {
      movies.length = 0;
      $.merge(movies, data.results);
      getMovies();
      console.log(movies);
    }
            
  });

}

function parseMovie(i)
{
  console.log(i);
  console.log("movie");
  console.log(movies[i]);
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
  // console.log(thousand_best);
  // console.log(title);
  // console.log(review_url);
  // console.log(summary);
}

// function getMovieResults(keyword) {
//   var url = 'http://api.nytimes.com/svc/movies/v2/reviews/search.jsonp?query='+keyword+'&api-key=b5c06f77f4bd3bc6d762aaf3259089c9:11:67621633';
//     $.ajax({
//       'url' : url,
//       'dataType' : 'jsonp',
//       'jsonpCallback' : 'cb',
//       'cache': true,
//       'success' : function(data, textStats, XMLHttpRequest) {
//         console.log(data);
        
//         return list_movies;
//       }
//     });
// }

function getMovies() {
  var i;
  for(i=0; i<limit; i++)
  {
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

function searchMovies() {
  var keyword = $('#search').val();
  console.log('keyword');
  console.log(keyword);
  var url = 'http://api.nytimes.com/svc/movies/v2/reviews/search.jsonp?query='+keyword+'&api-key=b5c06f77f4bd3bc6d762aaf3259089c9:11:67621633';
    $.ajax({
      'url' : url,
      'dataType' : 'jsonp',
      'jsonpCallback' : 'cb',
      'cache': true,
      'success' : function(data, textStats, XMLHttpRequest) {
        movies.length = 0;
        $.merge(movies, data.results);
        getMovies();
        console.log(movies);
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
      //console.log(data);
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
        console.log('Movie not found');
        my_movie = movies[0];
      }
      console.log(my_movie);
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
      //var review_summary = my_movie['critics_consensus']; 
      if(my_movie['synopsis']) {
        var synopsis1 = my_movie['synopsis'];
      }
      // var synopsis1 = my_movie['synopsis']; 
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
        // var contents2= '<div class="Reviews">'+
        //           '<div class="title_box" id="rotTom">'+
        //               '<div id="title"><b>Rotten Tomatoes</b></div>'+
        //               '<div id="content">'+
        //                   '<p><b>Critics Score: </b>'+c_score+'<b> Audience Score: </b>'+a_score+
        //                   '<br><b>Critics Concensus: </b>'+review_summary+'</p>'+
        //               '</div>'+
        //           '</div>'+
        //           '<p><br></p>'+
        //           '<div class="title_box" id="NYTTom">'+
        //               '<div id="title"><b>New York Times Review</b></div>'+
        //               '<div id="content">'+
        //                   '<p><b>Thousands Best: </b>'+mObj[j]['thousandsbest']+
        //                   '<br><b>Review: </b>'+'<a href="'+mObj[j]['nytLink']+'">'+mObj[j]['nytTitle']+'</a>'+
        //                   '<br>"'+mObj[j]['nytreview']+'"'+
        //                   '</p>'+
        //               '</div>'+
        //           '</div>'+
        //         '</div>';
      var contents = 
      '<div class="movie">'+
        '<div class="panel panel-default">'+
          '<div class="panel-body">'+
            '<div class="row">'+
              '<div class="col-md-1">'+
                '<img src='+image+' alt="Movie Poster" height="125" width="100">'+
              '</div>'+
              '<div class="col-md-11">'+
                '<p><span style="font-size: 16px; font-weight: bold;">'+ movie_name +' </span><span style="color: #707070; font-size: 12px">'+year+'</span>'+
                '<br><b>MPA Rating: </b>'+rating1+'<b> Runtime: </b>'+runtime1+
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
            '<button type="button" class="btn btn-info" id="clearB" onclick="addtoQueue();">Add</button>'
          '</div>'+
        '</div>'+
      '</div>';
      if(!firstLoaded) {
        $("#movies").empty();
        firstLoaded = true;
      }
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
      // // console.log('Rating: ' + rating);
      // // console.log('Runtime: ' + runtime);
      // // console.log('Review Summary: ' + review_summary);
      // // console.log('Synopsis: ' + synopsis);
      // // console.log('Critics Score: ' + c_score);
      // // console.log('Audience Score: ' + a_score);
      // // console.log('Year: ' + year);
      // // console.log('Thumbnail: ' + image);     
    },
    'error': function (request, status, error) {

            console.log('shit went down. RT Outer');
        }
  });
}

function getReviews(i) {
  if($('#reviews').is(':empty')) {
    return;
  }
  var movie_id = mObj[i]['id'];
  console.log(movie_id);
  var param_apikey = apikeys[1];
  url = 'http://api.rottentomatoes.com/api/public/v1.0/movies/' 
    + movie_id +  '/reviews.json?apikey=' + param_apikey;
  var div = '#reviews'+i;
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
      for (var j = 0; j < 3; j++)
      {
        var quote = reviews[j]['quote'];
        var link = reviews[j]['links']['review'];
        reviewsString = reviewsString + quote + ' ' + '<a href="'+link + '" target="_blank">Link</a><br>';
        console.log(quote);
        console.log(link);
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
                          '<br>"'+mObj[i]['nytSummary']+'"'+
                          '</p>'+
                      '</div>'+
                  '</div>'+
                '</div>'
        console.log(div);
        //$('#loading-indicator'+x+''+j).remove();
        //$(div).empty();
        $(div).append(contents);
    }
  });
}