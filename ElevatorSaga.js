'can read through the doc.
http://play.elevatorsaga.com/documentation.html


the code below did not work for http://play.elevatorsaga.com/#challenge=2'
'version 1'
    {
        init: function(elevators, floors) {
            var elevator = elevators[0]; // Let's use the first elevator

            // Whenever the elevator is idle (has no more queued destinations) ...
            elevator.on("idle", function() {
                elevator.goToFloor(0);
                elevator.goToFloor(1);
                elevator.goToFloor(2);
                elevator.goToFloor(3);
                elevator.goToFloor(4);
            });
        },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
    }

'version 2.
Things to note: elevator does not need to go to every floor. only to the destination one.
if its going up and on the way other people are going up, then stop, otherwise continue to the destination.
	improvement 1 -> only go to the floor desired
 '
     {
        init: function(elevators, floors) {
        	console.log("Hello, world! " );
            var elevator = elevators[0]; // Let's use the first elevator

            // Whenever the elevator is idle (has no more queued destinations) ...
            elevator.on("idle", function() {
                elevator.goToFloor(0);
            });
        
            elevator.on("floor_button_pressed",function(floorNum){
            	elevator.goToFloor(floorNum);
            });


        },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
    }

'version 3.
Things to note: version 2"s elevator on idle just goes to 0 floor. therefore people queuing to go down had to wait. 
	improve -> on idle. check if people are going down, then go to that floor instead of going straight to 0. 
 '
     {
        init: function(elevators, floors) {
        	console.log("Hello, world! " );
            var elevator = elevators[0]; // Let's use the first elevator

            var DownQueue = [];
            for(var x = 0; x < floors.length; x++){
            	var floor = floors[x];
            	floor.on("down_button_pressed", function(){
            		DownQueue.push(floor.floorNum());
            	});
            };

            console.log("initial queue is " + DownQueue);

            // Whenever the elevator is idle (has no more queued destinations) ...
            elevator.on("idle", function() {
                
                console.log("Currently Queue is **** ");
                console.log(DownQueue);
                console.log("*****");
                if(DownQueue.length>0){
    				elevator.goToFloor(DownQueue[0])
    				DownQueue.pop();
                }
                else{
                	elevator.goToFloor(0);
                }

            });
        	
        	//This is for people inside the elevator pressing the button. 
            elevator.on("floor_button_pressed",function(floorNum){
            	elevator.goToFloor(floorNum);
            });


        },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
    }

'version 4.
Things to note: version 3"s elevator DownQueue gets repeatly stacked, 
	improve -> on idle. if DownQueue already has the number , then dont push more numbers there. 
            -> also added a debugger that breaks at that point, so we can debug easily.
 '
     {
        init: function(elevators, floors) {
        	console.log("Hello, world! " );
            debugger;
            var elevator = elevators[0]; // Let's use the first elevator
            var DownQueue = [];

            
            // Whenever the elevator is idle (has no more queued destinations) ...
            elevator.on("idle", function() {
                
                CheckDownQueue(floors);         //this loads the DownQueue array. 
                //PrintStatus(elevator,floors);

                if(DownQueue.length>0){
    				elevator.goToFloor(DownQueue[0])
    				DownQueue.shift();
                }
                else{
                	elevator.goToFloor(0);
                }

            });
        	
        	//This is for people inside the elevator pressing the button. 
            elevator.on("floor_button_pressed",function(floorNum){        	
                elevator.goToFloor(floorNum);
            });

            function CheckDownQueue(tempFloors){
                
                //loop through the floors, see if there are people
                //queuing for going down. 

                tempFloors.forEach(function(f){                
                    f.on("down_button_pressed", function(){             
                        var y = f.floorNum();
                        console.log("Down button pressed at " + y);
                        if (contains(DownQueue,y) == false){                        
                            DownQueue.push(y);   
                        };
                    });
                });
                    
                console.log("****New Downqueue is****");
                console.log(DownQueue);
                console.log("****");

            }

    		function contains(a, obj) {
    		    for (var i = 0; i < a.length; i++) {
    		        if (a[i] === obj) {
    		            return true;
    		        }
    		    }
    		    return false;
    		}

            function PrintStatus(e, f){
                console.log("****Elevator Currently going to these floors**** ");
                console.log(e.checkDestinationQueue());
            }
        },

        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
    }

'version 5
Things to note: version 4"s downqueue should be removed after the elevator has gone to that floor
    improve -> rather than shift the first item, shift the item that the elevator will go to. representing it is visting there. 
    -> the DownQueue should be ordered either ascending or descending. 
'
     {
        init: function(elevators, floors) {
            console.log("Hello, world! " );
            debugger;
            var elevator = elevators[0]; // Let's use the first elevator
            var DownQueue = [];

            
            // Whenever the elevator is idle (has no more queued destinations) ...
            elevator.on("idle", function() {
                
                CheckDownQueue(floors);         //this loads the DownQueue array. 
                if(DownQueue.length>0){
                    elevator.goToFloor(DownQueue[0])
                    DownQueue.shift();
                }
                else{
                    elevator.goToFloor(0);
                }

            });
            
            //This is for people inside the elevator pressing the button. 
            elevator.on("floor_button_pressed",function(floorNum){          
                elevator.goToFloor(floorNum);
                //version 5, find the floorNum in the downqueue, then remove it.
                var index = DownQueue.indexOf(floorNum);
                if (index > -1){
                    DownQueue.splice(index, 1);
                    console.log("going to floor ");
                    console.log(floorNum);
                    console.log("therefore, new DownQueue is ");
                    console.log(DownQueue);
                };
            });

            function CheckDownQueue(tempFloors){
                
                //loop through the floors, see if there are people
                //queuing for going down. 

                tempFloors.forEach(function(f){                
                    var y = f.floorNum();
                    console.log("Called CheckDownQueue checking Floor " + y );
                    f.on("down_button_pressed", function(){             
                        
                        console.log("Down button pressed at " + y);
                        if (contains(DownQueue,y) == false){                        
                            DownQueue.push(y);
                            DownQueue.sort();   
                        };
                    });
                });
                    
                console.log("****New Downqueue is****");
                console.log(DownQueue);
                console.log("****");

            }

            function contains(a, obj) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i] === obj) {
                        return true;
                    }
                }
                return false;
            }

        },

        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
    }

'version 6
Things to note: version 5" was only for one elevator, now incorporate a loop for multiple
    improve-> loop for multiple elevators. 
    this script did challenge 5 transported 100 in 67 sec. 
    '
     {
        init: function(elevators, floors) {
            debugger;
            var DownQueue = [];

            elevators.forEach(function(elevator){
                var ElevatorNum = elevators.indexOf(elevator);
                console.log("looping through elevator " + ElevatorNum);
                // Whenever the elevator is idle (has no more queued destinations) ...
                elevator.on("idle", function() {
                    
                    CheckDownQueue(floors);         //this loads the DownQueue array. 
                    if(DownQueue.length>0){
                        elevator.goToFloor(DownQueue[0])
                        DownQueue.shift();
                    }
                    else{
                        elevator.goToFloor(0);
                    }
                });
                
                //This is for people inside the elevator pressing the button. 
                elevator.on("floor_button_pressed",function(floorNum){          
                    elevator.goToFloor(floorNum);
                    //version 5, find the floorNum in the downqueue, then remove it.
                    var index = DownQueue.indexOf(floorNum);
                    if (index > -1){
                        DownQueue.splice(index, 1);
                        console.log("elevator " + ElevatorNum + " going to floor ");
                        console.log(floorNum);
                        console.log("therefore, new DownQueue is ");
                        console.log(DownQueue);
                    };
                });
            });


            function CheckDownQueue(tempFloors){
                
                //loop through the floors, see if there are people
                //queuing for going down. 

                tempFloors.forEach(function(f){                
                    var y = f.floorNum();
                    console.log("Called CheckDownQueue checking Floor " + y );
                    f.on("down_button_pressed", function(){             
                        
                        console.log("Down button pressed at " + y);
                        if (contains(DownQueue,y) == false){                        
                            DownQueue.push(y);
                            DownQueue.sort();   
                        };
                    });
                });
                    
                console.log("****New Downqueue is****");
                console.log(DownQueue);
                console.log("****");
            }

            function contains(a, obj) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i] === obj) {
                        return true;
                    }
                }
                return false;
            }

        },

        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
    }

'version 7
    improve-> 

    planning to do-> a down queue, and up queue, and a destination queue.
    if e. is going up and theres floor waiting in the up queue greater than its number, then it will stop there to load
    if e is going down and theres floor waiting in the down queue lower than its number, then it will stop and load. 

        still only 100 in 67 sec. for challenge 5
    '
     {
        init: function(elevators, floors) {
            debugger;

            var DownQueue = [];
            var UpQueue = [];

            elevators.forEach(function(elevator){
                var ElevatorNum = elevators.indexOf(elevator);
                console.log("looping through elevator " + ElevatorNum);
                // Whenever the elevator is idle (has no more queued destinations) ...
                elevator.on("idle", function() {
                    
                    if(DownQueue.length>0){
                        elevator.goToFloor(DownQueue[0])
                        DownQueue.shift();
                        elevator.goingDownIndicator();
                    }
                    else if (UpQueue.length>0) {
                        elevator.goToFloor(UpQueue[0])
                        UpQueue.shift();
                        elevator.goingUpIndicator();
                    }
                    else{
                        elevator.goToFloor(0);
                    }
                });
                

                //This is for people inside the elevator pressing the button. 
                elevator.on("floor_button_pressed",function(floorNum){          
                    elevator.goToFloor(floorNum);
                    SortDestinationQueue(ElevatorNum, elevator);
                    var index = DownQueue.indexOf(floorNum);
                    if (index > -1){
                        DownQueue.splice(index, 1);
                        console.log("elevator " + ElevatorNum + " going to floor " + floorNum);
                        console.log("therefore, new DownQueue is " + DownQueue);                        
                    };
                });
            });
            
            floors.forEach(function(f){
                var floorNum = floors.indexOf(f);
                f.on("up_button_pressed", function(){
                    if (contains(UpQueue,floorNum) == false){                        
                        UpQueue.push(floorNum);
                        //UpQueue.sort();   
                    };
                })

                f.on("down_button_pressed", function(){
                    if (contains(DownQueue,floorNum) == false){                        
                        DownQueue.push(floorNum);
                        //DownQueue.sort();   
                    };
                })
            })

            function SortDestinationQueue(eNum ,e, destination){

                if(e.goingUpIndicator()){
                    //e.destinationQueue.sort()
                }
                else{
                    //e.destinationQueue.sort(function(a,b){return b-a});
                }   
                    e.checkDestinationQueue();
                    console.log(eNum + "'s current queue is " + e.destinationQueue);
                    console.log("****")

            }


            function contains(a, obj) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i] === obj) {
                        return true;
                    }
                }
                return false;
            }

        },

        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
    }

'version 8
    -to work on. only loading passengers thats going in the direction the e is going, otherwise dont load.
    changes: - elevator in idle now compares whether which queue is longer, down or up, and go appropriately. 
             - incorporate passing_floor event. when elevator is passing a floor, check whether theres passengers
                there going the same direction. if so, then load them. 

'
     {
        init: function(elevators, floors) {
            debugger;

            var DownQueue = [];
            var UpQueue = [];

            elevators.forEach(function(elevator){
                var ElevatorNum = elevators.indexOf(elevator);
            
                elevator.on("idle", function() {

                    if(DownQueue.length>= UpQueue.length && DownQueue.length>0){
                        elevator.goToFloor(DownQueue[0])
                        DownQueue.shift();
                        elevator.goingUpIndicator(false);
                        elevator.goingDownIndicator(true);
                    }
                    else if (UpQueue.length> DownQueue.length && UpQueue.length>0) {
                        elevator.goToFloor(UpQueue[0])
                        UpQueue.shift();
                        elevator.goingUpIndicator(true);
                        elevator.goingDownIndicator(false);
                    }
                    else{
                        elevator.goToFloor(0);
                        elevator.goingUpIndicator(true);
                        elevator.goingDownIndicator(false);
                    }
                });
                

                elevator.on("passing_floor", function(floorNum,direction) {
                    //console.log(ElevatorNum + " is passing " + floorNum + " and going " + direction);
                    //check if there's passenger in the incoming floor going to the same direction
                    //if so, pick them up as well
                    if(elevator.goingUpIndicator()){
                        if(contains(UpQueue,floorNum)){
                            elevator.goToFloor(floorNum);
                            RemoveFloorFromQueue(elevator,floorNum)
                        }
                    }
                    else{
                        if(contains(DownQueue,floorNum)){
                            elevator.goToFloor(floorNum);
                            RemoveFloorFromQueue(elevator,floorNum)
                        }
                    }

                });

                //This is for people inside the elevator pressing the button. 
                elevator.on("floor_button_pressed",function(floorNum){          
                    
                    if(contains(elevator.destinationQueue, floorNum) == false){
                        elevator.destinationQueue.push(floorNum);                       
                    }                                        
                    SortDestinationQueue(ElevatorNum, elevator);                    
                    elevator.goToFloor(elevator.destinationQueue[0]); //changed the location here. 
                    console.log(ElevatorNum + "'s new destination queue is " + elevator.destinationQueue + " and heading to " + floorNum);
                    if(elevator.destinationQueue.length > 0){
                        elevator.destinationQueue.shift();
                        elevator.checkDestinationQueue();                        
                    };
                    RemoveFloorFromQueue(elevator,floorNum) //remove from the Upqueue and downqueue. not from the destination queue. 

                });
            });
            
            floors.forEach(function(f){
                var floorNum = floors.indexOf(f);
                f.on("up_button_pressed", function(){
                    if (contains(UpQueue,floorNum) == false){                        
                        UpQueue.push(floorNum);
                    };
                })

                f.on("down_button_pressed", function(){
                    if (contains(DownQueue,floorNum) == false){                        
                        DownQueue.push(floorNum);
                    };
                })
            })

            //Called when elev. is getting new passengers 
            //remove that floor from the DownQueue and UpQueue.
            function RemoveFloorFromQueue(elevator,floor){
                if(elevator.goingUpIndicator()){
                    a = UpQueue;
                }
                else{
                    a = DownQueue;
                }
                var index = a.indexOf(floor);
                if (index > -1){
                    a.splice(index, 1);                    
                };

            }

            //This orders the elevator's destination queue correctly.
            function SortDestinationQueue(eNum ,e, newFloor){
                console.log(eNum + "'s original queue before sort" + e.destinationQueue);
                if(e.goingUpIndicator()){
                    e.destinationQueue.sort()
                }
                else{
                    e.destinationQueue.sort(function(a,b){return b-a});
                }   
                    e.checkDestinationQueue();
                    console.log(eNum + "'s current queue is " + e.destinationQueue);
                    console.log("****")

            }

            function contains(a, obj) {
                try{
                    for (var i = 0; i < a.length; i++) {
                        if (a[i] === obj) {
                            return true;
                        }
                    }
                    return false;            
                }
                
                catch(err){
                    return false;
                }

            }

        },

        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
    }


'Version 9  -need to add a checker to see if elevator is full. if is, then dont even go do checking floors. 
            -need to also have a execute command on being idle on either the top or the lowest. if the e is there. they 
            have to pick up.  

            improvments done on this version -> added UpDown counter to determine which to prioritize.
            -> smarten the passing floor event. the incoming floor will supercede the other floors. 
            -> smarten the floor_button_pressed event. now, the RemoveFloorFromQueue removes the elevator"s current floor
                not the future floor from the queue. 
            '

     {
        init: function(elevators, floors) {
            debugger;

            var DownQueue = [];
            var UpQueue = [];
            var UpDown = 0; // used to determine if the e should go up or down. up if > 0, down if <= 0
                              // populate by every button pressed, and populate the other way if button is pressed. 

            elevators.forEach(function(elevator){
                var ElevatorNum = elevators.indexOf(elevator);
            
                elevator.on("idle", function() {

                    if(UpDown <= 0 && DownQueue.length>0){
                        elevator.goToFloor(DownQueue[0])
                        RemoveFloorFromQueue(elevator, DownQueue[0]);                        
                        elevator.goingUpIndicator(false);
                        elevator.goingDownIndicator(true);
                    }
                    else if (UpDown > 0 && UpQueue.length>0) {
                        elevator.goToFloor(UpQueue[0])
                        RemoveFloorFromQueue(elevator, UpQueue[0]);                        
                        elevator.goingUpIndicator(true);
                        elevator.goingDownIndicator(false);
                    }
                    else{
                        elevator.goToFloor(0);
                        elevator.goingUpIndicator(true);
                        elevator.goingDownIndicator(false);
                    }
                });
                

                elevator.on("passing_floor", function(floorNum,direction) {
                    //check if there's passenger in the incoming floor going to the same direction
                    //if so, pick them up as well
  
                    if(elevator.loadFactor() < 1){                    //only do if elevator is not full. 
                        if(elevator.goingUpIndicator()){
                            if(contains(UpQueue,floorNum)){
                                elevator.goToFloor(floorNum, true);   //adding the parameter true bumps the number infront. acheiving our effect. 
                                RemoveFloorFromQueue(elevator,floorNum);
                            }
                        }
                        else{
                            if(contains(DownQueue,floorNum)){
                                elevator.goToFloor(floorNum, true);
                                RemoveFloorFromQueue(elevator,floorNum)
                            }
                        }
                    }

                });

                //This is for people inside the elevator pressing the button. 
                elevator.on("floor_button_pressed",function(floorNum){          
                    
                    if(contains(elevator.destinationQueue, floorNum) == false){
                        elevator.destinationQueue.push(floorNum);                       
                        SortDestinationQueue(ElevatorNum, elevator);
                    }                                       
                                        
                    //elevator.goToFloor(elevator.destinationQueue[0]); //dont need this, elevator already going to the first # in the destination queue
                    console.log(ElevatorNum + "'s new destination queue is " + elevator.destinationQueue );
                    //if(elevator.destinationQueue.length > 0){
                    //    elevator.destinationQueue.shift();
                    //    elevator.checkDestinationQueue();                        
                    //};
                    //shoudl be removing the elevators current floor from the queue, not its going floor
                    RemoveFloorFromQueue(elevator,elevator.currentFloor()) //remove from the Upqueue and downqueue. not from the destination queue. 

                });
            });
            
            floors.forEach(function(f){
                var floorNum = floors.indexOf(f);
                f.on("up_button_pressed", function(){
                    if (contains(UpQueue,floorNum) == false){                        
                        UpQueue.push(floorNum);
                        UpQueue.sort()
                    };
                    console.log("Floors with up button pressed Up Queue are " + UpQueue);
                })

                f.on("down_button_pressed", function(){
                    if (contains(DownQueue,floorNum) == false){                        
                        DownQueue.push(floorNum);
                        DownQueue.sort(function(a,b){return b-a});
                    };
                    console.log("Floors with down button pressed Down Queue are " + DownQueue);
                })
            })

            //Called when elev. is getting new passengers 
            //remove that floor from the DownQueue and UpQueue.
            function RemoveFloorFromQueue(elevator,floor){
                if(elevator.goingUpIndicator()){
                    a = UpQueue;
                    UpDown--;
                }
                else{
                    a = DownQueue;
                    UpDown++;
                }
                var index = a.indexOf(floor);
                if (index > -1){
                    a.splice(index, 1);                    
                };

            }

            //This orders the elevator's destination queue correctly.
            function SortDestinationQueue(eNum ,e, newFloor){
                //console.log(eNum + "'s original queue before sort " + e.destinationQueue);
                if(e.goingUpIndicator()){
                    e.destinationQueue.sort()
                }
                else{
                    e.destinationQueue.sort(function(a,b){return b-a});
                }   
                    e.checkDestinationQueue();
                    //console.log(eNum + "'s current queue is " + e.destinationQueue);
                    //console.log("****")

            }

            function contains(a, obj) {
                try{
                    for (var i = 0; i < a.length; i++) {
                        if (a[i] === obj) {
                            return true;
                        }
                    }
                    return false;            
                }
                
                catch(err){
                    return false;
                }

            }

        },

        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
    }
