'Version 10 - UpDown doesnt capture the frequency of passengers pressing the up or down button
if on a floor the up button already pressed, people are not going to press it again. therefore cant use updown as an indicator

    solution: since elevator and floor object dont have a way to track how many ppl are on a floor. we just make it
simple, if the elevator is currently near top , go to top and go down, and vice versa. 
    Version 10 removed UpDown, added stopped_at_floor event

    BENCHMARK Challenge 5 - 
    Transported 101 ppl 
    Elapsed Time 67 sec
    Transported/s 1.5 
    Avg Waiting Time 7.1s
    Max Waiting Time 14.3
    Moves 163

    COUDLNT COMPLETE Challenge 13
'

     {
        init: function(elevators, floors) {
            debugger;

            var DownQueue = [];
            var UpQueue = [];
 
            var TopFloor = floors.length - 1;

            elevators.forEach(function(elevator){
                var ElevatorNum = elevators.indexOf(elevator);
            
                elevator.on("idle", function() {

                    if(DownQueue.length>0){
                        elevator.goToFloor(DownQueue[0])                                                
                        elevator.goingUpIndicator(false);
                        elevator.goingDownIndicator(true);
                        RemoveFloorFromQueue(elevator, DownQueue[0]);
                    }
                    else if (UpQueue.length>0) {
                        elevator.goToFloor(UpQueue[0])                                                
                        elevator.goingUpIndicator(true);
                        elevator.goingDownIndicator(false);
                        RemoveFloorFromQueue(elevator, UpQueue[0]);
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
  
                    if(elevator.loadFactor() < .6){                    //only do if elevator is not full. 
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
                
                elevator.on("stopped_at_floor",function(floorNum){
                    //Special case, if floorNum is either top or bottom, they have to change indicators. 
                    if(floorNum == 0){
                        elevator.goingUpIndicator(true);
                        elevator.goingDownIndicator(false);
                    }
                    else if (floorNum == TopFloor){
                        elevator.goingUpIndicator(false);
                        elevator.goingDownIndicator(true);
                    }
                })

                //This is for people inside the elevator pressing the button. 
                elevator.on("floor_button_pressed",function(floorNum){          
                    
                    if(contains(elevator.destinationQueue, floorNum) == false){
                        elevator.destinationQueue.push(floorNum);                       
                        SortDestinationQueue(ElevatorNum, elevator);
                    }                                       
                    console.log(ElevatorNum + "'s new destination queue is " + elevator.destinationQueue );
                    RemoveFloorFromQueue(elevator,elevator.currentFloor()) //remove from the Upqueue and downqueue. not from the destination queue. 

                });
            });
            
            floors.forEach(function(f){
                var floorNum = floors.indexOf(f);
                f.on("up_button_pressed", function(){                                            
                        UpQueue.push(floorNum);
                        UpQueue.sort()
                    console.log("Floors with up button pressed Up Queue are " + UpQueue);
                   
                })

                f.on("down_button_pressed", function(){                      
                        DownQueue.push(floorNum);
                        DownQueue.sort(function(a,b){return b-a});
                    console.log("Floors with down button pressed Down Queue are " + DownQueue);                  
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
                if(e.goingUpIndicator()){
                    e.destinationQueue.sort()
                }
                else{
                    e.destinationQueue.sort(function(a,b){return b-a});
                }   
                    e.checkDestinationQueue();
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

