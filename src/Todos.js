import React from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const ADD_TODO = gql`
mutation insertTodo($title: String, $complete: Boolean) {
  insert_todos(objects: {title: $title, complete: $complete}) {
    returning {
      user {
        email
        name
      }
      content
      complete
      id
      title
    }
  }
}
`;

export default function Todos() {
  const [todo, setTodo] = React.useState('');

  const [addTodo, { data }] = useMutation(ADD_TODO)

  return (
    <div>
      <fieldset>
        <legend>
          Add todo
        </legend>
        <form onSubmit={e => {
          e.preventDefault();
          addTodo({
            variables: {
              "title": todo,
              "complete": false
            }
          })
        }}>
          <input
            type="text"
            value={todo}
            onChange={e => setTodo(e.target.value)}
          />

          <button>
            Add!
          </button>
        </form>
      </fieldset>
      <Query
        query={gql`
          {
            todos {
              id
              title
              userId
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          return (
            <pre>
              {JSON.stringify(data, null, 2)}
            </pre>
          )
        }}
      </Query>
    </div>
  )
}
