import gql from 'graphql-tag';

const CreatePost = gql`
  mutation createPost(
    $id: ID!, 
    $postContent: String!, 
    $postOwnerUsername: String!,
    $postOwnerId: String!
    $visibility: Visibility,
    $file: S3Object
    ) {
    createPost(input: {
      id: $id,
      postContent: $postContent,
      postOwnerUsername: $postOwnerUsername,
      postOwnerId: $postOwnerId,
      file: $file,
      visibility: $visibility
    }) {
      id
      postContent
      postOwnerUsername
      postOwnerId
      visibility
      file {
        region
        bucket
        key
      }
    }
  }
`

export default CreatePost;



