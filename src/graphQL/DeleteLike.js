import gql from 'graphql-tag';

const DeleteLike = gql`
  mutation deleteLike($id: ID!) {
    deleteLike(input: {
      id: $id,
    }) {
      id
    }
  }
`

export default DeleteLike;