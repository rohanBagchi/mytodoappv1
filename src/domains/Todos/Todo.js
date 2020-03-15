import React from 'react';
import {
  Typography,
  Checkbox,
  List,
  Spin,
  Alert,
  Button
} from 'antd';
import {
  DeleteTwoTone,
} from '@ant-design/icons';
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_TODO_STATUS, DELETE_TODO, GET_TODOS } from 'domains/Todos/graphqlStuff';
import styled from 'styled-components/macro';

const TodoWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;
const TodoTitle = styled.div``;
const TodoActions = styled.div``;

const Todo = ({ id, title, complete }) => {
  const [updateTodoStatus, {
    loading: updateTodoStatusLoading,
    error: updateTodoStatusError,
  }] = useMutation(UPDATE_TODO_STATUS);
  
  const [deleteTodo, {
    loading: deleteTodoLoading,
    error: deleteTodoError,
  }] = useMutation(
    DELETE_TODO,
    {
      update(cache, { data }) {
        const {
          delete_todos: {
            returning
          }
        } = data;

        const deletedTodoId = returning?.[0]?.id;

        const { todos } = cache.readQuery({ query: GET_TODOS });
        const updatedTodos = todos.filter(t => t.id !== deletedTodoId);
        cache.writeQuery({
          query: GET_TODOS,
          data: { todos: updatedTodos },
        });
      }
    }
  );

  const handleTodoToggle = async (e) => {
    try {
      const { checked } = e.target;
      await updateTodoStatus({
        variables: {
          id,
          "complete": checked
        }
      });
    } catch (e) {
      console.error(`Unable to run mutation: updateTodoStatus`, e)
    }
  };
  
  const handleTodoDelete = async (e) => {
    try {
      await deleteTodo({
        variables: {
          id,
        }
      });
    } catch (e) {
      console.error(`Unable to run mutation: deleteTodo`, e)
    }
  };

  return (
    <List.Item>
      <Spin spinning={updateTodoStatusLoading || deleteTodoLoading}>
        <TodoWrapper>
          <TodoTitle>
            <Checkbox
              checked={complete}
              onChange={handleTodoToggle}
            >
              <Typography.Text delete={complete}>
                {title}
              </Typography.Text>
            </Checkbox>
          </TodoTitle>
          <TodoActions>
            <Button
              shape="circle"
              icon={<DeleteTwoTone />}
              onClick={handleTodoDelete}
            />
          </TodoActions>
        </TodoWrapper>
      </Spin>

      {(updateTodoStatusError || deleteTodoError) && (
        <Alert message="Unable to update todo. Please try again" type="error" />
      )}

    </List.Item>
  );
}

export default Todo;