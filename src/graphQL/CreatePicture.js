import gql from 'graphql-tag'

const CreatePicture = gql`
mutation ($input: CreatePictureInput!) {
  createPicture(input: $input) {
    id
    visibility
    pictureOwnerUsername
    pictureOwnerId
    file {
      region
      bucket
      key
      uri
    }
  }
}`

export default CreatePicture



