// Does not work yet, still debugging, will leave in partials/footer.ejs for now

// Autosize Text
autosize(document.getElementById("text-area-comment"));
autosize(document.getElementById("text-area-edit"));
autosize(document.getElementById("description"));

// Show More/Less
$(document).ready(function() {
  $(".user-comment-space").shorten({
    "showChars": 200
  });
  $(".campground-text").shorten({
    "showChars": 300
  });
});
