// // debugger;
var mysql      = require('mysql');
var prompt = require('prompt');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'zoo_db'
    });

  connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + connection.threadId);
    });
  //connection.connect();


prompt.start();
prompt.message = "";

var zoo = {
    welcome: function(){
        console.log('Welcome to the zoo and friends app!');
    },


    menu: function(){
        console.log('Enter (A) ---> to Add a new animal to the Zoo!');
        console.log();
        console.log('Enter (U) ---> to Update info on animal in the Zoo!');
        console.log();
        console.log('Enter (V) ---> to Visit a new animal in the Zoo!');
        console.log();
        console.log('Enter (D) ---> to Adopt an new animal to the Zoo!');
        console.log();
        console.log('Enter (Q) ---> to Quit and exit the Zoo!');
    },

    add: function(input_scope){
        var currentScope = input_scope;
        console.log('To add an animal to the zoo please fill out the following form for us!');
        prompt.start();
        prompt.get(['caretaker_id','name','type','age'], function(err, result){
            var newEntry = result.name;
            var query = "INSERT INTO animals (caretaker_id, name, type, age) VALUES ("+ result.caretaker_id + ", "+ result.name +", "+ result.type+ " ,"+ result.age+");"; 
          connection.query(query, function(err, results){
            if (err) throw err;
          console.log(newEntry + " successfully added to database.");
          currentScope.menu();
          currentScope.promptUser();
            }); 
        });
    }, 

    visit: function(){
        console.log("Please choose an option from the following menu \n");
        console.log("Enter (I): ------> do you know the animal by it’s id? We will visit that animal!\n");
        console.log("Enter (N): ------> do you know the animal by it’s name? We will visit that animal!\n");
        console.log("Enter (A): ------> here’s the count for all animals in all locations! \n");
        console.log("Enter (C): ------> here’s the count for all animals in this one city! \n");
        console.log("Enter (O): ------> here’s the count for all the animals in all locations by the type you specified!\n");
        console.log("Enter (Q): ------> Quits to the main menu! \n");
        this.view(this);
    },

    view: function(input_scope){
        var currentScope = input_scope;
        console.log("Please choose what you would like to visit.");
        prompt.get(["input"], function(err, result){
          if (result.input === "Q"){
            currentScope.menu();
            currentScope.promptUser();
          }else if(result.input ==="O"){
            currentScope.type(input_scope);
          }else if(result.input ==="I"){
            currentScope.animId(input_scope);
          }else if(result.input ==="N"){
            currentScope.name(input_scope);
          }else if(result.input ==="A"){
            currentScope.all(input_scope);
          }else if(result.input ==="C"){
            currentScope.care(input_scope);
          }else{
            console.log("Sorry didn't get that, come again?");
            currentScope.visit();
            currentScope.view(currentScope);
          }
        });
    },

    type: function(input_scope) {
        var currentScope = input_scope;
        console.log('Enter animal type to find out how many animals we have of that type');
        prompt.get(['animal_type'], function(err, result) {
          //SQL query
          connection.query('SELECT COUNT(*) AS total FROM animals WHERE type = ?', [result.animal_type], function(err, results, fields) {
            if (err) throw err;
            console.log('Total ' +result.animal_type+'s'+ ': ' + results[0].total);
          });
          currentScope.menu();
          currentScope.promptUser();
        });
      },

    care: function(input_scope){
        var currentScope = input_scope;
        console.log("Enter city name NY/SF");
        prompt.get(["city_name"], function(err, result){
          if (result.city_name === "NY"){
            connection.query("SELECT COUNT(caretaker_id) AS countByCity FROM animals WHERE caretaker_id=1", function(err, result){
              console.log("The total number of animals in that city is: " + result[0].countByCity);
              currentScope.visit();
            });
          }else if(result.city_name === "SF"){
            connection.query("SELECT COUNT(caretaker_id) AS countByCity FROM animals WHERE caretaker_id > 1 AND caretaker_id < 100", function(err, result){
              console.log("The total number of animals in that city is: " + result[0].countByCity);
              currentScope.visit();
            });
          }
        });
      },

    animId: function(input_scope){
        var currentScope = input_scope;
        console.log("Enter ID of the animal you want to visit.");
        prompt.get(["animal_id"], function(err, result){
          connection.query("SELECT * FROM animals WHERE id =" +result.animal_id + ";", function(err, result){
            if (err) throw err;
            // console.log(result);
            // console.log("Animal Name: "+ result[0].name);
            console.log("Animal Name: " + result[0].name +  "\nType of Animal: " + result[0].type + "\nAge: " + result[0].age);
            currentScope.visit();
          });
        });
      },

    name: function(input_scope){
        var currentScope = input_scope;
        console.log("Enter the name of the animal you want to visit.");
        prompt.get(["name_of_animal"], function(err, result){
          connection.query("SELECT * FROM animals WHERE name =?",result.name_of_animal, function(err, result, fields){
            if (err) throw err;
            // console.log(result);
            console.log("Animal ID: " + result[0].id + "\nType of Animal:" + result[0].type + "\nAge: " + result[0].age);
            currentScope.visit();
          });
        });
      },

    all: function(input_scope){
        var currentScope = input_scope;
          connection.query("SELECT COUNT(*) FROM animals", function(err, result, fields){
            if (err) throw err;
            // console.log(result[0]["COUNT(*)"]);
            console.log("At this time, the total number of animals in all locations is: " + result[0]["COUNT(*)"]);
            currentScope.visit();
          });
      },

    update: function(input_scope){
        var currentScope = input_scope;
        console.log("To update, enter the information at each prompt: ");
        prompt.get(["id", "new_name", "new_age", "new_type", "new_caretake_id"], function(err, result){
            // console.log(result);
            var query = "UPDATE animals SET name=" + result.new_name + ", age =" + result.new_age + ", type=" + result.new_type + ", caretaker_id=" + result.new_caretaker_id + " WHERE id=" + result.id + ";";
            // var query = "UPDATE animals SET name=" + result.new_name + ", age =" + result.new_age + ", type=" + result.new_type + ", caretaker_id=" + result.new_caretaker_id + " WHERE id=" + result.id + ";";
                connection.query(query, function(err, result){
                if (err) throw err;
                console.log("Information has been successfully updated.");
                currentScope.menu();
                currentScope.promptUser();
            });
         });
      }, 

    adopt: function(input_scope){
        var currentScope = input_scope;
        prompt.get(["animal_id"], function(err, result){
            // console.log(result);
          connection.query("DELETE FROM animals WHERE id="+ result.animal_id +";", function(err, result){
            if (err) throw err;
            // console.log(result);
            console.log("Animal successfully adopted!");
            currentScope.menu();
            currentScope.promptUser();
           });
         });
      }, 

     promptUser: function(){
        var self = this;
        prompt.get = (["input"], function(err, result){
            if (result.input === "Q"){
                self.exit();
            } else if (result.input === "A"){
                self.add(self);
            } else if (result.input === "V"){
                self.visit(self);
            } else if (result.input === "D"){
                self.adopt(self);
            } else {
                console.log("Sorry didn't get that, come again?");
            } 
            self.promptUser();
        }); 
     },  

     exit: function(){
        console.log("Thank you for visiting us. Goodbye!");
        process.exit();
     },

     open: function() {
        this.welcome();
        this.menu();
        this.promptUser();
     }

};

zoo.open();









 


