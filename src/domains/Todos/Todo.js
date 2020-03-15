import React from 'react';
import {
  Typography,
  Checkbox,
  List,
  Spin,
  Alert,
  Button,
  Form,
  Input,
  Tooltip
} from 'antd';
import {
  DeleteTwoTone,
  EditTwoTone,
  SaveTwoTone,
  CloseCircleTwoTone
} from '@ant-design/icons';
import { useMutation } from "@apollo/react-hooks";
import {
  UPDATE_TODO_STATUS,
  DELETE_TODO,
  GET_TODOS,
  UPDATE_TODO_TITLE,
} from 'domains/Todos/graphqlStuff';
import styled from 'styled-components/macro';

const TodoWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;
const TodoTitle = styled.div``;
const TodoActions = styled.div`
  display: flex;

  > button:first-child {
    margin-right: 5px;
  }
`;

const Todo = ({ id, title, complete }) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const [updateTodoStatus, {
    loading: updateTodoStatusLoading,
    error: updateTodoStatusError,
  }] = useMutation(UPDATE_TODO_STATUS);
  
  const [updateTodoTitle, {
    loading: updateTodoTitleLoading,
    error: updateTodoTitleError,
  }] = useMutation(
    UPDATE_TODO_TITLE,
    {
      onCompleted() {
        setIsEditing(false);
      }
    }
  );

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

  const handleTodoEdit = async ({ id, title }) => {
    try {
      await updateTodoTitle({
        variables: {
          id,
          title,
        }
      });
    } catch (e) {
      console.error(`Unable to run mutation: updateTodoTitle`, e)
    }
  };

  return (
    <List.Item>
      <Spin spinning={updateTodoStatusLoading || deleteTodoLoading}>
        <TodoWrapper>
          {isEditing && (
            <TodoForm
              title={title}
              id={id}
              handleSubmit={handleTodoEdit}
              saveInProgress={updateTodoTitleLoading}
              saveError={updateTodoTitleError}
              onCancel={() => setIsEditing(false)}
            />
          )}
          
          {!isEditing && (
            <React.Fragment>
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
                <Button
                  shape="circle"
                  icon={<EditTwoTone />}
                  onClick={() => setIsEditing(true)}
                />
              </TodoActions>
            </React.Fragment>
          )}
        </TodoWrapper>
      </Spin>

      {(updateTodoStatusError || deleteTodoError) && (
        <Alert message="Unable to update todo. Please try again" type="error" />
      )}
    </List.Item>
  );
}

export default Todo;

const StyledBtn = styled(Button)`
  &:first-child {
    margin-right: 5px;
  }
`;

const TodoForm = (props) => {
  const {
    id,
    title,
    handleSubmit,
    saveInProgress,
    saveError,
    onCancel
  } = props;

  const [form] = Form.useForm();

  React.useEffect(() => {
    if (title) {
      form.setFields([{
        name: ['todo'],
        value: title
      }]);
    }
  }, [])


  return (
    <Form
      form={form}
      layout="inline"
      onFinish={({ todo }) => handleSubmit({ id, title: todo })}
    >
      <Form.Item
        name="todo"
        disabled={saveInProgress}
        rules={[{ required: true, message: 'Please input your todo!' }]}
        validateStatus={saveError ? 'error' : null}
      >
        <Input
          placeholder="What to do?"
        />
      </Form.Item>

      <Form.Item shouldUpdate>
        {() => (
          // <Button
          //   type="primary"
          //   htmlType="submit"
          //   loading={saveInProgress}
          //   disabled={
          //     !form.getFieldValue('todo') ||
          //     !form.isFieldsTouched(true) ||
          //     form.getFieldsError().filter(({ errors }) => errors.length).length
          //   }
          // >
          //   {submitBtnLabel}
          // </Button>
          <React.Fragment>

            <StyledBtn
              shape="circle"
              icon={<SaveTwoTone />}
              htmlType="submit"
              loading={saveInProgress}
              disabled={
                !form.getFieldValue('todo') ||
                !form.isFieldsTouched(true) ||
                form.getFieldsError().filter(({ errors }) => errors.length).length
              }
            />
            
            <Tooltip title="Cancel Edit">
              <StyledBtn
                shape="circle"
                icon={<CloseCircleTwoTone />}
                htmlType="button"
                disabled={saveInProgress}
                onClick={onCancel}
              />
            </Tooltip>
          </React.Fragment>
        )}
      </Form.Item>
    </Form>
  )
}