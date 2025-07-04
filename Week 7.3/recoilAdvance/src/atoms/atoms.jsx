import { atom, selector } from "recoil";
import axios from "axios";

export const networkAtom = atom({
    key : "networkAtom",
    default : 102,
})

export const jobsAtom = atom({
    key : "jobsAtom",
    default : 2,
})

export const notificationAtom = atom({
    key : "notificationAtom",
    default : 11,
})

export const messagingAtom = atom({
    key : "messagingAtom",
    default : 1,
})

export const total = atom({
    key : "total",
    default : selector({
        key : "totalSelector",
        get: async () => {
            try {
                const res = await axios.get("http://localhost:3000/notifications");
                console.log("res is ", res);
                return res.data;
            } catch (e) {
                return { network: 2, jobs: 14, notifications: 7, messaging: 8 };
            }
        }
    })
});

export const selectorForValues = selector({
    key : "selectorForValues",
    get : ({get}) => {
        const allValues = get(total);
        return allValues.network + allValues.jobs + allValues.notifications + allValues.messaging;
    }
})
