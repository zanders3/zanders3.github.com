var app = angular.module('Project', []);

app.config(['$routeProvider', function($routeProvider)
{
	$routeProvider.when('/home', {controller:HomeController, templateUrl:'home.html'})
				  .when('/blog', {controller:BlogController, templateUrl:'blog.html'})
				  .when('/blog/:page', {controller:BlogController, templateUrl:'blog.html'})
				  .when('/post/:post', {controller:PostController, templateUrl:'post.html'})
				  .when('/portfolio', {controller:PortfolioController, templateUrl:'portfolio.html'})
				  .otherwise({redirectTo:'/home'});

	
}]);
app.config(['$locationProvider', function($locationProvider)
{
	//$locationProvider.html5Mode(true);
	$locationProvider.hashProvider = '!';
}]);
app.run(function($rootScope, $location, $http)
{
	$rootScope.menu = 
	[
		{title:"Home", link:"/home"},
		{title:"Portfolio", link:"/portfolio"},
		{title:"Blog", link:"/blog"},
	];
	$rootScope.formatSelected = function(item)
	{
		return $location.path().indexOf(item.link) != -1 ? "selected" : "";
	};
	$rootScope.formatDate = function(date)
	{
		if (!date) return "";

		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var d = date.getDate();
		var sup = "th";
		if (d == 1 || d == 11 || d == 22)
			sup = "st";
		else if (d == 2 || d == 22)
			sup = "nd";
		else if (d == 3 || d == 33)
			sup = "rd";
		return date.getDate() + sup + " " + months[date.getMonth()] + " " + date.getFullYear();
	};
	$http.get('portfolio.json').success(function(portfolio)
	{
		$rootScope.portfolio = portfolio;
		$rootScope.portfolioImages = portfolio.slice(0,4).map(function(item)
		{
			return item.screenshots[0];
		});
	});
});

//callback from twitter API
function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,"<a href='$1'>$1</a>"); 
}

var tweets = [];
function SetTweets(response)
{
	tweets = response.slice(0, 6);
	for (var i in tweets)
		tweets[i].text = replaceURLWithHTMLLinks(tweets[i].text);
}

//callback from GitHub API
var blog = GetBlog().map(function(post)
{
	var newPost = {};
	newPost.path = 'blog/' + post.link + '.md';
	newPost.title = post.title;
	newPost.link = "#/post/" + post.link;
	newPost.date = post.date;

	newPost.html = "";
	newPost.summary = "";
	newPost.GetHTML = function($http, callback)
	{
		var thisPtr = this;
		if (this.html.length == 0)
		{
			$http.get(this.path).success(function(text)
			{
				thisPtr.html = marked(text);
				thisPtr.summary = text.slice(0, 100) + "...";
				thisPtr.bigsummary = thisPtr.html.slice(0,2000);
				if (thisPtr.bigsummary.length < thisPtr.html.length)
					thisPtr.bigsummary += "...";
				callback(thisPtr);
			});
		}
		else callback(this);
	};

	return newPost;
});

//page controllers
function HomeController($scope, $http)
{
	$scope.tweets = tweets;
	$scope.blogSummary = blog.slice(0,3);
	for (var i in $scope.blogSummary)
		blog[i].GetHTML($http, function()
		{
			$scope.blogSummary = blog.slice(0,3);
		});
}

function BlogController($scope, $http, $route)
{
	var page = 0;
	var numPerPage = 4;
	if ($route.current.params.page)
		page = $route.current.params.page;

	var posts = blog.slice(page, page + numPerPage);
	var numRemaining = posts.length;
	for (var i in posts)
	{
		posts[i].GetHTML($http, function()
		{
			numRemaining--;
			if (numRemaining <= 0)
				$scope.posts = posts;
		});
	}
}

function PostController($scope, $http, $location)
{
	var link = "#" + $location.path();
	for (var i in blog)
		if (blog[i].link == link)
		{
			blog[i].GetHTML($http, function(post)
			{
				$scope.post = post;
			});
			return;
		}
}

function PortfolioController($scope, $rootScope, $http)
{
	$scope.formatLink = function(name)
	{
		return name.replace(/[ :]/g, '').toLowerCase();
	};
	$scope.pickTitle = function(item)
	{
		return item.menutitle ? item.menutitle : item.title;
	};
	$scope.scrollTo = function(item)
	{
		var itemId = $scope.formatLink(item.title);
		$(window).scrollTop($("#" +itemId).offset().top - 10);
	};

	var initialLeft = $(".headercontainer").offset().left;
	$(window).resize(function()
	{
		initialLeft = $(".headercontainer").offset().left;
		$(".navbar").css('left', initialLeft-$(window).scrollLeft());
	});
	$(window).scroll(function()
	{
		var windowTop = $(window).scrollTop();
		$(".navbar").css('top', Math.max(10, 170-windowTop));
		$(".navbar").css('left', initialLeft-$(window).scrollLeft());
	});
}
