const CreateLike = `
  mutation (
    $id:ID!,
    $likeOwnerUsername: String!, 
    $likeOwnerId: String!
    ) {
    createLike(input:{
      likePostId: $id,
      likeOwnerId: $likeOwnerId,
      likeOwnerUsername: $likeOwnerUsername
    }) {
      id
      post {
        id      
        postContent
      }
    }
  }
`
export default CreateLike;




