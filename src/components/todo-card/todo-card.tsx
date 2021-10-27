import { useDrop } from 'react-dnd';

import { TCardItem, TTodoItem } from '../../services/types';
import { TodoCardFooter } from '../todo-card-footer/todo-card-footer';
import { TodoItem } from '../todo-item/todo-item';

import s from './todo-card.module.sass';

interface ITodoCard {
    cardInfo: TCardItem,
    cardIndex: number
    addNewTodoItem: (todoItemTitle: string, cardIndex: number) => void
    deleteTodoItem: (todoItem: TTodoItem, cardIndex: number) => void
    editTodoItem: (todoItem: TTodoItem, newTitle: string, cardIndex: number) => void
    deleteCardItem: (cardItem: TCardItem) => void
    moveTodoItemInCard: (dragIndex: number, hoverIndex: number, cardIndex: number) => void
    moveTodoItemToAnotherBox: (dragCardIndex: number, dropCardIndex: number, todoItem: TTodoItem) => void
}

export const TodoCard = ( props: ITodoCard) => {
    const {
        cardInfo, 
        cardIndex, 
        addNewTodoItem, 
        deleteTodoItem, 
        editTodoItem, 
        deleteCardItem, 
        moveTodoItemInCard, 
        moveTodoItemToAnotherBox
    } = props;

    const [{ isHover }, dropRef] = useDrop({
        accept: 'todoItem',
        drop(item: { index: number; cardIndex: number; todoItem: TTodoItem } ) {
            if (cardIndex !== item.cardIndex) {
                moveTodoItemToAnotherBox(item.cardIndex, cardIndex, item.todoItem)
            }
        },
        collect: monitor => ({
            isHover: monitor.isOver(),
        })
    })

    const handleClickDeleteCardItem = () => {
        deleteCardItem(cardInfo)
    }

    const { title, content } = cardInfo

    return (
        <div>
            <div 
                ref={dropRef} 
                className={`${s.card_wrapper} ${isHover ? s.drop_hover : ''}`}
            >
                <div className={s.card_header_wrapper}>   
                    <h3 className={s.card_header}>{title}</h3>
                    <div 
                        className={s.card_delete} 
                        onClick={handleClickDeleteCardItem}
                    >✖</div>
                </div>
                <div className={s.card_content}>
                    {content.map((todoItem, index) => (
                        <TodoItem 
                            todoItem={todoItem}
                            key={todoItem.id}
                            index={index}
                            cardIndex={cardIndex}
                            deleteTodoItem={deleteTodoItem}
                            editTodoItem={editTodoItem}
                            moveTodoItemInCard={moveTodoItemInCard}
                        />
                    ))}
                </div>

                <TodoCardFooter 
                    cardIndex={cardIndex}
                    addNewTodoItem={addNewTodoItem}
                />
            </div>
        </div>
    )
}