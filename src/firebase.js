import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAsvj7hNHyCYblARkFiJ_KR2tDiwbNFt9g",
    authDomain: "testcurrency-c1b71.firebaseapp.com",
    databaseURL: "https://testcurrency-c1b71.firebaseio.com",
    projectId: "testcurrency-c1b71",
    storageBucket: "testcurrency-c1b71.appspot.com",
    messagingSenderId: "603978876763"
};

export default firebase.initializeApp(config)
