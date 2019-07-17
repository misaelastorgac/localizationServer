var GeoPoint = require('geopoint');

point1 = new GeoPoint(25.9333, -109.05);
point2 = new GeoPoint(25.7930202, -108.9980774);
point3 = new GeoPoint(25.7930202, -108.9980774);

const admin = require('firebase-admin');
var serviceAccount = require('./ServiceAccountRight.json');
var firebase = require('firebase');


var firebaseConfig = {
    apiKey: "AIzaSyA3y3JcbIyCStEUELybcqTgiYCiA6BnnlE",
    authDomain: "test-4e8cf.firebaseapp.com",
    databaseURL: "https://test-4e8cf.firebaseio.com",
    projectId: "test-4e8cf",
    storageBucket: "test-4e8cf.appspot.com",
    messagingSenderId: "600052431948",
    appId: "1:600052431948:web:ada2978e70d1c59a"
};
firebase.initializeApp(firebaseConfig);



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});



var db = admin.firestore();

let doc2 = db.collection('globaldevices');

let doc3 = db.collection('instructions');

var ref = firebase.database().ref("/devicetriangulation");

var ref2 = firebase.database().ref("/instructions");

var ref3 = firebase.database().ref('/devicedata');

try {
    ref3.remove();    
} catch (error) {
   console.log(error); 
}



ref.on("child_added", function (snapshot, prevChildKey) {
    var newTriangulation = snapshot.val();
    let id = newTriangulation.iduser;
    console.log(id);


    let neardevices = db.collection('usuarios/' + id + '/neardevices');

    neardevices.firestore.collection('usuarios/' + id + '/neardevices').listDocuments().then(val => {
        val.map((val) => {
            val.delete()
        })
    });

    doc2.get()
        .then(snapshot => {
            snapshot.forEach(device => {
                devicepoint = new GeoPoint(device.data().latitude, device.data().longitude);
                userpoint = new GeoPoint(newTriangulation.latitude, newTriangulation.longitude);

             //   console.log(userpoint)
               // console.log(devicepoint)

                var distance = userpoint.distanceTo(devicepoint, true);
                console.log(distance * 1000);
                if (distance * 1000 <= 1000) {
                   // var distancefixed = Number(Math.round(1.005+'e2')+'e-2');
                    
                   // console.log(distanceFixed);
                    neardevices.add({
                        'name': device.data().Name,
                        'brand': device.data().brand,
                        'habilityone': device.data().habilityone,
                        'habilitytwo': device.data().habilitytwo,
                        'habilitythree': device.data().habilitythree,
                        'id': device.data().id,
                        'latitude': device.data().latitude,
                        'longitude': device.data().longitude,
                        'semanticubication': device.data().semanticubication,
                        'distance': distance * 1000
                    })
                }
                else {
                 //   console.log('pelo')
                }

            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });

}, err => {
    console.log(`Encountered error: ${err}`);
});

ref2.on("child_added", function (snapshot, prevChildKey){
    var newInstruction = snapshot.val();

    

    

    doc3.add(newInstruction);
    

});




