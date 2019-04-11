function onload(){

pasteFriends();
pasteUserInfo();

};

function pasteUserInfo() {
  if (user.hasOwnProperty("autoLogin")) {
    userElement = document.getElementById("user");

    userElement.innerHTML = "Welcome back, " + user.firstname + " " + user.lastName;
  }
};

async function pasteFriends() {
  console.log("pasteFriends")
  friendsResult = await fetchFriends();

  if(friendsResult === 'resolved') {

    friendslist = document.getElementById("friendslist");
    list = friendslist.firstElementChild;
    friends = result;
    list.innerHTML = "";
    console.log("if statement");
    console.log(friends);

    for(var i = 0; i < friends.length; i++) {
      console.log("FORLOOP")
      connResult = await fetchUserData(friends[i].user2ID);
      console.log("connResult");

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

async function searchUsers() {
  search = document.getElementsByName("search")[0].value;

  sql = "SELECT * FROM db.users WHERE ?? = ?";
  inserts = ["userName", search];
  sql = mysql.format(sql, inserts);

  connResult = await conn(sql);

  if (connResult === 'resolved') {
    searchResult = result;
    searchlist = document.getElementById("searchlist");

    searchlist.innerHTML = searchResult[0].userName + "<button onclick='addFriend(" + searchResult[0].ID + ")' class='buttonMedium'>Add</button>";
  } else {
    console.log("not resolved");
  }
}
