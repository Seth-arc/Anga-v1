/**
 * storage.js
 * Firebase configuration and user data storage
 */

// Wait for Firebase scripts to load
document.addEventListener('DOMContentLoaded', function() {
    initializeFirebase();
});

// Initialize Firebase with your configuration
function initializeFirebase() {
    // Check if Firebase is loaded
    if (typeof firebase === 'undefined') {
        console.warn('Firebase SDK not loaded. Using local storage fallback.');
        initializeLocalStorageFallback();
        return;
    }

    // Your Firebase configuration - replace with your actual config
    const firebaseConfig = {
        apiKey: "AIzaSyBXDgaJUvGbYwUmGJmYgQUcGp1nSQwQPXM",
        authDomain: "anga-assessment.firebaseapp.com",
        projectId: "anga-assessment",
        storageBucket: "anga-assessment.appspot.com",
        messagingSenderId: "1098765432",
        appId: "1:1098765432:web:abc123def456ghi789jkl",
        databaseURL: "https://anga-assessment-default-rtdb.firebaseio.com"
    };

    // Check if the config has been updated from placeholders
    const isConfigValid = firebaseConfig.apiKey && 
                         firebaseConfig.apiKey !== "AIzaSyBXDgaJUvGbYwUmGJmYgQUcGp1nSQwQPXM";

    try {
        // Initialize Firebase (check if already initialized)
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        // Get database reference
        const database = firebase.database();

        // Test database connection if config appears valid
        if (isConfigValid) {
            database.ref('.info/connected').once('value')
                .then(snapshot => {
                    const connected = snapshot.val();
                    if (connected) {
                        console.log('Successfully connected to Firebase');
                    } else {
                        console.warn('Firebase connection failed. Using local storage fallback.');
                        initializeLocalStorageFallback();
                    }
                })
                .catch(error => {
                    console.error('Firebase connection error:', error);
                    initializeLocalStorageFallback();
                });
        } else {
            console.warn('Firebase config appears to be using placeholder values. Using local storage fallback.');
            initializeLocalStorageFallback();
            return;
        }

        // Create and expose the storage API
        window.dataStorage = {
            storeUserData,
            storeAnonymousResults,
            getUserData,
            getUserHistory
        };

        // Function to store user data
        async function storeUserData(userData) {
            try {
                // Generate a unique ID for this submission
                const submissionId = database.ref().child('submissions').push().key;
                
                // Add timestamp
                userData.timestamp = new Date().toISOString();
                
                // Create a user reference if email is provided
                if (userData.email) {
                    // Hash the email for privacy (simple hash for demo purposes)
                    const emailHash = await hashEmail(userData.email);
                    
                    // Store user reference
                    await database.ref(`users/${emailHash}/submissions/${submissionId}`).set(true);
                    userData.userRef = emailHash;
                }
                
                // Store data
                await database.ref('submissions/' + submissionId).set(userData);
                console.log("Data stored successfully");
                return true;
            } catch (error) {
                console.error("Error storing data: ", error);
                return false;
            }
        }

        // Function to store anonymous assessment data (no personal info)
        async function storeAnonymousResults(results) {
            try {
                const resultId = database.ref().child('anonymous_results').push().key;
                
                await database.ref('anonymous_results/' + resultId).set({
                    dominant_style: results.dominantStyle,
                    style_scores: results.scores,
                    timestamp: new Date().toISOString()
                });
                
                return true;
            } catch (error) {
                console.error("Error storing anonymous data: ", error);
                return false;
            }
        }

        // Function to get user data by email
        async function getUserData(email) {
            try {
                // Hash the email
                const emailHash = await hashEmail(email);
                
                // Get user submissions
                const userRef = database.ref(`users/${emailHash}/submissions`);
                const snapshot = await userRef.once('value');
                const submissions = snapshot.val();
                
                if (!submissions) {
                    return null;
                }
                
                // Get the actual submission data
                const submissionIds = Object.keys(submissions);
                const submissionData = [];
                
                for (const id of submissionIds) {
                    const dataSnapshot = await database.ref(`submissions/${id}`).once('value');
                    const data = dataSnapshot.val();
                    
                    if (data) {
                        submissionData.push({
                            id,
                            ...data
                        });
                    }
                }
                
                return submissionData;
            } catch (error) {
                console.error("Error getting user data: ", error);
                return null;
            }
        }

        // Function to get user's assessment history
        async function getUserHistory(email) {
            try {
                const userData = await getUserData(email);
                
                if (!userData) {
                    return [];
                }
                
                // Sort by timestamp (newest first)
                return userData.sort((a, b) => {
                    return new Date(b.timestamp) - new Date(a.timestamp);
                });
            } catch (error) {
                console.error("Error getting user history: ", error);
                return [];
            }
        }

        // Simple hash function for email (for demo purposes)
        // In production, use a more secure hashing approach
        async function hashEmail(email) {
            const encoder = new TextEncoder();
            const data = encoder.encode(email.toLowerCase());
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        }
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        initializeLocalStorageFallback();
    }
}

// Initialize local storage fallback when Firebase is not available
function initializeLocalStorageFallback() {
    console.log('Using localStorage fallback for data storage');
    
    // Create and expose the storage API with localStorage implementations
    window.dataStorage = {
        storeUserData: localStoreUserData,
        storeAnonymousResults: localStoreAnonymousResults,
        getUserData: localGetUserData,
        getUserHistory: localGetUserHistory
    };
    
    // Local storage implementation for storing user data
    async function localStoreUserData(userData) {
        try {
            // Generate a unique ID
            const submissionId = generateUniqueId();
            
            // Add timestamp
            userData.timestamp = new Date().toISOString();
            userData.id = submissionId;
            
            // Store in localStorage
            const savedData = JSON.parse(localStorage.getItem('angaUserSubmissions') || '[]');
            savedData.push(userData);
            localStorage.setItem('angaUserSubmissions', JSON.stringify(savedData));
            
            // If email is provided, store reference
            if (userData.email) {
                const emailHash = await localHashEmail(userData.email);
                const userRefs = JSON.parse(localStorage.getItem(`angaUserRefs_${emailHash}`) || '[]');
                userRefs.push(submissionId);
                localStorage.setItem(`angaUserRefs_${emailHash}`, JSON.stringify(userRefs));
            }
            
            console.log("Data stored successfully in localStorage");
            return true;
        } catch (error) {
            console.error("Error storing data in localStorage: ", error);
            return false;
        }
    }
    
    // Local storage implementation for storing anonymous results
    async function localStoreAnonymousResults(results) {
        try {
            const anonymousData = {
                id: generateUniqueId(),
                dominant_style: results.dominantStyle,
                style_scores: results.scores,
                timestamp: new Date().toISOString()
            };
            
            const savedData = JSON.parse(localStorage.getItem('angaAnonymousResults') || '[]');
            savedData.push(anonymousData);
            localStorage.setItem('angaAnonymousResults', JSON.stringify(savedData));
            
            return true;
        } catch (error) {
            console.error("Error storing anonymous data in localStorage: ", error);
            return false;
        }
    }
    
    // Local storage implementation for getting user data
    async function localGetUserData(email) {
        try {
            if (!email) return null;
            
            const emailHash = await localHashEmail(email);
            const userRefs = JSON.parse(localStorage.getItem(`angaUserRefs_${emailHash}`) || '[]');
            
            if (userRefs.length === 0) {
                return null;
            }
            
            const allSubmissions = JSON.parse(localStorage.getItem('angaUserSubmissions') || '[]');
            const userSubmissions = allSubmissions.filter(sub => userRefs.includes(sub.id));
            
            return userSubmissions;
        } catch (error) {
            console.error("Error getting user data from localStorage: ", error);
            return null;
        }
    }
    
    // Local storage implementation for getting user history
    async function localGetUserHistory(email) {
        try {
            const userData = await localGetUserData(email);
            
            if (!userData) {
                return [];
            }
            
            // Sort by timestamp (newest first)
            return userData.sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp);
            });
        } catch (error) {
            console.error("Error getting user history from localStorage: ", error);
            return [];
        }
    }
    
    // Helper function to generate a unique ID
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
    
    // Simple hash function for email in localStorage implementation
    async function localHashEmail(email) {
        // Simple hash for demo purposes
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
            const char = email.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    }
}