
const renderTweets = function(tweetsArray) {
  if (Array.isArray(tweetsArray)) {
    return tweetsArray.forEach(tweet => {
      $('#tweets-container').prepend(createTweetElement(tweet));
    });
  } else {
    return $('#tweets-container').prepend(createTweetElement(tweetsArray));
  }
};

// Create the tweet and its HTML

const createTweetElement = function(tweetObject) {
  const dateOfTweet = new Date(tweetObject.created_at);
  
  const tweetTime = () => {
    const now = new Date();
    const minutes = 24 * 60 * 60 * 1000;
    const diff = (now - dateOfTweet) / minutes;
    const diffHour = diff * 24;
    const diffMin = diffHour * 60;

    if (Math.floor(diffHour) === 0) {
      return `${Math.floor(diffMin)} minutes`;

    } else if (Math.floor(diff / 365) === 0) {
      return `${Math.floor(diffHour)} hours`;

    } else if (diff < 31) {
      return `${Math.floor(diff / 365)} days`;

    } else if (diff <= 365) {
      return `${Math.floor(diff / 31)} months`;

    } else {
      return `${Math.floor(diff / 365)} years`;
    }
  };

  const element = `
    <article class="tweet">
    <header>
      <div class="wrapper">
        <img src=${tweetObject.user.avatars} />
        <span class="name">${tweetObject.user.name}</span>
      </div>
      <span class="handle">${tweetObject.user.handle}</span>
    </header>
    <div class="content">
        ${escape(tweetObject.content.text)}
    </div>
    <footer>
      <span class="date">
      ${tweetTime()} ago
      </span>
      <div class="actions">
      <i class="fas fa-share-alt"></i>
      <i class="fas fa-retweet"></i>
      <i class="fas fa-heart"></i>

        </div>
    </footer>
    </article>
  `;
  return element;
};

// Add tweets to the HTML page
const loadTweets = (url, method, cb) => {
  $.ajax({
    url,
    method,
  })
    .done(data => {
      cb(data);
    })
    .fail(err => {
      console.log('Error:', err);
    })
    .always(() => {
      console.log("Tweets loaded!");
    });
};

// Add the new submitted tweet to the HTML page

const loadNewTweet = (url, method, cb) => {
  $.ajax({
    url,
    method,
  })
    .done(data => {
      cb(data[data.length - 1]);
    })
    .fail(err => {
      console.log('Error:', err);
    })
    .always(() => {
      console.log("Tweets loaded!");
    });
};

// Reset the form

const refreshPage = () => {
  $('textarea').val('');
  $('.counter').text(140);
  loadNewTweet("/tweets", "GET", renderTweets);
};

// Check to see if the tweet submitted isn't empty/too long

const submitCheck = (text) => {
  if (!text) {
    $('.error-message');
    $('.error-message contents').text("Your tweet is empty");
    return;
  } else if (text.length > 140) {
    $('.error-message');
    $('.error-message contents').text("Your tweet is too long: 140 characters or less!");
    return;
  } else {
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: {
        text
      }
    })
      .done(() => {
        console.log('Success!');
        refreshPage();
      })
      .fail((err) => {
        console.log("Error:", err);
      })
      .always(() => {
        console.log("Done!");
      });
  }
};

$(document).ready(function() {
  loadTweets("/tweets", "GET", renderTweets);
  $(".error-message").hide();
  $(".new-tweet").hide();

  $("form").on("submit", function() {
    event.preventDefault();
    $(".error-message").slideUp();
    console.log('Performing AJAX request...');
    submitCheck($('textarea').val());
  });

  $("nav button").on("click", () => {
    $(".new-tweet").slideToggle();
    $(".error-message").slideUp();
    $("textarea").focus();
  });

});
// XSS attack
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};