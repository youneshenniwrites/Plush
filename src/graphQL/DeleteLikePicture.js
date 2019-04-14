const DeleteLikePicture = `
  mutation($id:ID!) {
    deleteLike(input:{
      id: $id,
    }) {
      id
    }
  }
`

export default DeleteLikePicture