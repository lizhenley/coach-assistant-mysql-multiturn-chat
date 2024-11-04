// Wrapping the whole extension in a JS function 
// (ensures all global variables set in this extension cannot be referenced outside its scope)
(async function(codioIDE, window) {
  
  // Refer to Anthropic's guide on system prompts here: https://docs.anthropic.com/claude/docs/system-prompts
  const systemPrompt = "System Prompt for the LLM goes here"
  
  // register(id: unique button id, name: name of button visible in Coach, function: function to call when button is clicked) 
  codioIDE.coachBot.register("iNeedHelpButton", "I have a question", onButtonPress)

  // function called when I have a question button is pressed
  async function onButtonPress() {
    
    // Function that automatically collects all available context 
    // returns the following object: {guidesPage, assignmentData, files, error}
    const context = await codioIDE.coachBot.getContext()

    // the messages object that will contain the user prompt and/or any assistant responses to be sent to the LLM - will also maintain history
    // Refer to Anthropic's guide on the messages API here: https://docs.anthropic.com/en/api/messages
    let messages = []
    
    while (true) {

      // receive text input from chat
      const input = await codioIDE.coachBot.input()

      // Define your conditions to exit infinte loop 
      if (input == "Thanks") {
        break
      }
    
      // Add user prompt to messages object
      messages.push({
          "role": "user", 
          "content": userPrompt
      })
  
      // Send the API request to the LLM with all prompts and context 
      // Prevent menu: true keeps the loop going until gracefully exited
      const result = await codioIDE.coachBot.ask({
        systemPrompt: systemPrompt,
        messages: messages
      }, {preventMenu: true})

      // Saving assistant response to maintain conversation history as context for next message
      messages.push({"role": "assistant", "content": result.result})

      // Trims message history to last 5 interactions
      if (messages.length > 10) {
        var removedElements = messages.splice(0,2)
      }

    }
    // After loop exit, print custom message and show menu
    codioIDE.coachBot.write("You're welcome! Please feel free to ask any more questions about this course!")
    codioIDE.coachBot.showMenu()
    
  }
// calling the function immediately by passing the required variables
})(window.codioIDE, window)

 

  
  
