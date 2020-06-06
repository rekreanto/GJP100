/*  UTILITY FUNCTIONS FOR EPHEMERAL STATE MACHINE
*   ============================================= 
* The helper functions are designed based on Harels original papaer from 1987 and some 
* adaptations by Henning Sato von Rosen done during GJP100, spring 2020. The adaptations 
* aim to make the machine naturally and readably embeddable into a JavaScript code base, thus 
* obliviating the need for a large state machine library.
*
* TOC
*  1. EPHEMERAL STATE CONSTRUCTOR 
*  2. BEHAVIOUR CONSTRUCTORS
*  3. MODAL CONSTRUCTORS
*
*/


/*******************************
 * EPHEMERAL STATE CONSTRUCTOR *
 *******************************
    *
    * WITH LIFE CYCLE ANLAYSIS 
    *
    */ 

  // Create an *Ephemeral Value* based on the insight that a transiton is not
  // the same as the state function; a state function must be wrapped in SEND
  // in order to work as a state function.
  // Also note that
  // Value(<boundary-actions>)::(<state>)

                                            // EPHEMERAL STATE LIFE CYCLE
                                            // ==========================
const Value = (name) => (...types) =>
    (...entryActions) =>                        // :: <state constructor>
    (...xs) => {                                // ENTERING STATE 
    console.log("=> ", `${name}(${xs.join(', ')})`);             
    let exitActions = entryActions              //   Perform Entry Actions 
                        .map(act => act(...xs));
                                                // ... STATE IS ALIVE ...
    return (stateFunction) => {                 // EXITING STATE
      exitActions                               //  Perform Exit actions    
        .map(act => act(...xs));  
      return stateFunction(...xs);              // GIVE args to the next state funciton
  }                                 
};




/*************************
 * BEHAVIOUR CONSTRUCTOR *
 *************************
    *
    * WITH LIFE CYCLE ANLAYSIS 
    *
    */

// on EVENT creates a *Behaviour* by binding a transiton to en event
// for the duration of a state
// onEVENT supports modals
// a Modal is an ordinary Boundary Action, such as changing the label/icon
// of a button for the duration of a state
//
// onEVENT(<string>)(<elem>)(<transition>, <modal>*)


                                                    // BEHAVIOUR LIFE CYCLE
                                                    // ====================  
const onEVENT = (eventName) => (elem) =>            //
    (transition, ...entryModals) =>                 // :: <behavior>
      (...xs) => {                                  // ON ENTRY:                                    
        elem.removeAttribute('disabled');           //   enable
                                                    //   Establish behaviour
        elem.addEventListener(eventName, transition);
                                                    //   Establish Modals
        let exitModals = entryModals.map(mdl => mdl(elem)(...xs));
                                                    //   BEHAVE until state exits
        return (...ys) => {                         // ON EXIT:  
          elem.setAttribute('disabled',true); ;     //   disable
          elem.removeEventListener(eventName, transition); // Revert behaviour
          exitModals.map(mdl => mdl(...ys));         //   Remove Modals
        }
      } 
   
    // onCLICK(<element>)(<transition>, <modal>*)::(<behaviour>)
    const onCLICK = onEVENT('click');


    // Sends a transition efter a duration
    // If the state exits before timeout, the timer is automatically cleared
    //
    // onTIMEOUT(<duration in ms>)(<transition>)::(<entry state>)->(<exit state>)
    const onTIMEOUT = (duration) => (transition) => (...xs) => { 
      // entry action: set timeout
      let timerId = setTimeout(() => transition(...xs), duration); 
      return (...ys) => {
        // exit action: delete timeout
        clearTimeout(timerId);
      }
    }



/**********************
 * MODAL CONSTRUCTORS *
 **********************
    *
    * WITH LIFE CYCLE ANLAYSIS 
    *
    */

// modalTEXT can be used as a modal MODAL or as a Boundary action
// a modal is given to a behaviour and styles the bound ui elemetn appropriately
// a boundary action is given to an ephemeral value and called upon entry and then uopn exit
//
// Type as a Modal:
//   modalTEXT(<show>)::(<target elem>)(<state args>)(state args)
// Type as a Bounday Action
// modalTEXT(<show>)(<target elem>)::(<state args>)(state args)  
       
const modalTEXT = (show) =>             // :: <modal>
    (elem)  =>                          // :: <boundary action>
    (...xs) => {                        // ENTER modality
      let orig = elem.textContent;       //   Save original modality          
      elem.textContent = show(...xs);    //   Set temporary modality
                                         // ... BE MODAL ...
      return (...ys) => {                // EXIT modality
        elem.textContent = orig;         //   Revert to original modality
      }
    }

  const modalATTR = (attr,val) =>   // :: <modal>
    (elem)  =>                      // :: <boundary action>
    (...xs) => {                    // ENTER modality
      let orig = elem[attr];        //   Save original modality          
      elem[attr] = val;             //   Set temporary modality
                                    // ... BE MODAL ...
      return (...ys) => {           // EXIT modality
        elem[attr] = val; ;         //   Revert to original modality
      }
    }

  const modalTITLE = val => modalATTR('title',val);

  const modalCLASS = (...classes) =>
   (elem)  =>
   (...xs) => {
      // entry action
      elem.classList.add(...classes)
      return (...ys) => {
        //exit action
        elem.classList.remove(...classes)
      }
   }


