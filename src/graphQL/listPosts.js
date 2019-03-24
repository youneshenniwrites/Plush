import gql from 'graphql-tag';

const listPosts = gql`
  query listPosts {
    listPosts {
      items {
        id
        postContent
        postOwnerUsername
        postOwnerId
      }
    }
  }
`

export default listPosts;

