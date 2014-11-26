define(["models/common/base.model"],function(Model){

    var FooterModel = Model.extend({

        constructor: function FooterModel() {
            Model.prototype.constructor.apply(this, arguments);
        },

        defaults:{
           copyRightText:"&copy; 2014 seva brands, inc.",
           primaryLinks:[{href:"http://www.seva.com/?force-full-site=1&full-site-confirm",text:"Full Site"},
               {href:"/spot/specialty-pages",text:"Specialty Pages"},
               {href:"/store-locator/state-list",text:"Stores"},
               {href:"https://corporate.seva.com/careers/",text:"Careers"}],
            secondaryLinks:[{href:"/spot/terms/main",text:"Terms"},
                {href:"/spot/terms/privacy-policy",text:"privacy policy"},
                {href:"/spot/terms/privacy-policy#CaliforniaResidents",text:"california privacy rights"}]
        }

    });

    return new FooterModel();
})