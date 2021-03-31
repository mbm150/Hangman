(function(){
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  //ga('create', 'UA-34526837-5', 'auto');
  ga('create', '0', 'auto');
  ga('send', 'pageview');

  var app = angular.module('HangmanApp', ['ngAnimate', 'ngRoute', 'ngResource']);
  // Routes
  app.config(['$routeProvider', function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: './views/categories.html',
        controller: 'CategoriesCntrl',
        controllerAs: 'categories'
      })
      .when('/game/:id/:name', {
        templateUrl: './views/game.html',
        controller: 'GameCntrl',
        controllerAs: 'game'
      })
      .when('/add_word', {
        templateUrl: './views/add_word.html',
        controller: 'AddWordCntrl',
        controllerAs: 'add'
      })
      .when('/controls', {
        templateUrl: './views/controls.html'
      })
      .when('/options', {
        templateUrl: './views/options.html',
        controller: 'OptionsCntrl',
        controllerAs: 'options'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
  // Data Factory
  app.factory('DATA', ['$http', function($http){
    return {
      texts: function(lang){
        return $http.get('./data/' + lang + '/texts.json');
      },
      categories: function(lang){
        return $http.get('./data/' + lang + '/categories.json');
      },
      words: function(lang){
        return $http.get('./data/' + lang + '/words.json');
      },
      letters: function(lang){
        return $http.get('./data/' + lang + '/letters.json');
      }
    };
  }]);
  // Main Controller
  app.controller('MainCntrl', ['$scope', '$route', '$location', 'DATA', function($scope, $route, $location, DATA){
    var main = this;
    // Menu Controls
    $scope.$on('$routeChangeStart', function(event){
      main.categoriesRoute = false;
      var categoriesRoute = $location.path() === '/';
      if(categoriesRoute){
        main.categoriesRoute = true;
      }
    });
    // Lenguage and resources
    $scope.lang = localStorage.getItem('lang') || 'es';

    DATA.texts($scope.lang).success(function(data){
      $scope.texts = data;
    });
    
    //Controles de teclado
    $scope.reload = 0;
    main.control = function(event){
      switch(event.which){
        //esc
				case 27:
				  $location.path('/');
				  break;
				//enter
				case 13:
				  $scope.reload++;
				  break;
				default:
					break;
			}
    };
    main.keypress = function(event){
      if($location.path() != '/'&& $location.path() != '/add_word'){
        $scope.letter = String.fromCharCode(event.which);
      }
    };
  }]);
  // Categories Controller
  app.controller('CategoriesCntrl', ['$scope', 'DATA', function($scope, DATA){
    var categories = this;

    // Set Defaults
    $scope.$watch('lang', function(n, o){
      // Categories
      var lang = n;
      DATA.categories(lang).success(function(data){
        categories.list = data;
      });
    });
    // Levels
    $scope.level = parseInt(localStorage.getItem('level')) || 2;

    categories.setLevel = function(level){
      localStorage.setItem('level', parseInt(level));
      $scope.level = level;

    };
  }]);
  // Game Controller
  app.controller('GameCntrl', ['$scope', '$route', '$routeParams', '$filter', 'DATA', function($scope, $route, $routeParams, $filter, DATA){
    var game = this;
    // Set Defaults
    $scope.$watch('lang');
    $scope.$watch('reload', function(n, o){
      if(game.finish !== ''){
        game.start();
      }
    });
    //Categoria para tirulo
    $scope.currentCategory = $routeParams['name'];
    // Level
    game.level = function(){
        $scope.level = localStorage.getItem('level') || 2;
        if($scope.level == 1){
          game.limit = 11;
        }else if($scope.level == 2){
          game.limit = 7;
        }else if($scope.level == 3){
          game.limit = 5;
        }
    };
    // Game Start
    game.start = function(){
      game.finish = '';
      game.mistakes = 0;
      game.limit = 11;
      game.level();
      // Add words
        game.data = JSON.parse(localStorage.getItem('words')) || false;
        if(game.data){
          game.data = $filter('filter')(game.data, {'lang': $scope.lang}, true);
        }
      // Category
      var category = parseInt($routeParams['id']);
      //Select Word
      var words = [];
      game.word = [];
      game.allWord = '';
      DATA.words($scope.lang).success(function(data){
        if(game.data){
          var saves = $filter('filter')(game.data, {'lang': $scope.lang});
          for(var d = 0; d < saves.length; d++){
            data.push(saves[d]);
          }
        }
        if(category === 0){
          words = data;
        }else{
          words = $filter('filter')(data, {'category': category}, true);
        }
        var n = Math.round(Math.random() * (words.length - 1));
        var word = words[n].name;
        game.allWord = word;
        word = word.split(' ');
        for(var w = 0; w < word.length; w++){
          var array = {'data': []};
          for(var i = 0; i < word[w].length; i++){
            var a = {'letter': word[w][i], 'state': false};
            array.data.push(a);
          }
          game.word.push(array);
        }
      });
      //Letters
      game.letters = [];
      DATA.letters($scope.lang).success(function(data){
        game.letters = data;
      });
    };
    game.start();
    $scope.$watch('letter', function(n, o){
      if(!game.end){
        game.letter(n);
      }else{
        game.letter('1');
      }
    });
    game.letter = function(letter){
      if(game.finish === ''){
        for(var n = 0; n < game.letters.length; n++){
          var valid = false;
          if(game.letters[n].letter === letter && (game.letters[n].success === false && game.letters[n].error === false)){

            for(var w = 0; w < game.word.length; w++){
              for(var l = 0; l < game.word[w].data.length; l++){
                if(game.word[w].data[l].letter === letter){
                  game.word[w].data[l].state = true;
                  valid = true;
                }
              }
            }
            if(valid){
              game.letters[n].success = true;
            }else{
              game.letters[n].error = true;
            }
            game.check(valid);
            break;
          }
        }
      }
    };
    game.check = function(valid){
      if(valid){
        var cant = $filter('filter')(game.word, {'data': {'state': false}});
        if(cant.length === 0){
          game.win();
        }
      }else{
        game.mistakes++;
        if(game.mistakes === game.limit){
          game.lose();
        }
      }
    };
    game.win = function(){
      game.finish = 'win';

    };
    game.lose = function(){
      game.finish = 'lose';

    };
  }]);
  // Add Word Controller
  app.controller('AddWordCntrl', ['$scope', '$filter', 'DATA', function($scope, $filter, DATA){
    var add = this;
    // Set Defaults
    $scope.$watch('lang');
    // Words
    add.getWords = function(){
      add.words = [];
        var words1 = localStorage.getItem('words') || '[]';
        words = JSON.parse(words1);

        if(words.length > 0){
          var filtro = $filter('filter')(words, {'lang': $scope.lang}, true);
          add.words = filtro;
        }
    };
    add.getWords();
    // Categories
    DATA.categories($scope.lang).success(function(data){
      add.categories = data;
      add.select = add.categories[0];
    });
    // Add Words
    add.setWord = function(){
      var word = [{'lang': $scope.lang, 'category': parseInt(add.select.id), 'name': add.word.toLowerCase()}];
      var words1 = localStorage.getItem('words') || '[]';
      words = JSON.parse(words1);
      words.push(word[0]);
      localStorage.removeItem('words');
      localStorage.setItem('words', JSON.stringify(words));
      add.word = '';
      add.words.push(word[0]);
    };
    // Remove Words
    add.removeWord = function(word){
      var words = $filter('filter')(add.words, {'name': word}, function(actual, expected){
        return !angular.equals(actual, expected);
      });
      localStorage.removeItem('words');
      localStorage.setItem('words', JSON.stringify(words));
      add.words = words;
    };
  }]);
  // Options Controller
  app.controller('OptionsCntrl', ['$scope', '$route', 'DATA', function($scope, $route, DATA){
    var options = this;
    // Set Lang
    options.setLang = function(lang){
      localStorage.setItem('lang', lang);
      location.reload();
    };
  }]);
})();