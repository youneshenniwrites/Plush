const DeletePost = `
  mutation($id:ID!) {
    deletePost(input:{
      id: $id,
    }) {
      id
    }
  }
`

export default DeletePost
