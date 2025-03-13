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
    // Your Firebase configuration - replace with your actual config
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_ID",
        appId: "YOUR_APP_ID",
        databaseURL: "https://your-project-default-rtdb.firebaseio.com"
    };

    // Initialize Firebase (check if already initialized)
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Get database reference
    const database = firebase.database();

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
}