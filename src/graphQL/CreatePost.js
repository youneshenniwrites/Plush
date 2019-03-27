const CreatePost = `
  mutation(
    $postContent: String!, 
    $postOwnerId: String!, 
    $postOwnerUsername: String!
    ) {
    createPost(input:{
      postOwnerUsername: $postOwnerUsername,
      postOwnerId: $postOwnerId,
      postContent: $postContent
    }) {
      id
    }
  }
`

export default CreatePost;





