import React, { useEffect, useState } from 'react';
import {StyleSheet, View , Text, Image, FlatList, Button} from 'react-native';
import {connect} from 'react-redux'
import firebase from 'firebase';
function Profile(props) {
    const [posts, setPosts] = useState([])


    useEffect(() => {
        let posts =[];
        console.log(props.following)
        if(props.userLoaded == props.following.length && props.following.length !== 0){
            for(let i = 0; i < props.following.length; i++){
                const user = props.users.find(el => el.uid === props.following[i])
                console.log(user)
                if(user != undefined){
                    posts = [...posts, ...user.posts]
                }
            }

            posts.sort(function(x,y) {
                return x.creation - y.creation;
            })
            // console.log(posts)
            setPosts[posts]
        }
    }, [props.userLoaded])

    return (
        <View style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem= {({item}) => (
                        <View style={styles.containerImage}>
                            <Text></Text>
                            <Image
                                style={styles.image}
                                source={{uri: item.downloadURL}}
                            />
                        </View>
                    )}
                    />
            </View>
        </View>
    )
}
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following,
    users: store.usersState.users,
    userLoaded: store.usersState.userLoaded
})

const styles = StyleSheet.create({
    container: {
        flex:1,
        marginTop: 40
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1/3
    },
    image :{
        flex: 1,
        aspectRatio:1/1
    }

})
export default connect(mapStateToProps, null)(Profile)

