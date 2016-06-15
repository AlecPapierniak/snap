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

		this.monthlyIncome = ko.observable().extend({
			//required: true,
			number: true,
			min: 0
		});

		this.peopleInHousehold = ko.observable(2).extend({
			number: true,
			min: 1
		});

		this.snapMaximumAllotment = ko.pureComputed({
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

		this.adjustedSnapBenefits = ko.pureComputed({
			read: function(){

					if (this.monthlyIncome() >= 0){
						var benefits = (self.snapMaximumAllotment() - (this.monthlyIncome() * 0.3));
						benefits = (benefits > 0) ? benefits : 0;
					} else if (this.monthlyIncome() == undefined){
						benefits = self.snapMaximumAllotment();
					}

					return benefits;
			},
			owner: this
		});

		this.formattedMaxBenefits = ko.pureComputed({
			read: function(){
				return formatUsd(self.snapMaximumAllotment());
			},
			owner: this
		});

		this.formattedAdjustedAllotment = ko.pureComputed({
			read: function(){
				return formatUsd(self.adjustedSnapBenefits());
			},
			owner: this
		});
	}

	ko.applyBindings(new viewModel());

	function formatUsd(numericToFormat){
		return '$' + numericToFormat.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
}());
