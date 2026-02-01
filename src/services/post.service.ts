import { db } from "@/src/services/firebase.service";
import { sendPushNotification } from "@/src/services/notification.service";
import { getUserPushToken } from "@/src/services/user.service";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    increment,
    onSnapshot,
    orderBy,
    query,
    runTransaction,
    serverTimestamp,
    where
} from "firebase/firestore";

const POSTS_COLLECTION = "posts";

export interface PostData {
    id?: string;
    content: string;
    mood: string;
    userId: string;
    createdAt?: any;
    reactions: {
        relatable: number;
        support: number;
    };
}

export const createPost = async (data: Omit<PostData, 'createdAt' | 'reactions'>) => {
    return await addDoc(collection(db, POSTS_COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        reactions: {
            relatable: 0,
            support: 0
        }
    });
};

export const deletePost = async (postId: string) => {
    return await deleteDoc(doc(db, POSTS_COLLECTION, postId));
};

export const subscribeToAllPosts = (callback: (posts: any[]) => void) => {
    const q = query(collection(db, POSTS_COLLECTION), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(posts);
    });
};

export const subscribeToUserPosts = (userId: string, callback: (posts: any[]) => void) => {
    const q = query(
        collection(db, POSTS_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(posts);
    });
};

export const checkUserReaction = async (postId: string, userId: string) => {
    const reactionRef = doc(db, "post_reactions", `${postId}_${userId}`);
    const reactionSnap = await getDoc(reactionRef);
    return reactionSnap.exists() ? reactionSnap.data().type : null;
};

export const handlePostReaction = async (post: any, userId: string, type: 'relatable' | 'support') => {
    return await runTransaction(db, async (transaction) => {
        const postRef = doc(db, POSTS_COLLECTION, post.id);
        const reactionRef = doc(db, "post_reactions", `${post.id}_${userId}`);

        const reactionDoc = await transaction.get(reactionRef);
        const postDoc = await transaction.get(postRef);

        if (!postDoc.exists()) throw "Post does not exist!";

        if (reactionDoc.exists()) {
            const oldType = reactionDoc.data().type;

            if (oldType === type) {
                // Toggle off
                transaction.delete(reactionRef);
                transaction.update(postRef, {
                    [`reactions.${type}`]: increment(-1)
                });
            } else {
                // Switch reaction
                transaction.set(reactionRef, {
                    type,
                    postId: post.id,
                    userId,
                    createdAt: serverTimestamp()
                }, { merge: true });
                transaction.update(postRef, {
                    [`reactions.${oldType}`]: increment(-1),
                    [`reactions.${type}`]: increment(1)
                });

                // Send notification on switch too
                if (post.userId !== userId) {
                    triggerNotification(post.userId, userId, post.id, type, true);
                }
            }
        } else {
            // New reaction
            transaction.set(reactionRef, {
                type,
                postId: post.id,
                userId,
                createdAt: serverTimestamp()
            });
            transaction.update(postRef, {
                [`reactions.${type}`]: increment(1)
            });

            // Send notification on new reaction
            if (post.userId !== userId) {
                triggerNotification(post.userId, userId, post.id, type, false);
            }
        }
    });
};

const triggerNotification = async (recipientId: string, senderId: string, postId: string, type: string, isSwitch: boolean) => {
    try {
        const message = type === 'relatable'
            ? "Someone found your post relatable"
            : "Someone sent support for your post";

        await addDoc(collection(db, "notifications"), {
            userId: recipientId,
            senderId: senderId,
            postId: postId,
            type: 'reaction',
            message: message + (isSwitch ? " (updated reaction)" : ""),
            createdAt: serverTimestamp(),
            read: false
        });

        const token = await getUserPushToken(recipientId);

        if (token) {
            await sendPushNotification(token, "New Reaction!", message, { postId });
        }
    } catch (e) {
        console.error("PostService: Failed to trigger notification:", e);
    }
};
