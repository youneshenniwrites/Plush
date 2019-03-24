import gql from 'graphql-tag';

const CreatePost = gql`
  mutation createPost($id: ID!, $name: String!) {
    createPost(input: {
      id: $id,
      name: $name
    }) {
      id
      name
    }
  }
`

export default CreatePost;



