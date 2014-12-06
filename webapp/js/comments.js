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

var movies = [];

var moviesAdded = [];



var main = function() {

	getLatestMovies(0);
	//parameter index i
	if(typeof(Storage) !== "undefined")
	  {
	    if (localStorage.getItem("queue") !== null) {
	    	var queue = localStorage.getItem("queue");
	    	var i;
	    	for(i=0; i<queue.length; i++) {
	    		addToQueue(queue[i]);
	    	}
		}
	  }
	  else 
	  {
	    console.log("Browser does not support storage");
	  }

	$(document).ready(main);
	// $("#random").click(function(){
	// 	$("#comments").empty();
	// 	$("#header").text("Random Comments");
	// 	getRandomComments();	
	// });

	// $("#clear").click(function(){
	// 	$(".chat li").each(function(index) {
	// 		if(index>1) {
	// 			$(this).remove();
	// 			ratingData = [];
	// 		}
	// 	});
	// });

	// $("#comments").on('click', '#name', function(event) {
	// 	event.preventDefault();
	// 	$("#comments").empty();

	// 	//get user name
	// 	var name = $(this).text();
	// 	$("#header").text(name);

	// 	//get user id and get comments from user id
	// 	var id = $(this).parent().next().text();
	// 	getCommentsById(id);

	// 	return false;
	// });

	// $("#comments").on('click', 'li a', function(event) {
	// 	event.preventDefault();
	// 	var self = $(this);

	// 	var rating = $(this).text();
	// 	var name = $(this).parents().find("#name").text();

	// 	updateRatings(name, rating, self);
	// });

	// $("#search").click(function() {
	// 	console.log("here1111");
	// 	searchMovies();	
	// });

	// $('#inp').keypress(function(e){
 //     	var code = (e.keyCode ? e.keyCode : e.which);
 //      	if(code == 13) {
 //        searchMovies()
 //      }
	// });

	$("#mostpop").click(function() {
		$("#movies").empty();
		// getLatestMovies(0);	
	});
}

var addToQueue = function(index) {

	if(moviesAdded.length+1 > 11) {
		alert("Maximum number of movies allowed in queue is 11!")
	}

	if(moviesAdded.indexOf(mObj[index])==-1 && moviesAdded.length<11) {
		//save movie added
	    moviesAdded[moviesAdded.length]=mObj[index];

		var movie = mObj[index]
		var title = movie.movieName;
		var imageUrl = movie.img;

		var item="";
		item += "<div class=\"qitem\">";
		item += "<img class=\"qimage\" src=\""+imageUrl+"\" \/>";
		item += "<div class=\"qtext\">";
		item += title;
		item += "<\/div>";
		item += "<\/div>";

		$("#queue").append(item);

		//parameter index i
		if(typeof(Storage) !== "undefined") {
			localStorage.setItem("movies", moviesAdded);
		}
		else {
			console.log("Browser does not support storage");
		}
	}
}

// var getLatestMovies = function(offset) {
// 	var action = "http://api.nytimes.com/svc/movies/v2/reviews/picks.jsonp?order=by-opening-date&offset="+offset;

// 	$.ajax({
// 		'url' : action,
// 		'data': movkey,
// 		'dataType': 'jsonp',
// 		'success': function(data, textStats, XMLHttpRequest) {
// 			$.merge(movies, data.results);
// 		}
// 	});

// }


var updateRatings = function(name, rating, user) {
	var ratingObj = null;

	$.each(ratingData, function(index, value) {

		if (value.name==name) {
			ratingObj = ratingData[index];
		}

	});

	if(ratingObj) {
		updateRatingValues(name, rating, ratingObj);
	}
	else {
		var ratingObj = {
			name: name,
			rating_major: rating,
			Educated: 0,
			Smart: 0,
			Cynical: 0,
			Negative: 0,
			Hateful: 0,
			total: 0,
		};

		ratingObj[rating]++;
		ratingObj.total++;

		createRatingValue(ratingObj);
	}
}

var updateRatingValues = function(name, rating, ratingObj) {
	ratingObj[rating]++;
	ratingObj.total++;

	var old = null;

	$(".chat li").each(function(index) {
		if(index>1) {
			var com_name = $(this).find("#rating-name").text();

			if(com_name==name) {
				old = $(this);
			}
		}
		return (old==null);
	});

	old.remove();
	createRatingValue(ratingObj);
}

var createRatingValue = function(ratingObj) {
	var name = ratingObj.name;
	var votes = ratingObj.total;

	var ed = Math.round(ratingObj.Educated/ratingObj.total*100);
	var sm = Math.round(ratingObj.Smart/ratingObj.total*100);
	var cy = Math.round(ratingObj.Cynical/ratingObj.total*100);
	var ne = Math.round(ratingObj.Negative/ratingObj.total*100);
	var ht = Math.round(ratingObj.Hateful/ratingObj.total*100);

	var sum = ed + sm + cy + ne + ht;
	while(sum>100) {
		if(ed>0) {
			ed--;
			sum--;
		}
		else if(sm>0) {
			sm--;
			sum--;
		}
		else if(cy>0) {
			cy--;
			sum--;
		}
		else if(ne>0) {
			ne--;
			sum--;
		}
		else {
			ht--;
			sum--;
		}
	}

	var rates = [
		{name: "Educated", value: ed},
		{name: "Smart", value: sm},
		{name: "Cynical", value: cy},
		{name: "Negative", value: ne},
		{name: "Hateful", value: ht},
	];

	rates.sort(function(a, b) {
		if(a.value<b.value) {
			return -1;
		}
		else if(a.value>b.value) {
			return 1;
		}
		else
			return 0;
	});

	var rating = rates[rates.length-1].name;

	var ratingCell="";
	ratingCell += "<li class=\"clearfix\">";
	ratingCell += "<div class=\"chat-body clearfix\">";
	ratingCell += "<div class=\"header\">";
	ratingCell += "<strong id=\"rating-name\" class=\"primary-font\">"+name+"<\/strong>";
	ratingCell += "<div id=\"rating-major\" class=\"pull-right\">"+rating+"<\/div>";
	ratingCell += "<\/div>";
	ratingCell += "<p class=\"nl\">new line<\/p>";
	ratingCell += "<div id=\"rating-scores\" class=\"progress\">";

	if(ed>0) {
		ratingCell += "<div class=\"progress-bar progress-bar-success progress-bar-striped\" style=\"width: "+ed+"%\">"+ed+"%";
		ratingCell += "<\/div>";
	}
	if(sm>0) {
		ratingCell += "<div class=\"progress-bar progress-bar-success\" style=\"width: "+sm+"%\">"+sm+"%";
		ratingCell += "<\/div>";
	}
	if(cy>0) {
		ratingCell += "<div class=\"progress-bar progress-bar-info\" style=\"width: "+cy+"%\">"+cy+"%";
		ratingCell += "<\/div>";
	}
	if(ne>0) {
		ratingCell += "<div class=\"progress-bar progress-bar-warning\" style=\"width: "+ne+"%\">"+ne+"%";
		ratingCell += "<\/div>";
	}
	if(ht>0) {
		ratingCell += "<div class=\"progress-bar progress-bar-danger\" style=\"width: "+ht+"%\">"+ht+"%";
		ratingCell += "<\/div>";
	}
	ratingCell += "<\/div>";
	ratingCell += "<div class=\"footer\">";
	if(votes==1) {
		ratingCell += "1 vote";	
	}
	else {
		ratingCell += votes+" votes";
	}
	ratingCell += "<\/div>";
	ratingCell += "<\/div>";
	ratingCell += "<\/li>";
	
	ratingData[ratingData.length] = ratingObj;
	$(".chat").append(ratingCell);
}

var getDate = function(timestamp) {
	var date = new Date(timestamp*1000);
	var datecomp = date.toString().split(" ");
	var datestring = datecomp[0]+", "+datecomp[1]+" "+datecomp[2]+" "+datecomp[3];
	return datestring;
}

var getCommentsById = function(userId) {
	var action = "http://api.nytimes.com/svc/community/v2/comments/user/id/"+userId+".jsonp";

	$.ajax({
		'url' : action,
		'dataType': 'jsonp',
		'data': api_key,
		'success': function(data, textStats, XMLHttpRequest) {

			if(data.results.comments!=null) {

				$.each(data.results.comments, function(index, comment) {
					var date = getDate(comment.approveDate);
					var commentBody = comment.commentBody;
					var name = comment.display_name;
					var location = comment.location;
					var userId = comment.userComments.split("/id/")[1].split(".xml")[0];

					var comment_data = createComment(date, null, commentBody, name, location, userId);

					//check if name is not null!
					if(name!=null && name!="") {
						$("#comments").append(comment_data);
					}
				});
			}
		}
	});
}

var getArticle = function(articleUrl) {
	var action = "http://api.nytimes.com/svc/search/v2/articlesearch.jsonp?";
	artparam.fq = "web_url:(\""+articleUrl+"\")";
	var article;

	$.ajax({
		'url' : action,
		'jsonpCallback' : "svc_search_v2_articlesearch",
		'data': artparam,
		'dataType': 'jsonp',
		'success': function(data, textStats, XMLHttpRequest) {
			article = data.response.docs[0];
			
			if(article!=null) {
				showArtModal(article);
			}
			else {
				article = {
					no_head: "We are sorry!",
					no_body: "There is no information for this article."
				}
				showArtModal(article);
			}
		}
	});
}

var showArtModal = function (article) {
	var headline;
	var body;
	var source;
	var author;
	var image = "";
	var imageUrl;
	var error = 0;

	if(article.no_head!=null) {
		headline = article.no_head;
		body = article.no_body;
		error = 1;
	}
	else {
		if(article.headline!=null && article.headline!="") {
			headline = article.headline.main;	
		}
		else if(article.lead_paragraph!=null && article.lead_paragraph!="") {
			headline = article.lead_paragraph;
		}
		else {
			headline = "";
		}
		
		if(article.snippet!=null && article.snippet!="") {
			body = article.snippet;
		}
		else if(article.abstract!=null && article.abstract!="") {
			body = article.abstract;	
		}
		else {
			body = "";
		}

		if(article.source!=null && article.source!="") {
			source = article.source;
		}
		else {
			source = "";
		}

		if(article.byline!=null && article.byline.original!=null && article.byline.original!="") {
			author = article.byline.original;
		}
		else {
			author = "";
		}

		if(article.multimedia!=null && article.multimedia.length!=0 && article.multimedia[0]!=null 
			&& article.multimedia[0].url!=null && article.multimedia[0].url!="") {
			imageUrl = article.multimedia[0].url;
			image = "<img id='art_image' class='img-responsive' src='http://www.nytimes.com/"+imageUrl+"' alt='image'></img>";
		}
	}
	
	$("#headline").text(headline);
	if($("#art_image")!=null ) {
		$("#art_image").remove();
	}
	if(image!="") {
		$("#body").prepend(image);	
	}
	$("#main").text(body);
	
	if(error==0) {
		$("#source").text(source);
		$("#author").text(author);	
	}
	
	$('#myModal').modal("show");
}

var getRandomComments = function() {
	
	var action = "http://api.nytimes.com/svc/community/v2/comments/random.jsonp";

	$.ajax({
		'url' : action,
		'data': api_key,
		'dataType': 'jsonp',
		'success': function(data, textStats, XMLHttpRequest) {

			$.each(data.results.comments, function(index, comment) {
				var date = getDate(comment.approveDate);
				var articleUrl = comment.articleURL;
				var commentBody = comment.commentBody;
				var name = comment.display_name;
				var location = comment.location;
				var userId = comment.userComments.split("/id/")[1].split(".xml")[0];
				var comment_data = createComment(date, articleUrl, commentBody, name, location, userId);

				//check if name is not null!
				if(name!=null && name!="") {
					$("#comments").append(comment_data);
				}
			});
		}
	});
}

var createArticleTitle = function(articleUrl) {
	var i = articleUrl.lastIndexOf("/");
	var k = articleUrl.indexOf(".html");
	var temp;

	if(k!=-1) {
		articleUrl = articleUrl.substr(0, k);
		temp = articleUrl.substr(++i);
	}
	else {
		if(i==articleUrl.length-1) {
			articleUrl = articleUrl.substr(0, i);
			i = articleUrl.lastIndexOf("/");
		}
		temp = articleUrl.substr(++i);
	}

	temp = temp.split("-");

	var title = "";
	for(var j=0; j<temp.length;j++) {
		var first = temp[j];
		first = first.charAt(0);
		title+=first.toUpperCase();
		
		var rest = temp[j].substr(1);
		title+=rest;
		title+=" ";
	}
	return title;
}

var createComment = function(date, articleUrl, commentBody, name, location, userId) {
	var articleTitle;
	if(articleUrl!=null) {
		articleTitle = createArticleTitle(articleUrl);
	}
	else {
		articleTitle = "";
	}

	var comment="";
	comment += "<!-- start comment row -->";
	comment += "      <div class=\"row\">";
	comment += "        <div class=\"col-lg-9 panel panel-default panel-horizontal\">";
	comment += "";
	comment += "          <div class=\"panel-heading well\">";
	comment += "            <h3><a id=\"name\" href=\"#\">"+name+"<\/a> <\/h3>";
	comment += "            <p class=\"userId\">"+userId+"<\/p>";
	comment += "            <h4>"+location+"<p><small>"+date+"<\/small><\/p><\/h4>";
	comment += "                <!-- Rate button -->";
	comment += "                <div class=\"btn-group\">";
	comment += "                  <button type=\"button\" class=\"btn btn-default dropdown-toggle center-block\" data-toggle=\"dropdown\" aria-expanded=\"false\">";
	comment += "                    Rate <span class=\"caret\"><\/span>";
	comment += "                  <\/button>";
	comment += "                  <ul class=\"dropdown-menu\" role=\"menu\">";
	comment += "                    <li><a href=\"#\">Educated<\/a><\/li>";
	comment += "                    <li><a href=\"#\">Smart<\/a><\/li>";
	comment += "                    <li><a href=\"#\">Cynical<\/a><\/li>";
	comment += "                    <li><a href=\"#\">Negative<\/a><\/li>";
	comment += "                    <li><a href=\"#\">Hateful<\/a><\/li>";
	comment += "                  <\/ul>";
	comment += "                <\/div>";
	comment += "                <\/p>";
	comment += "          <!-- end heading-->";
	comment += "          <\/div>";
	comment += "";
	comment += "        <div class=\"panel-body\">";
	comment += "          <button id=\"article\" type=\"button\" class=\"btn btn-default btn-lg article_modal\">";
	comment += "              <span class=\"glyphicon glyphicon-font\" aria-hidden=\"true\"><\/span>";
	comment += "            <\/button>";
	comment += "          <h3><a href=\""+articleUrl+"\" target=\"_blank\">"+articleTitle+"<\/a><\/h3>";
	comment += "          <!-- Article Button -->";
	comment += "            ";
	comment += "          <p class=\"lead\">"+commentBody+"<\/p>";
	comment += "        <!-- end body-->";
	comment += "        <\/div>";
	comment += "      <!-- end col-->";
	comment += "      <\/div>";
	comment += "     <!-- end row-->";
	comment += "     <\/div>";

    return comment;
}

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
        $("#movies").empty();
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
              '<div class="col-md-2">'+
                '<img src='+image+' alt="Movie Poster" height="125" width="100">'+
              '</div>'+
              '<div class="col-md-10">'+
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
            '<button type="button" class="btn btn-info" id="clearB" onclick="addToQueue('+j+');">Add</button>'
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
  var div = '#reviews'+i;
  if(!($(div).is(':empty'))) {
    return;
  }
  var movie_id = mObj[i]['id'];
  console.log(movie_id);
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

function getRTReviews(param_apikey){
  url = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey='+ param_apikey;
  $.ajax({
    'type' : "GET", 
    'url': url,
    'cache': true,
    'dataType': 'jsonp',
    'success': function(data, textStats, XMLHttpRequest){
		console.log(data);
		list_movies = data['movies'];
		for(var i = 0; i < list_movies.length; i++)
		{
			parseMovieRT(list_movies[i]);
		}
    }
  });
}


function parseMoviesRT(my_movie){
	var movie_title = my_movie['title'];
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

function updateHTMLWithMovies()
{
	var contents = "";
	for (var j = 0; j < mObj.length; j++)
	{
		var contents += 
	      '<div class="movie">'+
	        '<div class="panel panel-default">'+
	          '<div class="panel-body">'+
	            '<div class="row">'+
	              '<div class="col-md-2">'+
	                '<img src='+mObj[j]['img']+' alt="Movie Poster" height="125" width="100">'+
	              '</div>'+
	              '<div class="col-md-10">'+
	                '<p><span style="font-size: 16px; font-weight: bold;">'+ mObj[j]['movieName'] +' </span><span style="color: #707070; font-size: 12px">'+mObj[j]['year']+'</span>'+
	                '<br><b>MPA Rating: </b>'+mObj[j]['mpaRating']+'<b> Runtime: </b>'+mObj[j]['runtime']+
	                '<br><b>Synopsis: </b>'+mObj[j]['synopsis']+
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
  	}
  	$("#movies").append(contents);
}

