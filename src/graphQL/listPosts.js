import gql from 'graphql-tag';

// List posts and their likes
const listPosts = gql`
  query listPosts {
    listPosts {
      items {
        id
        postContent
        postOwnerId
        postOwnerUsername
        likes {
          items {
            id
            likeOwnerId
            likeOwnerUsername
          }
        }
      }
    }
  }
`

export default listPosts;

