import gql from 'graphql-tag';

const CreatePicture = gql`
  mutation createPicture(
    $id: ID!, 
    $postOwnerUsername: String!,
    $postOwnerId: String!
    $visibility: Visibility,
    $file: S3Object
    ) {
    createPost(input: {
      id: $id,
      postOwnerUsername: $postOwnerUsername,
      postOwnerId: $postOwnerId,
      file: $file,
      visibility: $visibility
    }) {
      id
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

export default CreatePicture;



