import React from 'react';
import { AppState, AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { Provider } from 'react-redux';
import store, { persistor } from './src/redux/store';
import hiTranslation from './src/services/hi.json'
import { PersistGate } from 'redux-persist/integration/react';
// Define translations for Hindi only
// const AUTO_LOGOUT_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
i18next.init({
    lng: 'Eng', // Set the initial language to Hindi
    resources: {
        hi: {
            translation: hiTranslation, // Use the Hindi translations
        },
    },
    interpolation: {
        escapeValue: false,
    },
});
const AppWithProvider = () => (
    <I18nextProvider i18n={i18next}>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </I18nextProvider>
);

AppRegistry.registerComponent(appName, () => AppWithProvider);
