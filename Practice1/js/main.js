
/*
	----------------- NOTES -----------------
	
	* Since data-binding frameworks are not allowed, I've used jQuery event listeners. I decided for now not to use any Observer implementations. I hope thats OK.
	* Patterns used are Modules\MVVM.
	* Currently the calculator will calculate only if there are values in both inputs.
	* Bootstrap is added (CDN)
*/


var App = (function (app, $) {
    "use strict";

    app.Calculator = function () {
        var config = {
            operationsSelect: "#operations",
			inputOne: "#input-one",
			inputTwo: "#input-two",
			result: "#result"
        };

        var viewModel = {
			selectedMode: "standard",				//Selected calculator mode
			selectedOperationId: "plus",			//Selected calculator operation
			inputOne: null,							//First input variable
			inputTwo: null,							//Second input variable
			result: null, 							//Calculation result
			
			//-- Operations, if more are needed they will be added here.
			basicOperations: [ new arithmeticOperation("plus","+"), new arithmeticOperation("minus","-"), new arithmeticOperation("mult","*"), new arithmeticOperation("div","/")],
			scientificOperations: [ new arithmeticOperation("power","x ^ y"), new arithmeticOperation("root","x root y")],
			programmerOperations: [ new arithmeticOperation("mod","x mod y")],
			//--
			
			rebuildOperations: function(){
				$(config.operationsSelect).empty();
				
				//Always add the basic operations
				viewModel.addSelectOptions(viewModel.basicOperations, config.operationsSelect);

				if (viewModel.selectedMode === "scientific")
					viewModel.addSelectOptions(viewModel.scientificOperations, config.operationsSelect);
				else if (viewModel.selectedMode === "programmer")
					viewModel.addSelectOptions(viewModel.programmerOperations, config.operationsSelect);
			},
			
			addSelectOptions: function(options, target){
				$.each(options, function(key, value) {   
					 $(target)
						 .append($("<option></option>")
									.attr("value", value.id)
									.text(value.text)); 
				});
			},
			
			//Calculates the result and places in the result container.
			calculate: function(){
				var selectedOperationId = viewModel.selectedOperationId;
				var inputOne = viewModel.inputOne;
				var inputTwo = viewModel.inputTwo;
				
				if (!inputOne || !inputTwo)
					return;
				
				var result;
				switch(selectedOperationId) {
					case "plus":
						result = +inputOne + +inputTwo;
						break;
					case "minus":
						result = +inputOne - +inputTwo;
						break;
					case "mult":
						result = +inputOne * +inputTwo;
						break;
					case "div":
						result = +inputOne / +inputTwo;
						break;
					case "power":
						result = Math.pow(inputOne, inputTwo);
						break;
					case "root":
						result = Math.pow(inputOne, 1/inputTwo);;
						break;
					case "mod":
						result = inputOne % inputTwo;
						break;
				}
				
				viewModel.result = result;
				$(config.result).text(result);
			},
			
			//Resets inputs
			resetInputs: function(){
				viewModel.inputOne = null;
				viewModel.inputTwo = null;
				viewModel.result = null;
				$(config.inputOne).val('');
				$(config.inputTwo).val('');
				$(config.result).empty();
			}
		}

        return {
            viewModel: viewModel,
			config: config,
            init: function () {
				
				//Build basic operations
				viewModel.rebuildOperations();
				
				//Attach event handler for select change
				$(config.operationsSelect).change(function(){
					var selectedOperationId = $(this).val();
					viewModel.selectedOperationId = selectedOperationId;
					viewModel.calculate();
				});
				
				//Attach event handler for first input change
				$(config.inputOne).on('input', function(){
					var inputOne = $(this).val();
					viewModel.inputOne = inputOne;
					viewModel.calculate();
				});
					
				//Attach event handler for second input change
				$(config.inputTwo).on('input', function(){
					var inputTwo = $(this).val();
					viewModel.inputTwo = inputTwo;
					viewModel.calculate();
				});
				
				//Attach event handler for radio button change (mode)
				 $('input[type=radio][name=mode]').change(function() {
					viewModel.resetInputs();
					 
					var selectedMode = $(this).val();
					viewModel.selectedMode = selectedMode;
					viewModel.rebuildOperations();
				});
            },
        };
    };

    return app;
}(App || {}, jQuery));
