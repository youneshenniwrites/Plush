import React from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity
} from "react-native"

import { Card, Text } from 'native-base'
import { Ionicons } from '@expo/vector-icons'

import LikeButton from './LikeButton'

const PostCard = ({ post, user, toggleLikePost, deletePostAlert } = props) => (
  <Card style={styles.cardStyle}>
    <View style={styles.cardHeaderStyle}>
      {
        post.postOwnerId === user &&
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
          <TouchableOpacity onPress={deletePostAlert}>
            <Ionicons
              style={{ color: '#1f267e', padding: 5, fontSize: 30 }}
              name="md-more"
            />
          </TouchableOpacity>
        </View>
      }
    </View>
    <TouchableOpacity>
      <Text style={styles.postBody}>
        {post.postContent}
      </Text>
    </TouchableOpacity>
    <View style={styles.cardFooterStyle}>
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <Text style={styles.postUsername}>
          {post.postOwnerUsername}
        </Text>
      </View>
      {/* Logged in user liked this post */}
      {
        post.likes.items.length !== 0 &&
        post.likes.items.filter(obj => obj.likeOwnerId === user).length === 1 &&
        <LikeButton color='#FB7777' toggleLikePost={toggleLikePost} />
      }
      {/* Logged in user did not like this post */}
      {
        post.likes.items.length !== 0 &&
        post.likes.items.filter(obj => obj.likeOwnerId === user).length === 0 &&
        <LikeButton color='#69FB' toggleLikePost={toggleLikePost} />
      }
      {/* Post has no likes */}
      {
        post.likes.items.length === 0 &&
        <LikeButton color='#69FB' toggleLikePost={toggleLikePost} />
      }
    </View>
  </Card>
)
export default PostCard

const styles = StyleSheet.create({
  cardStyle: {
    flex: 1,
    backgroundColor: '#d0d9ed',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooterStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  postUsername: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f267e'
  },
  postBody: {
    fontSize: 20,
    color: '#1f267e',
    padding: 12
  },
})
