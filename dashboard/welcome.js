async function onload(){
  await pasteUserInfo();
  await pasteInterests();
  await pasteSuggestions();
  await pasteFriends();
};

function pasteUserInfo() {
  if (user.hasOwnProperty("autoLogin")) {
    userElement = document.getElementById("user");
    userElement.innerHTML = "Welcome back, " + user.firstName + " " + user.lastName;
  }
};

async function pasteInterests() {
  console.log("pasteInterests");
  interestsResult = await fetchUserInterests();

  if (interestsResult === 'resolved') {
    interestlist   = document.getElementById("interests");
    list           = interestlist.firstElementChild;
    interests      = result;
    list.innerHTML = "";
    console.log("if statement");
    console.log(interests);

    if (interests < 0) {
      return false;
    }

    for(var i = 0; i < interests.length; i++) {
      console.log("FORLOOP");
      console.log(connResult);
      connResult = await fetchInterestData(interests[i].interestID);

      if(connResult === 'resolved') {
        interest = result[0];
        console.log(interest);
        list.innerHTML += "<li>" + interest.name + "<button onclick='removeInterest(" + interest.ID + "," + user.id + ")'>Remove</button></li>";
      }
    }
    console.log("FORLOOP END");
  } else {
    console.log("not resolved");
  }
};

async function pasteSuggestions() {
  console.log("pasteSuggestions");
  suggestionsResult = await fetchInterests();

  if (suggestionsResult === 'resolved') {
    suggestionslist = document.getElementById("suggestions");
    list            = suggestionslist.firstElementChild;
    suggestions     = result;
    list.innerHTML  = "";
    console.log("if statement");
    console.log(suggestions);

    for(var i = 0; i < suggestions.length; i++) {
      console.log("FORLOOP");
      suggestion = suggestions[i];
      console.log(suggestion);
      list.innerHTML += "<li>" + suggestion.name + "<button onclick='addInterest(" + suggestion.ID + "," + user.id + ")'>add</button></li>";
    }
    console.log("FORLOOP END");
  } else {
    console.log("not resolved");
  }
};

async function pasteFriends() {
  console.log("pasteFriends")
  friendsResult = await fetchFriends();

  if(friendsResult === 'resolved') {
    friendslist    = document.getElementById("friendslist");
    list           = friendslist.firstElementChild;
    friends        = result;
    list.innerHTML = "";
    console.log("if statement");
    console.log(friends);

    if (friends.length < 1) {
      return false;
    }

    for(var i = 0; i < friends.length; i++) {
      console.log("FORLOOP");
      connResult = await fetchUserData(friends[i].user2ID);
      console.log(connResult);

      if(connResult === 'resolved') {
        friend = result[0];
        console.log(friend);
        list.innerHTML += "<li>" + friend.userName + "<button value='" + friend.ID + "'>Call</button><button onclick='removeFriend(" + friend.ID + ")'>Remove</button></li>";
      } else {
        console.log("not resolved");
        console.log(connResult);
      }
    }
    console.log("FORLOOP END")
  } else {
    console.log("not resolved");
  }
};

function noFriends() {
  friendslist = document.getElementById("friendsList");

  friendslist.innerHTML += "You have no friends."
}

async function searchUsers() {
  search = document.getElementsByName("search")[0].value;

  var sql     = "SELECT * FROM db.users WHERE ?? = ?";
  var inserts = ["userName", search];
  sql         = mysql.format(sql, inserts);

  connResult = await conn(sql);

  if (connResult === 'resolved') {
    searchResult = result;
    searchlist = document.getElementById("searchlist");

    searchlist.innerHTML = searchResult[0].userName + "<button onclick='addFriend(" + searchResult[0].ID + ")' class='buttonMedium'>Add</button>";
  } else {
    console.log("not resolved");
  }
}
