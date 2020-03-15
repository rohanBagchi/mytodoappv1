import React from 'react';
import {
  Typography,
  Checkbox,
  List,
  Spin,
  Alert
} from 'antd';
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_TODO_STATUS, GET_TODOS } from 'domains/Todos/graphqlStuff';

const Todo = ({ id, title, complete }) => {
  const [updateTodoStatus, {
    loading: mutationLoading,
    error: mutationError,
  }] = useMutation(UPDATE_TODO_STATUS);

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

  return (
    <List.Item>
      <Spin spinning={mutationLoading}>
        <Checkbox
          checked={complete}
          onChange={handleTodoToggle}
        >
          <Typography.Text delete={complete}>
            {title}
          </Typography.Text>
        </Checkbox>
      </Spin>

      {mutationError && (
        <Alert message="Unable to update todo. Please try again" type="error" />
      )}
    </List.Item>
  );
}

export default Todo;