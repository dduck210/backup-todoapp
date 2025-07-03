import { IconButton, ListItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const List = ({ todos, handleEdit, handleDelete }) => {
  return (
    <div>
      <List>
        {todos.map((todo) => (
          <ListItem
            key={todo.id}
            secondaryAction={
              <>
                <IconButton onClick={() => handleEdit(todo)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(todo.id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            {todo.text}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default List;
