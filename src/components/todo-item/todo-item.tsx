import { useState, useRef, FormEvent } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { TTodoItem } from '../../services/types';

import s from './todo-item.module.sass';

interface ITodoItem {
    todoItem: TTodoItem;
    cardIndex: number;
    index: number;
    deleteTodoItem: (todoItem: TTodoItem, cardIndex: number) => void
    editTodoItem: (todoItem: TTodoItem, newTitle: string, cardIndex: number) => void
    moveTodoItemInCard: (dragIndex: number, hoverIndex: number, cardIndex: number) => void
}

export const TodoItem = ({ todoItem, deleteTodoItem, editTodoItem, index, moveTodoItemInCard, cardIndex }: ITodoItem) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(todoItem.title);
    const todoItemRef = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
        accept: 'todoItem',
        hover(item: { index: number; cardIndex: number; todoItem: TTodoItem }, monitor) {
            if (!todoItemRef.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex || item.cardIndex !== cardIndex) {
                return;
            }

            const hoverBoundingRect = todoItemRef.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            if (clientOffset) {
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;

                if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                    return;
                }
                if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                    return;
                }
                moveTodoItemInCard(dragIndex, hoverIndex, item.cardIndex)
                item.index = hoverIndex;
            }
        }
    })

    const [{ isDragging }, drag] = useDrag({
        type: 'todoItem',
        item: () => {
            return { 
                index,
                cardIndex,
                todoItem
            };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const changeTitle = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        editTodoItem(todoItem, title, cardIndex);
        setEdit(false)
    }

    drag(drop(todoItemRef));

    return (
        <div  
            ref={todoItemRef}
            className={`${s.todo_item} ${isDragging ? s.dragging : ''}`}
        >
            {edit && (
                <form onSubmit={changeTitle}>
                    <textarea 
                        className={s.todo_item_textarea} 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                    ></textarea>
                    <button>Сохранить</button>
                </form>
            )}
            {!edit && (
                <div>
                    <span>{todoItem.title}</span>
                    <div className={s.item_edit}>
                        <button onClick={() => deleteTodoItem(todoItem, cardIndex)}>Удалить</button>
                        <button onClick={() => setEdit(true)}>Изменить</button>
                    </div>
                </div>
            )}
        </div>
    )
}