/**
 * Copyright 2021 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export const app = firebase.initializeApp({
    apiKey: "AIzaSyBnRKitQGBX0u8k4COtDTILYxCJuMf7xzE",
    authDomain: "exchange-rates-adcf6.firebaseapp.com",
    databaseURL: "https://exchange-rates-adcf6.firebaseio.com",
    projectId: "exchange-rates-adcf6",
    storageBucket: "exchange-rates-adcf6.appspot.com",
    messagingSenderId: "875614679042",
    appId: "1:875614679042:web:5813c3e70a33e91ba0371b"
});

export const firebaseAuth = app.auth();

export const firestore = app.firestore();

export const FirestoreFieldValue = firebase.firestore.FieldValue;

export const FirestoreFieldPath = firebase.firestore.FieldPath;

export type QuerySnapshot = firebase.firestore.QuerySnapshot;

export type User = firebase.User;
