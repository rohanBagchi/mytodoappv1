import gql from "graphql-tag";

export const GET_TODOS = gql`
query GetTodos {
  todos {
    id
    title
    userId
    content
    complete
    user {
      email
      name
    }
  }
}
`;

export const ADD_TODO = gql`
mutation insertTodo($title: String, $complete: Boolean) {
  insert_todos(objects: {title: $title, complete: $complete}) {
    returning {
      id
      title
      userId
      content
      complete
      user {
        email
        name
      }
    }
  }
}
`;

export const UPDATE_TODO_STATUS = gql`
mutation MarkTodoStatus($id: uuid, $complete: Boolean) {
  update_todos(where: {id: {_eq: $id}}, _set: {complete: $complete}) {
    returning {
      id
      title
      userId
      content
      complete
      user {
        email
        name
      }
    }
  }
}
`;

export const DELETE_TODO = gql`
mutation DeleteTodo($id: uuid) {
  delete_todos(where: {id: {_eq: $id}}) {
    returning {
      id
    }
  }
}
`;