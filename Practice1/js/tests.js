$(function () {
	var UnitTests = function () {
		var self = this;
		
		self.test1 = function(){
			var calculator = App.Calculator();
			calculator.viewModel.selectedOperationId = "plus";
			calculator.viewModel.inputOne = 5;
			calculator.viewModel.inputTwo = 5;
			
			calculator.viewModel.calculate();
			
			if (calculator.viewModel.result == 10)
				return true;
		}
	}
});