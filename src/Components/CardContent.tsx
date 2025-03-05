import { Button, CardContent, Checkbox } from '@mui/material';
import { Pencil, Trash2 } from 'lucide-react';

export const CardContentTodo: React.FC<{
    item: any;
    handleCompletedtask: (id: number) => void;
    handleValueTask: (item: any) => void;
    handleDeleteTask: (id: number) => void;
}> = ({ item, handleCompletedtask, handleValueTask, handleDeleteTask }) => {
    return (
        <CardContent key={item.id} className='flex justify-between items-center bg-gray-50 rounded-lg shadow-sm'>
            <div className='flex items-center'>
                <Checkbox checked={item.completed} onChange={() => handleCompletedtask(item.id)}></Checkbox>
                <span className={`${item.completed ? "line-through" : ""} text-gray-800`}>{item.task}</span>
            </div>
            <div>
                <Button onClick={() => handleValueTask(item)}><Pencil className='text-green-500' /></Button>
                <Button onClick={() => handleDeleteTask(item.id)}><Trash2 className='text-red-500' /></Button>
            </div>
        </CardContent>
    )
}