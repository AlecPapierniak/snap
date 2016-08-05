(function(){
	var snapMaximumAllotmentLookup = {
		1: 194,
		2: 357,
		3: 511,
		4: 649,
		5: 771,
		6: 925,
		7: 1022,
		8: 1169,
		PerAdditionalPerson: 146
	};

	function viewModel(){
		var self = this;

		self.monthlyIncome = ko.observable().extend({
			//required: true,
			number: true,
			min: 0
		});

		self.peopleInHousehold = ko.observable(2).extend({
			number: true,
			min: 1
		});

		self.snapMaximumAllotment = ko.pureComputed({
			read: function(){
				var allotment;

				if (self.peopleInHousehold() > 8){
					var additionPeople = self.peopleInHousehold() - 8;
					allotment = snapMaximumAllotmentLookup[8] + (snapMaximumAllotmentLookup.PerAdditionalPerson * additionPeople);
				} else {
					allotment = snapMaximumAllotmentLookup[self.peopleInHousehold()];
				}

				return allotment;
			}
		});

		self.adjustedSnapBenefits = ko.pureComputed({
			read: function(){

					if (self.monthlyIncome() >= 0){
						var benefits = (self.snapMaximumAllotment() - (self.monthlyIncome() * 0.3));
						benefits = (benefits > 0) ? benefits : 0;
					} else if (self.monthlyIncome() == undefined){
						benefits = self.snapMaximumAllotment();
					}

					return benefits;
			}
		});

		self.formattedMaxBenefits = ko.pureComputed({
			read: function(){
				return formatUsd(self.snapMaximumAllotment());
			}
		});

		self.formattedAdjustedAllotment = ko.pureComputed({
			read: function(){
				return formatUsd(self.adjustedSnapBenefits());
			}
		});
	}

	ko.applyBindings(new viewModel());

	function formatUsd(numericToFormat){
		return '$' + numericToFormat.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
}());
