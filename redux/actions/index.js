import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE} from '../constants'
import firebase from "firebase";

export function fetchUser() {
    return ((dispatch) => {
        firebase.firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
            if(snapshot.exists){
                // console.log(snapshot)
                dispatch({type : USER_STATE_CHANGE, currentUser: snapshot.data()})
            }
            else {
                console.log("snapshot does not exist")
            }
        })
    })
}

export function fetchUserPosts() {
    return ((dispatch) => {
        firebase.firestore()
        .collection("posts")
        .doc(firebase.auth().currentUser.uid)
        .collection('userPosts')
        .orderBy('creation', 'asc')
        .get()
        .then((snapshot) => {
            // console.log(snapshot.docs)
            let posts = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return {id, ...data}
            })
            // console.log(posts)
            dispatch({type : USER_POSTS_STATE_CHANGE, posts})
        })
    })
}

export function fetchUserFollowing() {
    return ((dispatch) => {
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection('userFollowing')
        .onSnapshot((snapshot) => {
            // console.log(snapshot.docs)
            let following = snapshot.docs.map(doc => {
                const id = doc.id;
                return id
            })
            // console.log(posts)
            dispatch({type : USER_FOLLOWING_STATE_CHANGE, following})
            for(let i=0; i< following.length; i++){
                dispatch(fetchUsersData(following[i]));
            }
        })
    })
}

export function fetchUsersData(uid){
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);

        if(!found){
            firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    let user = snapshot.data();
                    user.uid = snapshot.id;

                    // console.log(snapshot)
                    dispatch({type : USERS_DATA_STATE_CHANGE, user})
                    
                    dispatch(fetchUsersFollowingPosts(user.uid))
                }
                else {
                    console.log("snapshot does not exist")
                }
            })
        }
    })
}

export function fetchUsersFollowingPosts(uid) {
    // return ((dispatch, getState) => {
    //     // console.log('jddd')
    //     firebase.firestore()
    //     .collection("posts")
    //     .doc(uid)
    //     .collection('userPosts')
    //     .orderBy('creation', 'asc')
    //     .get()
    //     .then((snapshot) => {
    //         try {
    //             console.log('jddd hjnj')
    //             const uid = snapshot.docs[0].ref.path.split('/')[1];
    //             console.log({snapshot, uid})
    //             const user = getState().usersState.users.find(el => el.uid === uid);
    //             console.log(snapshot.docs)
    //             let posts = snapshot.docs.map(doc => {
    //                 const data = doc.data();
    //                 const id = doc.id;
    //                 return {id, ...data, user}
    //             })
    //             dispatch({type : USERS_POSTS_STATE_CHANGE, posts, uid})
    //             console.log(getState())
    //         } catch(error){

    //         }
            
    //     })
    // })
    return (
        (dispatch,getState) =>{
            firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation","asc")
            .get()
            .then((snapshot)=>{
                try {
                    // console.log(getState())
                    const uid = snapshot.query._.C_.path.segments[1]
                    
                    const user = getState().usersState.users.find(el => el.uid === uid);
                    const posts = snapshot.docs.map(doc =>{
                        const data = doc.data()
                        const id   = doc.id
                        return {id , ...data, user}
                    })
                    // console.log(posts);
                    dispatch({type:USERS_POST_STATE_CHANGE,posts,uid})
                   
                } catch (error) {
                    // console.log(error)
                }
                
            })
        }
    )
}