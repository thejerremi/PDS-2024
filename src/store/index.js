import { createStore } from "vuex";
import moment from 'moment';
// firebase imports
import { auth } from "@/firebase/config";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    getIdTokenResult,
    signInWithPopup, 
    GoogleAuthProvider
} from "firebase/auth";
import {
    getFirestore, collection,
    getDoc, getDocs, addDoc, setDoc, doc,
    query, where,
    orderBy, serverTimestamp, Timestamp,
    updateDoc,
    getCountFromServer,
} from 'firebase/firestore'



const store = createStore({
    state: {
        //firebase auth
        user: null,
        authIsReady: false,
        userRole: null,
        //firebase firestore
        userActiveReservation: false,
        userBalance: 0,
        userReservationDoc: {
            userId: null,
            entryTime: null,
            exitTime: null,
            parkingId: null,
            carPlate: null
        },
        userReservationHistory: [],
        parkingSpots: [],
        weeklyReservationHistory: [],
        showTosOverlay: false,
        showPPOverlay: false,
        showCookiesBanner: true,
    },
    mutations: {
        //firebase auth
        setUser(state, payload) {
            state.user = payload
        },
        setUserRole(state, payload) {
            state.userRole = payload;
        },
        setAuthIsReady(state, payload) {
            state.authIsReady = payload
        },
        //firebase firestore
        setUserActiveReservation(state, payload) {
            state.userActiveReservation = payload
        },
        setUserBalance(state, payload) {
            state.userBalance = payload
        },
        setUserReservationDoc(state, payload) {
            state.userReservationDoc = payload
        },
        addReservationToHistory(state, reservation) {
            state.userReservationHistory.push(reservation)
        },
        clearHistory(state) {
            state.userReservationHistory.length = 0
        },
        addParkingSpot(state, spot) {
            state.parkingSpots.push(spot)
        },
        sortParkingSpots(state) {
            state.parkingSpots.sort((a, b) => {
                const idA = parseInt(a.id);
                const idB = parseInt(b.id);

                if (idA < idB) {
                    return -1;
                }
                if (idA > idB) {
                    return 1;
                }
                return 0;
            });
        },
        clearParkingSpots(state) {
            state.parkingSpots.length = 0
        },
        addReservationToWeeklyHistory(state, reservationCount) {
            state.weeklyReservationHistory.push(reservationCount)
        },
        clearWeeklyHistory(state) {
            state.weeklyReservationHistory.length = 0
        },
        setShowTosOverlay(state) {
            state.showTosOverlay = !state.showTosOverlay
        },
        setShowPPOverlay(state) {
            state.showPPOverlay = !state.showPPOverlay
        },
        setShowCookiesBanner(state) {
            state.showCookiesBanner = !state.showCookiesBanner
        }
    },
    actions: {
        showTosOverlay(context) {
            context.commit('setShowTosOverlay')
        },
        showPPOverlay(context) {
            context.commit('setShowPPOverlay')
        },
        showCookiesBanner(context) {
            context.commit('setShowCookiesBanner')
        },
        //firebase auth
        async signup(context, { email, password }) {
            const db = getFirestore()
            // async code
            const response = await createUserWithEmailAndPassword(auth, email, password)
            if (response) {
                const tokenResult = await getIdTokenResult(response.user);
                context.commit('setUser', response.user);
                context.commit('setUserRole', tokenResult.claims.admin || 'user');
                context.commit('setUserActiveReservation', false)
                context.commit('setUserBalance', 0)
                // add user to users collection
                await setDoc(doc(db, "users", response.user.uid), {
                    email: email,
                    carPlate: "",
                    activeReservation: false,
                    balance: 0,
                });
            } else {
                throw new Error('couldn\'t complete signup')
            }
        },
        async signupWithGoogle(context) {
            const provider = new GoogleAuthProvider();
            const response = await signInWithPopup(auth, provider);
            if (response) {
                context.commit('setUser', response.user);
                context.commit('setUserRole', 'user');
                context.commit('setUserActiveReservation', false)
                context.commit('setUserBalance', 0)
                const db = getFirestore()
                // add user to users collection
                await setDoc(doc(db, "users", response.user.uid), {
                    email: response.user.email,
                    carPlate: "",
                    activeReservation: false,
                    balance: 0,
                });
            } else {
                throw new Error('couldn\'t complete signup')
            }
        },
        async loginWithGoogle(context) {
            const provider = new GoogleAuthProvider();
            const response = await signInWithPopup(auth, provider);
            if (response) {
                const tokenResult = await getIdTokenResult(response.user);
                context.commit('setUser', response.user);
                context.commit('setUserRole', tokenResult.claims.admin ? 'admin' : 'user');
                const userRef = doc(getFirestore(), "users", response.user.uid)
                const userSnap = await getDoc(userRef)
                if (userSnap.exists()) {
                    context.commit('setUserActiveReservation', userSnap.data().activeReservation)
                    context.commit('setUserBalance', userSnap.data().balance)
                }
            } else {
                throw new Error('couldn\'t complete login')
            }
        },
        async login(context, { email, password }) {
            // async code
            const response = await signInWithEmailAndPassword(auth, email, password)
            if (response) {
                const tokenResult = await getIdTokenResult(response.user);
                context.commit('setUser', response.user);
                context.commit('setUserRole', tokenResult.claims.admin ? 'admin' : 'user');
                const userRef = doc(getFirestore(), "users", response.user.uid)
                const userSnap = await getDoc(userRef)
                if (userSnap.exists()) {
                    context.commit('setUserActiveReservation', userSnap.data().activeReservation)
                    context.commit('setUserBalance', userSnap.data().balance)
                }
            } else {
                throw new Error('couldn\'t complete login')
            }
        },
        async logout(context) {
            await signOut(auth)
            context.commit('setUser', null)
            context.commit('setUserRole', null)
            context.commit('setUserActiveReservation', null)
            context.commit('setUserBalance', 0)
            context.commit('addReservationToHistory', null)
            // context.commit('setUserReservationDoc', null)
        },

        // firebase firestore
        async addReservation(context, { userId, carPlate },) {
            const db = getFirestore() // get firestore instance
            carPlate = carPlate.toUpperCase() // convert car plate to uppercase
            try {
                // check if user has active reservation
                await getDoc(doc(db, "users", userId)).then((snapshot) => {
                    if (snapshot.exists()) {
                        if (snapshot.data().activeReservation) {
                            throw new Error('Couldn\'t complete reservation - user already has active reservation')
                        }
                    }
                });
                // check if car plate is already in use
                await getDocs(query(collection(db, "users"), where("carPlate", "==", carPlate))).then((snapshot) => {
                    if (snapshot.size > 0) {
                        throw new Error('Couldn\'t complete reservation - car plate already in use')
                    }
                }).catch(() => {
                    throw new Error('Couldn\'t complete reservation - server error (car plate check)')
                });

                const freeSpotsQuery = query(collection(db, "parking"), where("status", "==", "free")); // query for free spots
                const freeSpotsSnapshot = await getCountFromServer(freeSpotsQuery); // get free spots count
                if (freeSpotsSnapshot.data().count === 0) {
                    throw new Error('Couldn\'t complete reservation - All spots are taken')
                }
                const random = Math.floor(Math.random() * freeSpotsSnapshot.data().count); // get random number from 0 to free spots count-1

                await getDocs(freeSpotsQuery).then(() => {
                    updateDoc(doc(db, "parking", (random + 1).toString()), {
                        status: "occupied",
                        carPlate: carPlate,
                        entryTime: serverTimestamp(),
                        exitTime: null,
                    })
                }).catch(() => {
                    throw new Error('Couldn\'t complete reservation - server error (parking update)')
                });

                console.log('Próba zarezerwowania miejsca dla użytkownika: ' + userId + ' rejestracja: ' + carPlate + ' na miejscu: ' + random);
                await addDoc(collection(db, "reservations"), {
                    userId: doc(db, "users", userId),
                    entryTime: serverTimestamp(),
                    exitTime: null,
                    parkingId: doc(db, "parking", (random + 1).toString()),
                    carPlate: carPlate
                }).catch(() => {
                    throw new Error('Couldn\'t complete reservation - server error (reservation add)')
                });


                await updateDoc(doc(db, "users", userId), {
                    activeReservation: true,
                    carPlate: carPlate,
                }).catch(() => {
                    throw new Error('Couldn\'t complete reservation - server error (user update)')
                });
                return { success: true }
            } catch (error) {
                console.error('Error during reservation:' + error.message);
                return { error: error.message }
            }
        },

        async getReservations(context, { userId }) {
            const db = getFirestore()
            const reservationCollection = collection(db, "reservations")
            try {
                const q = query(reservationCollection, where("userId", "==", doc(db, "users", userId)), orderBy("entryTime", "desc"));
                getDocs(q)
                    .then(snapshot => {
                        if (snapshot.empty) {
                            console.log('No matching documents.');
                            return;
                        }
                        store.commit('clearHistory')
                        snapshot.forEach(doc => {
                            store.commit('addReservationToHistory', {
                                entryTime: doc.data().entryTime ? moment(doc.data().entryTime.toDate()).format("DD-MM-YYYY HH:mm:ss") : null,
                                exitTime: doc.data().exitTime ? moment(doc.data().exitTime.toDate()).format("DD-MM-YYYY HH:mm:ss") : null,
                                parkingId: doc.data().parkingId.id,
                                carPlate: doc.data().carPlate,
                                cost: doc.data().cost ? doc.data().cost + " PLN" : null
                            })
                            // console.log(doc.id, '=>', doc.data());
                        });
                    })
                return { success: true }
            } catch (error) {
                console.error('Error during getting reservations:' + error.message);
                return { error: error.message }
            }

        },

        async getReservation(context, { userId }) {
            const db = getFirestore()
            const reservationCollection = collection(db, "reservations")
            try {
                const q = query(reservationCollection, where("userId", "==", doc(db, "users", userId)), where("exitTime", "==", null));
                getDocs(q)
                    .then(snapshot => {
                        if (snapshot.empty) {
                            return;
                        }

                        snapshot.forEach(doc => {
                            store.commit('setUserReservationDoc', {
                                id: doc.id,
                                userId: doc.data().userId,
                                entryTime: doc.data().entryTime.toDate(),
                                exitTime: doc.data().exitTime,
                                parkingId: doc.data().parkingId.id,
                                carPlate: doc.data().carPlate
                            })
                        });
                    })
                return { success: true }
            } catch (error) {
                console.error('Error during getting reservation:' + error.message);
                return { error: error.message }
            }
        },

        async getReservationById(context, { reservationId }) {
            const db = getFirestore()
            const reservationRef = doc(db, "reservations", reservationId)
            try {
                const reservationDoc = await getDoc(reservationRef)
                if (reservationDoc.exists()) {
                    store.commit('setUserReservationDoc', {
                        userId: reservationDoc.data().userId,
                        entryTime: reservationDoc.data().entryTime.toDate(),
                        exitTime: reservationDoc.data().exitTime,
                        parkingId: reservationDoc.data().parkingId.id,
                        carPlate: reservationDoc.data().carPlate
                    })
                }
                return { success: true }
            } catch (error) {
                console.error('Error during getting reservation:' + error.message);
                return { error: error.message }
            }
        },

        async endReservation(context, { userId, cost }) {
            const db = getFirestore()
            try {
                await getDocs(query(collection(db, "reservations"), where("userId", "==", doc(db, "users", userId)), where("exitTime", "==", null)))
                    .then(snapshot => {
                        if (snapshot.empty) {
                            return;
                        }
                        if (this.state.userBalance < cost) {
                            throw new Error('Nie posiadasz wystarczająco pieniędzy na koncie aby zakończyć rezerwację. '
                                + 'Koszt: ' + cost + ' PLN Twój stan konta: ' + this.state.userBalance + ' PLN Dodaj środki w zakładce "Twoje konto"')
                        }
                        snapshot.forEach(doc => {
                            updateDoc(doc.ref, {
                                exitTime: serverTimestamp(),
                                cost: cost
                            })
                            updateDoc(doc.data().parkingId, {
                                status: "free",
                                carPlate: null,
                                entryTime: null,
                                exitTime: null
                            })
                        });
                    })
                await updateDoc(doc(db, "users", userId), {
                    activeReservation: false,
                    carPlate: "",
                    balance: this.state.userBalance - cost
                })
                return { success: true }
            } catch (error) {
                console.error('Error during ending reservation:' + error.message);
                return { error: error.message }
            }
        },

        async addBalance(context, { userId, amount }) {
            const db = getFirestore()
            try {
                await updateDoc(doc(db, "users", userId), {
                    balance: this.state.userBalance + amount
                })
                return { success: true }
            } catch (error) {
                console.error('Error during adding balance:' + error.message);
                return { error: error.message }
            }

        },

        async getParkingSpots(context) {
            const db = getFirestore()
            const parkingCollection = collection(db, "parking")
            try {
                getDocs(parkingCollection)
                    .then(snapshot => {
                        if (snapshot.empty) {
                            console.log('Parking: No matching documents.');
                            return;
                        }
                        store.commit('clearParkingSpots')
                        snapshot.forEach(doc => {
                            context.commit('addParkingSpot', {
                                id: doc.id,
                                status: doc.data().status,
                                carPlate: doc.data().carPlate,
                                entryTime: doc.data().entryTime ? moment(doc.data().entryTime.toDate()).format("DD-MM-YYYY HH:mm:ss") : null,
                                exitTime: doc.data().exitTime ? moment(doc.data().exitTime.toDate()).format("DD-MM-YYYY HH:mm:ss") : null
                            })
                        });
                    })
                context.commit('sortParkingSpots')
                return { success: true }
            } catch (error) {
                console.error('Error during getting parking spots:' + error.message);
                return { error: error.message }
            }
        },
        async getReservationCountByDate(context) {
            try {
                const db = getFirestore();
                const today = new Date();
            
                context.commit('clearWeeklyHistory')
                for (let i = 0; i < 7; i++) {
                  const currentDate = new Date(today);
                  currentDate.setDate(currentDate.getDate() - i);

                  currentDate.setHours(0, 0, 0, 0);
                  
                  const endOfDayDate = new Date(currentDate);
                  endOfDayDate.setHours(23, 59, 59, 999);
            
                  const reservationsQuery = query(
                    collection(db, 'reservations'),
                    where('entryTime', '>=', Timestamp.fromDate(currentDate)),
                    where('entryTime', '<=', Timestamp.fromDate(endOfDayDate))
                  );
            
                  const snapshot = await getDocs(reservationsQuery);
                  context.commit('addReservationToWeeklyHistory', {
                    date: currentDate.toLocaleDateString(),
                    count: snapshot.size
                  });                  
                }
                return {success: true};
              } catch (error) {
                console.error('Błąd podczas pobierania danych rezerwacji:', error);
                throw error; 
              }
        }
    },
})
// firebase auth state change
const unsub = onAuthStateChanged(auth, (user) => {
    store.commit('setAuthIsReady', true)
    store.commit('setUser', user)
    if (user) {
        getIdTokenResult(user).then(tokenResult => {
            store.commit('setUserRole', tokenResult.claims.admin ? 'admin' : 'user');
        })
        getDoc(doc(getFirestore(), "users", user.uid)).then(userSnap => {
            if (userSnap.exists()) {
                store.commit('setUserActiveReservation', userSnap.data().activeReservation)
                store.commit('setUserBalance', userSnap.data().balance)
            }
        })
        store.dispatch('getReservations', { userId: user.uid })
    } else {
        store.commit('setUserRole', null);
    }
    unsub()
})

export default store