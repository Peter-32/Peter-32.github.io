angular.module("theApp", [])
.controller('headerCtrl', function($scope) {
  let idx = 0;
  let para_array = ["Room 1 is my bedroom",
  "Room 2 is my friend's bedroom",
  "Room 3 is the living room"]
  let header_array = ["Topics of Conversion", "Topics of Conversion", "Topics of Conversion"]
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
