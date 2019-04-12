const listPictures = `
  query {
    listPictures{
      items {
        id
        visibility
        pictureOwnerId
        pictureOwnerUsername
        file {
          bucket
          region
          key
          uri
        }
        likes {
          items {
            id
            likeOwnerId
            likeOwnerUsername
          }
        }
        flags {
          items {
            id
            flagOwnerId
            flagOwnerUsername
          }
        }
      }
    }
  }
`

export default listPictures

