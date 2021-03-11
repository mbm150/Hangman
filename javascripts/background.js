chrome.app.runtime.onLaunched.addListener(function(launchData){
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      bounds: {
        width: 1000, 
        height: 700
      },
      minWidth: 400,
      frame: 'none'
    }
  );
});
var lang;
var level;
var words;
chrome.storage.local.get('lang', function(data){
  var item = 'lang';
  if(item in data){
    lang = data[item];
  }else{
    var value = chrome.i18n.getUILanguage();
    var l = value.split('-');
    if(l[0] !== 'es' && l[0] !== 'en'){
      lang = 'en';
    }else{
      lang = l[0];
    }
  }
});
chrome.storage.onChanged.addListener(function(changes, namespace){
  if(namespace === 'local'){
    var key = 'lang';
    if(changes[key]){
      var storageChange = changes[key];
      lang = storageChange.newValue;
    }
  }
});
chrome.storage.local.get('level', function(data){
  var item = 'level';
  if(item in data){
    level = parseInt(data[item]);
  }else{
    level = 2;
  }
});
chrome.storage.onChanged.addListener(function(changes, namespace){
  if(namespace === 'local'){
    var key = 'level';
    if(changes[key]){
      var storageChange = changes[key];
      level = storageChange.newValue;
    }
  }
});
chrome.storage.sync.get('words', function(data){
  var item = 'words';
  if(item in data){
    words = data[item];
  }
});
chrome.storage.onChanged.addListener(function(changes, namespace){
    var key = 'words';
    if(changes[key]){
      var storageChange = changes[key];
      words = storageChange.newValue;
    }
});
// Check whether new version is installed
/*chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "update"){
    var thisVersion = chrome.runtime.getManifest().version;
    chrome.storage.sync.clear();
    console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
  }
});*/