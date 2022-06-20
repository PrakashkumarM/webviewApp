// // firebase INIT

// // curl -X POST --header "Authorization: key=SERVER_KEY" --Header "Content-Type: application/json" https://fcm.googleapis.com/fcm/send -d "{\"notification\":{\"title\": \"My title\", \"text\": \"My text\", \"badge\": \"1\", \"sound\": \"default\"}, \"data\":{\"foo\":\"bar\"}, \"priority\": \"High\", \"to\": \"DEVICE_TOKEN\"}"
// import { firebase } from "@nativescript/firebase";

// const initFirebase = () => {
//   firebase
//     .init({
//       showNotifications: true,
//       showNotificationsWhenInForeground: true,
//       onPushTokenReceivedCallback: function(token) {
//         console.log("Firebase push token: " + token);
//       },
//     })
//     .then(
//       function() {
//         console.log("firebase.init done");
//       },
//       function(error) {
//         console.log("firebase.init error: " + error);
//       }
//     );
// };
// export default initFirebase;
