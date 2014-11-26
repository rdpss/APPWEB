// Define the module.
define(["require"], function (require) {
        var lazyRequire = {};

        lazyRequire.once = function () {

            var requireOnce = function (dependencies, loadCallback) {
                require(
                    dependencies,
                    function () {

                        loadCallback.apply(null, arguments);
                    });
            };

            // Return the new lazy loader.
            return (requireOnce);

        };
        // Return the module definition.
        return (lazyRequire);
    }
);