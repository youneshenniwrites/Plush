const DeleteLikePost = `
  mutation($id:ID!) {
    deleteLike(input:{
      id: $id,
    }) {
      id
    }
  }
`

export default DeleteLikePost