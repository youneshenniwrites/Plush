import gql from 'graphql-tag';

const DeletePost = gql`
  mutation deletePost($id: ID!) {
    deletePost(input: {
      id: $id,
    }) {
      id
    }
  }
`

export default DeletePost;