import { firestore, FirestoreFieldPath, FirestoreFieldValue, Snapshot } from './firebase';
import { User } from './auth'
import { PriceChangeRemote, SearchResult, TickerChange } from './models';
import { logPerformance } from './perf';

export async function search(input: string): Promise<SearchResult[]> {

    if (!input) {
        return [];
    }

    const tickers = await firestore.collection('current').get();

    const result: SearchResult[] = [];
    // firestore doesn't support text search, so we filter on client side instead.
    tickers.forEach(ticker => {
        if (ticker.id.toLowerCase().includes(input.toLowerCase())) {
            const { closeValue, delta, timestamp } = ticker.data() as PriceChangeRemote;
            result.push({
                symbol: ticker.id,
                value: closeValue,
                delta,
                timestamp
            });
        }
    });

    return result;
}

export function addToWatchList(ticker: string, user: User) {
    return firestore.collection('watchlist').doc(user.uid).set({
        tickers: FirestoreFieldValue.arrayUnion(ticker)
    }, { merge: true });
}

export function deleteFromWatchList(ticker: string, user: User) {
    return firestore.collection('watchlist').doc(user.uid).set({
        tickers: FirestoreFieldValue.arrayRemove(ticker)
    }, { merge: true });
}

type TickerChangesCallBack = (changes: TickerChange[]) => void
let firstload = true;
export function subscribeToTickerChanges(user: User, callback: TickerChangesCallBack) {

    let unsubscribePrevTickerChanges: () => void;
    const unsubscribe = firestore.collection('watchlist').doc(user.uid).onSnapshot(snapshot => {
        const doc = snapshot.data();
        const tickers = doc ? doc.tickers : [];

        if (unsubscribePrevTickerChanges) {
            unsubscribePrevTickerChanges();
        }

        if (tickers.length === 0) {
            callback([]);
        } else {
            unsubscribePrevTickerChanges = firestore
                .collection('current')
                .where(FirestoreFieldPath.documentId(), 'in', tickers)
                .onSnapshot(snapshot => {
                    if (firstload) {
                        performance && performance.measure("initialDataLoadTime");
                        firstload = false;
                        logPerformance();
                    }

                    const stocks = formatSDKStocks(snapshot);
                    callback(stocks);
                });
        }
    });
    return unsubscribe;
}

export function subscribeToAllTickerChanges(callback: TickerChangesCallBack) {
    return firestore
        .collection('current')
        .onSnapshot(snapshot => {
            if (firstload) {
                performance && performance.measure("initialDataLoadTime");
                firstload = false;
                logPerformance();
            }
            const stocks = formatSDKStocks(snapshot);
            callback(stocks);
        });
}

// Format stock data in Firestore format (returned from `onSnapshot()`)
function formatSDKStocks(snapshot: Snapshot): TickerChange[] {
    const stocks: TickerChange[] = [];
    snapshot.forEach(docSnap => {
        if (!docSnap.data()) return;
        const symbol = docSnap.id;
        const {
            closeValue,
            delta,
            timestamp
        } = docSnap.data();
        stocks.push({
            symbol,
            value: closeValue,
            delta,
            timestamp
        });
    });
    return stocks;
}
