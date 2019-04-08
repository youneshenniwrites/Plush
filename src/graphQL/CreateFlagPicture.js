const CreateFlagPicture = `
  mutation (
    $id:ID!,
    $flagOwnerUsername: String!, 
    $flagOwnerId: String!
    ) {
    createFlag(input:{
      flagPictureId: $id,
      flagOwnerId: $flagOwnerId,
      flagOwnerUsername: $flagOwnerUsername
    }) {
      id
    }
  }
`
export default CreateFlagPicture