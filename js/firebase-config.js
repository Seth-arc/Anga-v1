/**
 * firebase-config.js
 * Firebase configuration and initialization
 */

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBmT0lyQc1tqxg8f1cp98R7M1xwoAVw1FY",
    authDomain: "anga-512ee.firebaseapp.com",
    databaseURL: "https://anga-512ee-default-rtdb.firebaseio.com",
    projectId: "anga-512ee",
    storageBucket: "anga-512ee.appspot.com",
    messagingSenderId: "709481068728",
    appId: "1:709481068728:web:a4016d06880f0ebeec9c4d",
    measurementId: "G-M7MGJZL2BC"
};

// Check if Firebase is loaded
if (typeof firebase !== 'undefined') {
    try {
        // Initialize Firebase
        if (!firebase.apps || !firebase.apps.length) {
            const app = firebase.initializeApp(firebaseConfig);
            console.log('Firebase initialized successfully');
            
            // Initialize analytics if available
            if (firebase.analytics) {
                const analytics = firebase.analytics();
                console.log('Firebase analytics initialized');
            }
            
            // Initialize database if available
            if (firebase.database) {
                const database = firebase.database();
                console.log('Firebase database initialized');
                
                // Database reference helpers
                window.firebaseHelpers = {
                    getDbRef: (path) => database.ref(path),
                    saveData: (path, data) => database.ref(path).set(data),
                    updateData: (path, data) => database.ref(path).update(data),
                    getData: (path) => {
                        return new Promise((resolve, reject) => {
                            database.ref(path).once('value')
                                .then(snapshot => {
                                    resolve(snapshot.val());
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        });
                    },
                    listenForChanges: (path, callback) => {
                        database.ref(path).on('value', snapshot => {
                            callback(snapshot.val());
                        });
                    },
                    // Test connection to Firebase
                    testConnection: () => {
                        return new Promise((resolve, reject) => {
                            database.ref('.info/connected').once('value')
                                .then(snapshot => {
                                    const connected = snapshot.val();
                                    resolve(connected);
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        });
                    }
                };
                
                // Test connection
                window.firebaseHelpers.testConnection()
                    .then(connected => {
                        if (connected) {
                            console.log('Successfully connected to Firebase database');
                        } else {
                            console.warn('Firebase database connection failed');
                        }
                    })
                    .catch(error => {
                        console.error('Firebase connection test error:', error);
                    });
            }
        } else {
            console.log('Firebase already initialized');
        }
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
} else {
    console.warn('Firebase SDK not loaded');
}