// Login //

/*
 * login()
 */

async function login() {

   var userName = document.forms["login"][0].value;
   var password = document.forms["login"][1].value;

   if(validateForm('login')) {
     var sql     = "SELECT * FROM db.users WHERE ?? = ?";
     var inserts = ["userName", userName];
     sql         = mysql.format(sql, inserts);

     connResult = await conn(sql);

     var dbUserName;
     var dbPassword;
     var autologin;

     if(connResult === 'resolved') {
       dbUserName = result[0]["userName"];
       dbPassword = result[0]["password"];
     } else {
       console.log(connResult);
     }

     if(document.getElementsByName("autoLogin")[0].checked) {
       autoLogin = true;
     } else {
       autoLogin = false;
     }

     if(verifyUser(userName, password, dbUserName, dbPassword)) {
       storeUser(connResult, autoLogin);

       await fetchUserData(userName);

       mainProcess.createMain();

       window = remote.getCurrentWindow;

       window.close();
    }
  }
};

/*
 * verifyUser()
 */

 function verifyUser(userName, password, dbUserName, dbPassword) {

   if(compare(dbUserName, userName)){
     console.log("UserName exists");

     if(compare(dbPassword, password)) {
       console.log("password exists");
       return true;

     } else {
       console.log("Wrong password");
       document.getElementById("formWarning").innerHTML
       return false;

     }
   } else {
     console.log("userName doesn't exist");
     return false;

   }
 };
