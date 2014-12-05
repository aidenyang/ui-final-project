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

var main = function() {

	getLatestMovies(0);

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

	// $("#comments").on('click', '.article_modal', function(event) {
	// 	var title = $(this).siblings()[0];
	// 	var articleUrl = title.innerHTML.split("\"")[1];
	// 	getArticle(articleUrl);
	// });
}

var getLatestMovies = function(offset) {
	var action = "http://api.nytimes.com/svc/movies/v2/reviews/picks.jsonp?order=by-opening-date&offset="+offset;

	$.ajax({
		'url' : action,
		'data': movkey,
		'dataType': 'jsonp',
		'success': function(data, textStats, XMLHttpRequest) {
			$.merge(movies, data.results);
		}
	});

}


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

$(document).ready(main);
