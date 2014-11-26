define(["models/common/base.model"], function (BaseModel) {
	"use strict";

	/**
	 * Maintain state for the header view
	 */
	var HeaderModel = BaseModel.extend({
		defaults: {
			searchTerm: '',
			isDomainSecure: false,
			isUserSignedIn: false,
			signInUser: ""
		},
		toggle: function (attr) {
			if (this.get(attr) === false) {
				this.set(attr, true);

			} else {
				this.set(attr, false);
			}
		}
	});

	return HeaderModel;

});




