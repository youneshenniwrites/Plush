import gql from 'graphql-tag'

const DeletePicture = gql`
mutation ($input: DeletePictureInput!) {
  deletePicture(input: $input) {
    id
  }
}`

export default DeletePicture
