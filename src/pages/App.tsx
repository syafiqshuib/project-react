import React, { useState } from 'react';
import { useQuery, useMutation, gql } from "@apollo/client";
import { Button, Card, CircularProgress, TextField } from '@mui/material';
import Swal from "sweetalert2";
import './App.css';
import { CardContentTodo } from '../Components/CardContent';

// Define Todo model
interface Todo {
  id: number;
  task: string;
  completed: boolean;
}


const GET_LISTS = gql`
  query GetLists {
    lists {
      id
      task
      completed
    }
  }
`;

const SEARCH_LIST = gql`
  query SearchList($task: String!) {
    searchList(task: $task) {
      id
      task
      completed
    }
  }
`;

const ADD_LISTS = gql`
  mutation AddList($task: String!) {
    addList(task: $task) {
      id
      task
      completed
    }
  }
`;

const UPDATE_LIST = gql`
  mutation UpdateList($id: ID!) {
    updateList(id: $id) {
      id
      task
      completed
    }
  }
`;

const DELETE_LIST = gql`
  mutation DeleteList($id: ID!) {
    deleteList(id: $id)
  }
`;

const EDIT_LIST = gql`
  mutation EditList($id: ID!, $task: String!) {
    editList(id: $id, task: $task) {
      id
      task
      completed
    }
  }
`;


const TodoList: React.FC = () => {

  const [task, setTask] = useState<string>("");
  const [taskSearch, setTaskSearch] = useState<string>("");
  const [editTaskId, setEditTaskId] = useState<number | null>(null);

  const { data: listsData, loading, error, refetch } = useQuery(GET_LISTS);
  const { data: searchData } = useQuery(SEARCH_LIST, {
    variables: { task: taskSearch.trim() },
    skip: taskSearch.length < 1,
  });
  const [addList] = useMutation(ADD_LISTS);
  const [updateList] = useMutation(UPDATE_LIST);
  const [deleteList] = useMutation(DELETE_LIST);
  const [editList] = useMutation(EDIT_LIST);

  // Dynamic change the displayData based on taskSearch input
  const displayData = taskSearch ? searchData?.searchList : listsData?.lists;

  // Function to handle to task to be add or edit
  const handleAddOrEdit = async () => {
    if (!task.trim()) return;
    if (editTaskId) {
      await editList({ variables: { id: editTaskId, task: task.trim() } });
      setEditTaskId(null);
    } else {
      await addList({ variables: { task: task.trim() } });
    }
    setTask("");
    refetch();
  }

  // Function to handle to task to mark as complete
  const handleCompletedtask = async (id: number) => {
    await updateList({ variables: { id } });
    refetch();
  };

  // Function to handle to delete task with confirmation
  const handleDeleteTask = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteList({ variables: { id } });
        refetch();
        Swal.fire({
          title: "Deleted!", text: "Todo has been deleted.", icon: "success"
        });

      }
    });
  };

  // Function to handle todo item to pass to setTask and setEditTaskId
  const handleValueTask = async (item: Todo) => {
    setTask(item.task);
    setEditTaskId(item.id);
  };

  if (loading) return <div className='flex items-center justify-center min-h-screen'><CircularProgress /></div>;
  if (error) return <div className='flex items-center justify-center min-h-screen'><p>Error: {error.message}</p></div>;

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
      <Card className='w-full max-w-4xl bg-white shadow-lg rounded-2xl p-4'>
        <h1 className='text-2xl font-semibold text-center mb-6'>To-Do-List</h1>
        {listsData?.lists.length > 0 && (
          <div className='flex gap-2 mb-4'>
            <TextField label="Search Task" variant="outlined" className='flex-grow' value={taskSearch} onChange={(e) => setTaskSearch(e.target.value)} placeholder='Task ABC' />
          </div>
        )}

        <div className='space-y-2'>
          {displayData?.map((item: any) => (
            <CardContentTodo
              key={item.id}
              item={item}
              handleCompletedtask={handleCompletedtask}
              handleValueTask={handleValueTask}
              handleDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
        <div className='flex gap-2 mt-10'>
          <TextField label="New Task" variant="outlined" className='flex-grow' value={task} onChange={(e) => setTask(e.target.value)} placeholder='Task ABC' />
          <Button variant="contained" className='text-white px-4 py-2 rounded-lg' onClick={handleAddOrEdit}>{editTaskId ? 'Update' : 'Add'}</Button>
        </div>
      </Card>
    </div >
  );
}

export default TodoList;
