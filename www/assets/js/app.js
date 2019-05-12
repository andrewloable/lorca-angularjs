// Main Angular
angular.module('lorca-angularjs',['ngMaterial', 'ngMessages', 'ngRoute', 'ngSanitize', 'md.data.table', 'ui.bootstrap']);
// Config Theme
angular.module('lorca-angularjs')
.config(["$mdThemingProvider", "$interpolateProvider", function($mdThemingProvider, $interpolateProvider){
    $mdThemingProvider.theme('default')
        .primaryPalette('red')
        .accentPalette('amber')
        .warnPalette('orange')
        .backgroundPalette('grey');
}]);
// Encryption Service
angular.module('lorca-angularjs')
.factory('store', ["$window", function($window){
    var store = {};

    var key_256 = [110, 142, 242, 23, 114, 35, 56, 67, 98, 91, 110, 111, 112, 113, 14, 1,
        6, 117, 218, 1, 20, 221, 2, 123, 4, 125, 226, 27, 128,
        29, 130, 1];

    store.encrypt = function(plainText){
        var bytes = aesjs.utils.utf8.toBytes(plainText);
        var aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(1));
        var encryptedBytes = aesCtr.encrypt(bytes);
        var retval = aesjs.utils.hex.fromBytes(encryptedBytes);
        return retval;
    };

    store.decrypt = function(cryptText){
        var encryptedBytes = aesjs.utils.hex.toBytes(cryptText);
        var aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(1));
        var decryptedBytes = aesCtr.decrypt(encryptedBytes);
        var retval = aesjs.utils.utf8.fromBytes(decryptedBytes);
        return retval;
    };

    store.set = function(hash, obj){
        $window.localStorage.removeItem(hash);
        if (obj){
            $window.localStorage.setItem(hash, store.encrypt(JSON.stringify(obj)));
        }
    };

    store.get = function(hash){
        var obj = $window.localStorage.getItem(hash);
        if (obj){
            var retval = store.decrypt(obj);
            if (!retval || angular.equals(retval, {})){
                return undefined;
            } else {
                return JSON.parse(retval);
            }
        }        
    };

    return store;
}]);