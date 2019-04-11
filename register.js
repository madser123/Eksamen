// REGISTRATION //

/*
 * createUser() denne funktion står for at anskaffe og sammenligne data
 * så at der ikke bliver oprettet 2 identiske brugere.
 */

async function createUser() {
 document.getElementById("formWarning").innerHTML = "";

 if(validateForm("register")) {
   var firstName = document.getElementsByName("firstName")[0].value;
   var lastName  = document.getElementsByName("lastName")[0].value;
   var email     = document.getElementsByName("email")[0].value;
   var userName  = document.getElementsByName("userName")[0].value;
   var password  = document.getElementsByName("password")[0].value;
   let filter    = 1;
   let role      = 0;

   firstName = ucFirst(firstName);
   lastName  = ucFirst(lastName);

   if(await doesUserExist(userName, email)) {
     console.log("User already exist.");
     document.getElementById("formWarning").innerHTML = "* User already exist";
   } else {
     console.log("Registration complete");
     conn("INSERT INTO users (`firstName`,`lastname`,`email`,`userName`,`password`,`filter`,`role`) VALUES ('"+firstName+"','"+lastName+"','"+email+"','"+userName+"','"+password+"','"+filter+"','"+role+"')");
     redirect('../index.html');
   }
 } else {
   console.log("Form field empty");
 }
};
