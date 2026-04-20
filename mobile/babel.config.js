
//This file tells Expo how to compile our code.

module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
       // plugins: ["react-native-reanimated/plugin"], // for reanimated plugin
    };
};
