const DeleteLike = `
  mutation($id:ID!) {
    deleteLike(input:{
      id: $id,
    }) {
      id
    }
  }
`

export default DeleteLike;