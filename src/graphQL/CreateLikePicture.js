const CreateLikePicture = `
  mutation (
    $id:ID!,
    $likeOwnerUsername: String!, 
    $likeOwnerId: String!
    ) {
    createLike(input:{
      likePictureId: $id,
      likeOwnerId: $likeOwnerId,
      likeOwnerUsername: $likeOwnerUsername
    }) {
      id
    }
  }
`
export default CreateLikePicture