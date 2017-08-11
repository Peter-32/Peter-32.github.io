angular.module("theApp", [])
.controller('headerCtrl', function($scope) {
  let idx = 0;
  let para_array = ["Go therefore and make disciples of all nations, baptizing them in the name of the Father and the Son and the Holy Spirit, teaching them to observe all that I have commanded you.  And behold, I am with you always, to the end of the age. <br>-Matthew 28:19-20",
  "Whoever has my commands and keeps them is the one who loves me. The one who loves me will be loved by my Father, and I too will love them and show myself to them. <br>-John 14:21",
  "Very truly I tell you, whoever hears my word and believes him who sent me has eternal life and will not be judged but has crossed over from death to life. <br>-John 5:24"]
  let header_array = ["The Great Commission", "Jesus Promises the Holy Spirit", "The Authority of the Son"]
  let para = document.getElementById("changing_paragraph")
  let header = document.getElementById("changing_header")
  $scope.changeParagraph = function() {
    idx = idx + 1;
    if (idx >= para_array.length) {
      idx = 0;
    }
    para.innerHTML = para_array[idx];
    header.innerHTML = header_array[idx];
  };
  $scope.randomizeParagraph = function() {
    idx = Math.floor(Math.random() * (para_array.length));
    $scope.changeParagraph();
  };
  $scope.randomizeParagraph();


});
