import React from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import {
  Typography,
  Checkbox,
  List,
  Button,
  Input,
  Form
} from 'antd';

const GET_TODOS = gql`
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

const ADD_TODO = gql`
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

export default function Todos() {
  const [addTodo, { data }] = useMutation(
    ADD_TODO,
    {
      update(cache, { data }) {
        const {
          insert_todos: {
            returning
          }
        } = data;
        const { todos } = cache.readQuery({ query: GET_TODOS });
        cache.writeQuery({
          query: GET_TODOS,
          data: { todos: todos.concat(returning) },
        });
      }
    }
  );

  const [form] = Form.useForm();

  const onFinish = ({ todo }) => {
    addTodo({
      variables: {
        "title": todo,
        "complete": false
      }
    });
  }

  return (
    <div style={{width: 300}}>
      <fieldset>
        <legend>
          Add todo
        </legend>
        <Form
          form={form}
          layout="inline"
          onFinish={onFinish}
        >
          <Form.Item
            name="todo"
            rules={[{ required: true, message: 'Please input your todo!' }]}
          >
            <Input
              placeholder="What to do?"
            />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !form.getFieldValue('todo') ||
                  !form.isFieldsTouched(true) ||
                  form.getFieldsError().filter(({ errors }) => errors.length).length
                }
              >
                Log in
              </Button>
            )}
          </Form.Item>
        </Form>
      </fieldset>
      <Query query={GET_TODOS}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          
          return (
            <List
              itemLayout="vertical"
              dataSource={data.todos}
              renderItem={({ id, title, complete }) => (
                <Todo
                  key={id}
                  title={title}
                  complete={complete}
                />
              )}
            />
          );
        }}
      </Query>
    </div>
  )
}

const Todo = ({ title, complete }) => (
  <List.Item>
    <Checkbox
      checked={complete}
      onChange={e => console.log("Checkbox clicked!", e)}
    >
      <Typography.Text>
        {title}
      </Typography.Text>
    </Checkbox>
  </List.Item>
);
