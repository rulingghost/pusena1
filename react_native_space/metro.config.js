const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');
const config = getDefaultConfig(__dirname);
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const isSymlink = fs.lstatSync(nodeModulesPath).isSymbolicLink();
const previousResolve = config.resolver.resolveRequest;
const localNotifications = path.resolve(__dirname, 'src/notifications/expoLocal.ts');
const pushStub = path.resolve(__dirname, 'src/notifications/expoPushStub.ts');
const PUSH_BLOCK = /DevicePushTokenAutoRegistration|getExpoPushTokenAsync|getDevicePushTokenAsync/;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'expo-notifications') {
    return { filePath: localNotifications, type: 'sourceFile' };
  }
  if (typeof moduleName === 'string' && moduleName.includes('expo-notifications') && PUSH_BLOCK.test(moduleName)) {
    return { filePath: pushStub, type: 'sourceFile' };
  }
  if (isSymlink && moduleName.startsWith('./opt/hostedapp')) {
    moduleName = moduleName.replace(/^\.\//, '/');
  }
  if (previousResolve) {
    return previousResolve(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

if (isSymlink) {
  const realNodeModules = fs.realpathSync(nodeModulesPath);
  config.watchFolders = [realNodeModules];
  config.resolver.nodeModulesPaths = [realNodeModules];
}
module.exports = config;
