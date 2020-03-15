import React from 'react';
import {
  Typography,
  Checkbox,
  List,
} from 'antd';

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

export default Todo;