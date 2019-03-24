import gql from 'graphql-tag';

const CreatePost = gql`
  mutation createPost(
    $id: ID!, 
    $postContent: String!, 
    $postOwnerUsername: String!,
    $postOwnerId: String!
    ) {
    createPost(input: {
      id: $id,
      postContent: $postContent
      postOwnerUsername: $postOwnerUsername
      postOwnerId: $postOwnerId
    }) {
      id
      postContent
      postOwnerUsername
      postOwnerId
    }
  }
`

export default CreatePost;



