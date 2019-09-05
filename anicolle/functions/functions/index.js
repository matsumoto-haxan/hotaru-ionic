const functions = require('firebase-functions');
const admin = require('firebase-admin');


admin.initializeApp(functions.config().firebase);
var fireStore = admin.firestore();


exports.sendPush = functions.firestore
    .document('messaging/{wildcard}')
    .onCreate((snap, context) => {

        const item = snap.data();
        const toId = item.to;

        const payload = {
            data: {
                fromId: item.from,
                fromName: item.fromname
            }
        };

        // トークンを取得
        var docRef = fireStore.collection('fcmtoken').doc(toId);
        docRef.get().then((doc) => {
            const targetToken = doc.data().fcmtoken;

            console.log(targetToken);

            // プッシュ通知設定
            const options = {
                priority: "high",
            };

            // プッシュ送信
            admin.messaging().sendToDevice(targetToken, payload, options)
                .then(pushResponse => {
                    console.log("Successfully sent message:", pushResponse);
                })
                .catch(error => {
                    console.log("Error sending message:", error);
                });
        });
    });