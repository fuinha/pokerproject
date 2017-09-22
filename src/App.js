import React, { Component } from 'react';
import './App.css';
import Options from "./Options.js"
import Table from "./Table.js"
import Image from "./Image.js"




function generateNewDeck(){
  var hearts = []
  var spades = []
  var diamonds = []
  var clubs = []

  
  for (var i = 2; i < 15; i++ ){
    hearts.push({
      number : i,
      suit: "hearts"
    })
    spades.push({
      number : i,
      suit: "spades"
    })
    diamonds.push({
      number : i,
      suit: "diamonds"
    })
    clubs.push({
      number : i,
      suit: "clubs"
    })  
  }

  var deck = hearts.concat(spades).concat(diamonds).concat(clubs);
  var currentIndex = deck.length, temporaryValue, randomIndex
  while(0 !== currentIndex){
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = deck[currentIndex];
    deck[currentIndex] = deck[randomIndex];
    deck[randomIndex] = temporaryValue;
  }

  return deck;
}


class App extends Component {
  constructor(props){
    super(props)
   



  var deck = generateNewDeck()


   var users = [{
      username : "user1",
      clock : Date(),
      stack : 50,
      hand : [],
      position : "",
      isActive: true,
      folded: false,
      marker: false,
      bet: 0
    }, 
      {
      username : "user2",
      clock : Date(),
      stack : 50,
      hand : [],
      position : "",
      isActive: false,
      folded: false,
      marker: false,
      bet: 0
    },
      {
      username: "user3",
      clock : Date(),
      stack : 50,
      hand : [],
      position : "",
      isActive: false,
      folded: false,
      marker: false,
      bet: 0
      },
      {
      username : "user4",
      clock : Date(),
      stack : 50,
      hand : [],
      position : "",
      isActive: false,
      folded: false,
      marker: false,
      bet: 0
    }, 
      {
      username : "user5",
      clock : Date(),
      stack : 50,
      hand : [],
      position : "",
      isActive: false,
      folded: false,
      marker: false,
      bet: 0
    },
      {
      username: "user6",
      clock : Date(),
      stack : 50,
      hand : [],
      position : "Dealer",
      isActive: false,
      folded: false,
      marker: false,
      bet: 0
      },
      {
      username: "user7",
      clock : Date(),
      stack : 50,
      hand : [],
      position : "Small Blind",
      isActive: false,
      folded: false,
      marker: false,
      bet: 0
      },
      {
      username: "user8",
      clock : Date(),
      stack : 50,
      hand : [],
      position : "Big Blind",
      isActive: false,
      folded: false,
      marker: true,
      bet: 0
      }


    ]


    this.state = {
      users: users,
      deck : deck,
      flop: [],
      turn: [],
      river: [],
      phase: "preflop",
      pot: 0,
      fold: [],
      raiseValue: 0
    }
  



  }


  deal(){
    var newUsers = [];
    var NewDeck = generateNewDeck()
    // Copies old user array to newUsers
    for (var i = 0; i < this.state.users.length; i++){
      newUsers.push(Object.assign({}, this.state.users[i]))
      newUsers[i].hand = [NewDeck.pop(), NewDeck.pop()]
      if (newUsers[i].position === "Big Blind"){
       newUsers[i].stack = newUsers[i].stack - 1
       newUsers[i].bet = newUsers[i].bet + 1
        this.state.pot = this.state.pot + 1
      }
      if (newUsers[i].position === "Small Blind"){
       newUsers[i].stack = newUsers[i].stack - .5
       newUsers[i].bet = newUsers[i].bet + .5
        this.state.pot = this.state.pot + .5
      }
    }



    this.setState({
      users: newUsers,
      deck: NewDeck

    });
  }



  nextTurn(newUsers, preventsPhaseChange){
       
       var newPhase = this.state.phase
       var newActive = 0
       var oldActive = 0
       
   
    for (var i = 0; i < newUsers.length; i++){
      
        if (newUsers[i].isActive == true){
         newUsers[i].isActive = false 
         oldActive = i
        
         newActive = i + 1 
        }

         if (newActive == this.state.users.length){
          newActive = 0;
         }
         
      }
      while(newUsers[newActive].folded == true){
        newActive++
      }
      newUsers[newActive].isActive = true
      
      if(newUsers[oldActive].marker == true && preventsPhaseChange == false) {
        
        if(this.state.phase == "preflop"){
          this.flop()
          newPhase = "flop"
         
      
         }
        if(this.state.phase == "flop"){
          this.turn()
          newPhase = "turn"
          
         
        }
         if(this.state.phase == "turn"){
          this.river()
          newPhase = "river"
          
          
        } 
      }
    

      this.setState({
        users: newUsers, 
        phase: newPhase
        });
    


  }

  call(){
      
       var newUsers = []
       var marker = []
       var caller = []



      for (var i = 0; i < this.state.users.length; i++){
        newUsers.push(Object.assign({}, this.state.users[i]))
    
        if (newUsers[i].marker == true){
          marker = newUsers[i]
        }
        if(newUsers[i].isActive == true){
          caller = newUsers[i]
        }

    } 
        

        caller.bet = marker.bet
        this.state.pot = this.state.pot + caller.bet
        caller.stack = caller.stack - caller.bet




          
          this.nextTurn(newUsers, false)
}


  check(){
        
       var newUsers = []
     
       for (var i = 0; i < this.state.users.length; i++){
        newUsers.push(Object.assign({}, this.state.users[i]))

       }
       this.nextTurn(newUsers, false)
}

  raise(){
 
   var newUsers = []
   var raiser = []
   
    for (var i = 0; i < this.state.users.length; i++){
        newUsers.push(Object.assign({}, this.state.users[i]))
        if (newUsers[i].marker == true){
          newUsers[i].marker = false;
        }
        if (newUsers[i].isActive == true){
        
         newUsers[i].marker = true;
         raiser = newUsers[i]

         } 

         this.state.pot = this.state.pot + this.props.raiseValue
         raiser.stack = raiser.stack - this.props.raiseValue
        }
        
      
      this.setState({
        
        users: newUsers
       
      })

    this.nextTurn(newUsers, true)

  }

    handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

   handleChange(event) {
    this.setState({raiseValue: event.target.value});
  }


  fold(){

   
   var newActive = []
   var newUsers = []
   var fold = []
   
   
    for (var i = 0; i < this.state.users.length; i++){
        newUsers.push(Object.assign({}, this.state.users[i]))
        if (newUsers[i].isActive === true){
         newUsers[i].folded = true;
      }
        if (newUsers[i].folded === true){
        fold.push(newUsers[i])
        this.state.fold = fold
        
       }  
     }
        
        for (var i = 0; i < newUsers.length; i++){
          if (newUsers.length - this.state.fold.length === 1){
            if (newUsers[i].folded == false){
              var winner = newUsers[i]
              winner.stack = this.state.pot + winner.stack 
              this.state.fold = []
          // if (newUsers[i].folded == false){
          //     newUsers[i].stack = this.state.pot + newUsers[i].stack 
                this.setState({
                   users: newUsers
                  })
                alert(winner.username + " wins " + "$ " + this.state.pot);
                  break;
                  }
                 
        }
      
     }

      this.nextTurn(newUsers, false)
      

      
    }
       
      
  

  flop(){
       var newActive = 0
       var oldActive = 0
     
     for (var i = 0; i < this.state.users.length; i++){
        newUsers.push(Object.assign({}, this.state.users[i]))
        
        oldActive = i
        newActive = i + 1 


    }


    this.setState({

        users: newUsers
        flop: [this.state.deck.pop(), this.state.deck.pop(), this.state.deck.pop()]
      
    })
  }

  turn(){
    this.setState({
     
        turn: [this.state.deck.pop()]
      
    })
  }

  river(){
    this.setState({
     
        river: [this.state.deck.pop()]
      
    })
  }


  render() {
  
 
    return (
      <div className="App">

        <Image />

        <Table players={this.state.users}
               flop={this.state.flop}
               turn={this.state.turn}
               river={this.state.river}
               phase={this.state.phase}
               pot = {this.state.pot}/>


        
        <Options  deal={this.deal.bind(this)}
                  call ={this.call.bind(this)}
                  fold={this.fold.bind(this)}
                  check={this.check.bind(this)}
                  form={this.handleSubmit.bind(this)}/>
      

      </div>
    );
  }
}

export default App;
